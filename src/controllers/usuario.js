const prisma = require('../connect');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // ✅ importando bcrypt

const SECRET = process.env.JWT_SECRET || 'secreta';
const SECRET_RECUPERACAO = process.env.JWT_SECRET_RECUPERACAO || 'recuperar_senha';

// Configuração do envio de e-mail (com verificação para evitar crash se env vars ausentes)
let transporter;
try {
  transporter = nodemailer.createTransport({  // ✅ Corrigido: createTransport (não createTransporter)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} catch (err) {
  console.warn("⚠️ Configuração de email falhou (env vars ausentes?). Recuperação de senha pode não funcionar.");
  transporter = null;  // Define como null para evitar crashes em funções que usam email
}

// Listar todos os usuários (somente ADMIN)
const listar = async (req, res) => {
  try {
    if (req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({ erro: "Acesso negado. Apenas ADMIN pode listar usuários." });
    }

    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, telefone: true, tipo: true }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

// Criar usuário com hash de senha
const create = async (req, res) => {
  const { nome, email, telefone, senha, tipo, cpf } = req.body;
  try {
    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    console.log("🔐 Senha hasheada para novo usuário:", senhaHash.substring(0, 20) + "..."); // Log parcial para debug

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: senhaHash,
        tipo: tipo || "CLIENTE",
        cpf: cpf || null // Permite null se não fornecido
      },
    });
    console.log("✅ Usuário criado com sucesso:", usuario.id, usuario.email); // Log para debug
    res.status(201).json(usuario);
  } catch (err) {
    console.error("❌ Erro ao criar usuário:", err); // Log detalhado
    if (err.code === 'P2002') { // Erro de duplicata (email ou cpf único)
      const mensagem = err.meta?.target?.includes('email') ? "E-mail já cadastrado." : "CPF já cadastrado.";
      return res.status(409).json({ message: mensagem }); // 409 para conflito
    }
    res.status(400).json({ message: "Erro ao criar usuário.", details: err.message });
  }
};

// Login com comparação de hash
const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    console.log("🔍 Tentativa de login para email:", email); // Log para debug

    if (!email || !senha) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    console.log("👤 Usuário encontrado:", usuario ? `ID ${usuario.id}` : "NÃO ENCONTRADO"); // Log para debug

    if (!usuario) {
      console.log("❌ Email não encontrado no banco."); // Log
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log("🔑 Comparação de senha:", senhaValida ? "VÁLIDA" : "INVÁLIDA"); // Log para debug

    if (!senhaValida) {
      console.log("❌ Senha incorreta."); // Log
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo }, 
      SECRET, 
      { expiresIn: '2h' }
    );
    console.log("✅ Login bem-sucedido para:", usuario.email); // Log
    res.status(200).json({ message: 'Login bem-sucedido', token, tipo: usuario.tipo });

  } catch (err) {
    console.error("❌ Erro interno no login:", err); // Log detalhado
    // Não retorna o erro inteiro para segurança — só uma mensagem genérica
    res.status(500).json({ message: 'Erro interno no servidor. Tente novamente.' });
  }
};

// Solicitar recuperação de senha
const solicitarRecuperacao = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(200).json({ message: 'Se o email estiver cadastrado, você receberá instruções.' });
    }

    if (!transporter) {
      return res.status(500).json({ message: 'Serviço de email não configurado no momento.' });
    }

    const tokenRecuperacao = jwt.sign({ id: usuario.id }, SECRET_RECUPERACAO, { expiresIn: '15m' });
    const link = `http://localhost:5500/resetar-senha.html?token=${tokenRecuperacao}`;

    await transporter.sendMail({
      from: '"4 Patas PetShop" <naoresponda@4patas.com>',
      to: email,
      subject: 'Recuperação de Senha',
      html: `<p>Você solicitou a recuperação de senha.</p>
             <p><a href="${link}">Clique aqui para redefinir sua senha</a></p>
             <p>Este link expira em 15 minutos.</p>`
    });

    res.status(200).json({ message: 'Se o email estiver cadastrado, você receberá instruções.' });
  } catch (err) {
    console.error("❌ Erro na recuperação de senha:", err);
    res.status(500).json({ message: 'Erro ao enviar email de recuperação.' });
  }
};

// Resetar senha com hash
const resetarSenha = async (req, res) => {
  const { token, novaSenha } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_RECUPERACAO);

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await prisma.usuario.update({
      where: { id: decoded.id },
      data: { senha: senhaHash } // salva hash
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error("❌ Erro ao resetar senha:", err);
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = {
  listar,
  create,
  login,
  solicitarRecuperacao,
  resetarSenha
};