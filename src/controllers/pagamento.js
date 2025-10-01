const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://www.asaas.com/api/v3";

async function criarPagamento(req, res) {
  const usuarioId = req.usuario.id;
  const { pedidoId, metodoPagamento } = req.body;

  try {
    // Buscar pedido e validar
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { itens: { include: { produto: true } } },
    });

    if (!pedido) return res.status(404).json({ message: "Pedido não encontrado." });
    if (pedido.usuarioId !== usuarioId) return res.status(403).json({ message: "Acesso negado." });
    if (pedido.status !== "PENDENTE") return res.status(400).json({ message: "Pedido já processado." });

    // Calcular total
    const total = pedido.itens.reduce((acc, item) => acc + item.quantidade * item.produto.preco, 0);

    // Buscar dados do usuário
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

    // Criar cliente no Asaas (ideal salvar o id para reuso)
    const clienteResponse = await axios.post(`${ASAAS_API_URL}/customers`, {
      name: usuario.nome,
      email: usuario.email,
      cpfCnpj: "00000000000", // ajustar
      phone: usuario.telefone,
      externalReference: String(usuarioId),
    }, {
      headers: { "access_token": ASAAS_API_KEY }
    });

    const clienteId = clienteResponse.data.id;

    // Criar cobrança no Asaas
    const cobrancaResponse = await axios.post(`${ASAAS_API_URL}/payments`, {
      customer: clienteId,
      billingType: metodoPagamento === "PIX" ? "PIX" : metodoPagamento === "BOLETO" ? "BOLETO" : "CREDIT_CARD",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: total.toFixed(2),
      description: `Pedido #${pedidoId} - PetShop`,
      externalReference: `pedido_${pedidoId}`,
    }, {
      headers: { "access_token": ASAAS_API_KEY }
    });

    return res.status(201).json({
      pixQrCode: cobrancaResponse.data.pixQrCode,
      pixCopiaCola: cobrancaResponse.data.pixCopiaCola,
      linkPagamento: cobrancaResponse.data.invoiceUrl,
      paymentId: cobrancaResponse.data.id,
    });

  } catch (error) {
    console.error("Erro ao criar pagamento Asaas:", error.response?.data || error.message);
    return res.status(500).json({ message: "Erro ao criar pagamento." });
  }
}

module.exports = {
  criarPagamento,
};