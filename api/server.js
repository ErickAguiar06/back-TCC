const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();


const allowedOrigins = [
  'http://localhost:5500',
  'https://erickaguiar06.github.io' 
];

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());


// Rotas existentes
const rota = require('../src/routes');
app.use('/', rota);

// Rota de recuperação de senha
app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // 2. Criar transporte de e-mail
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // ex: smtp.gmail.com
      port: process.env.EMAIL_PORT, // ex: 465
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 3. Enviar e-mail
    await transporter.sendMail({
      from: `"Petshop 4 Patas" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Olá, ${usuario.nome}. Aqui está seu link para recuperar a senha: http://localhost:5500/front/redefinir.html?email=${email}`,
      html: `<p>Olá, <b>${usuario.nome}</b>!</p>
             <p>Clique no link abaixo para redefinir sua senha:</p>
             <a href="http://localhost:5500/front/redefinir.html?email=${email}">Recuperar senha</a>`
    });

    res.json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação' });
  }
});

const axios = require('axios');

app.post('/create-payment', async (req, res) => {
  const { carrinho, cliente } = req.body;

  try {
    // Montar itens para Asaas
    const valorTotal = carrinho.reduce((total, p) => total + p.preco * p.quantidade, 0);

    const response = await axios.post(`${process.env.ASAAS_BASE_URL}/payments`, {
      customer: cliente.idAsaas, // ID do cliente na Asaas
      billingType: 'PIX', // ou CREDIT_CARD
      value: valorTotal,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Pedido Petshop 4 Patas'
    }, {
      headers: { 'access_token': process.env.ASAAS_API_KEY }
    });

    res.json({ paymentId: response.data.id, status: response.data.status });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Erro ao criar pagamento Asaas' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});