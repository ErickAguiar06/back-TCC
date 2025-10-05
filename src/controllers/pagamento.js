const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_BASE_URL || "https://sandbox.asaas.com/api/v3"; // ✅ Usa .env (sandbox por default)

exports.criarPagamento = async (req, res) => {
  try {
    // ✅ 1. Pega usuário logado
    const usuarioId = req.user?.id || req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const { pedidoId, metodoPagamento } = req.body;

    if (!pedidoId || !metodoPagamento) {
      return res.status(400).json({ message: "pedidoId e metodoPagamento são obrigatórios." });
    }

    // ✅ 2. Busca pedido no banco
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) },
      include: {
        itens: { include: { produto: true } },
      },
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (pedido.usuarioId !== usuarioId) {
      return res.status(403).json({ message: "Você não tem permissão para pagar este pedido." });
    }

    if (pedido.status !== "PENDENTE") {
      return res.status(400).json({ message: "Este pedido já foi processado." });
    }

    // ✅ 3. Calcula total do pedido
    const total = pedido.itens.reduce(
      (acc, item) => acc + item.quantidade * Number(item.produto.preco),
      0
    );

    if (total <= 0) {
      return res.status(400).json({ message: "Valor total inválido para pagamento." });
    }

    // ✅ 4. Busca dados do usuário
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // ✅ 5. Verifica se cliente já existe no Asaas (usando externalReference)
    let clienteId;
    try {
      const clienteBusca = await axios.get(`${ASAAS_API_URL}/customers?externalReference=${usuarioId}`, {
        headers: { access_token: ASAAS_API_KEY }, // ✅ Correto para Asaas
      });

      if (clienteBusca.data?.data?.length > 0) {
        clienteId = clienteBusca.data.data[0].id;
      }
    } catch (err) {
      console.warn("Aviso: cliente não encontrado no Asaas, criando um novo...");
    }

    // ✅ 6. Cria cliente no Asaas se não existir
    if (!clienteId) {
      // ✅ Validação obrigatória: CPF deve existir (removido fallback inválido)
      if (!usuario.cpf) {
        return res.status(400).json({ 
          message: "CPF não cadastrado. Por favor, adicione seu CPF no perfil ou cadastre-se novamente." 
        });
      }

      const clienteResponse = await axios.post(
        `${ASAAS_API_URL}/customers`,
        {
          name: usuario.nome,
          email: usuario.email,
          cpfCnpj: usuario.cpf, // ✅ Usa o CPF real (deve ser válido)
          phone: usuario.telefone || "",
          externalReference: String(usuarioId),
        },
        {
          headers: { access_token: ASAAS_API_KEY }, // ✅ Padronizado para Asaas (não Bearer)
        }
      );
      clienteId = clienteResponse.data.id;
      console.log("✅ Cliente criado no Asaas:", clienteId); // Log para debug
    }

    // ✅ 7. Cria cobrança no Asaas
    const cobrancaResponse = await axios.post(
      `${ASAAS_API_URL}/payments`,
      {
        customer: clienteId,
        billingType:
          metodoPagamento === "PIX"
            ? "PIX"
            : metodoPagamento === "BOLETO"
            ? "BOLETO"
            : "CREDIT_CARD",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // +3 dias
          .toISOString()
          .split("T")[0],
        value: total.toFixed(2),
        description: `Pedido #${pedidoId} - PetShop`,
        externalReference: `pedido_${pedidoId}`,
      },
      {
        headers: { access_token: ASAAS_API_KEY }, // ✅ Correto
      }
    );

    const cobranca = cobrancaResponse.data;
    console.log("✅ Cobrança criada no Asaas:", cobranca.id); // Log para debug

    // ✅ 8. Retorna dados para o front exibir
    return res.status(201).json({
      pixQrCode: cobranca.pixQrCode,
      pixCopiaCola: cobranca.pixCopiaCola,
      linkPagamento: cobranca.invoiceUrl,
      paymentId: cobranca.id,
    });
  } catch (error) {
    console.error("❌ Erro ao criar pagamento Asaas:");
    if (error.response) {
      // Erro de resposta do Asaas (ex: 400, 401, 422)
      console.error("  Status:", error.response.status);
      console.error("  Dados do erro:", error.response.data); // Detalhes do Asaas
      return res.status(error.response.status).json({
        message: "Erro na API do Asaas.",
        detalhe: error.response.data,
      });
    } else if (error.request) {
      // Erro de rede (sem resposta)
      console.error("  Erro de conexão:", error.request);
      return res.status(500).json({
        message: "Erro de conexão com o Asaas.",
        detalhe: error.message,
      });
    } else {
      // Erro interno (ex: validação)
      console.error("  Erro interno:", error.message);
      return res.status(500).json({
        message: "Erro interno ao processar pagamento.",
        detalhe: error.message,
      });
    }
  }
};