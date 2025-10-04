const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://www.asaas.com/api/v3";

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
        headers: { access_token: ASAAS_API_KEY },
      });

      if (clienteBusca.data?.data?.length > 0) {
        clienteId = clienteBusca.data.data[0].id;
      }
    } catch (err) {
      console.warn("Aviso: cliente não encontrado no Asaas, criando um novo...");
    }

    // ✅ 6. Cria cliente no Asaas se não existir
    if (!clienteId) {
      const clienteResponse = await axios.post(
        `${ASAAS_API_URL}/customers`,
        {
          name: usuario.nome,
          email: usuario.email,
          cpfCnpj: usuario.cpf || "00000000000", // Ajuste: se não tiver CPF no banco
          phone: usuario.telefone || "",
          externalReference: String(usuarioId),
        },
        {
          headers: { access_token: ASAAS_API_KEY },
        }
      );

      clienteId = clienteResponse.data.id;
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
        headers: { access_token: ASAAS_API_KEY },
      }
    );

    const cobranca = cobrancaResponse.data;

    // ✅ 8. Retorna dados para o front exibir
    return res.status(201).json({
      pixQrCode: cobranca.pixQrCode,
      pixCopiaCola: cobranca.pixCopiaCola,
      linkPagamento: cobranca.invoiceUrl,
      paymentId: cobranca.id,
    });
  } catch (error) {
    console.error(
      "Erro ao criar pagamento Asaas:",
      error.response?.data || error.message || error
    );

    return res.status(500).json({
      message: "Erro ao criar pagamento.",
      detalhe: error.response?.data || error.message,
    });
  }
};
