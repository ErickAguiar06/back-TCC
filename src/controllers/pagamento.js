const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY?.trim();
const ASAAS_API_URL = process.env.ASAAS_BASE_URL?.trim() || "https://sandbox.asaas.com/api/v3";

exports.criarPagamento = async (req, res) => {
  try {
    // 1️⃣ Pega usuário logado
    const usuarioId = req.user?.id || req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const { pedidoId, metodoPagamento } = req.body;
    if (!pedidoId || !metodoPagamento) {
      return res.status(400).json({ message: "pedidoId e metodoPagamento são obrigatórios." });
    }

    // 2️⃣ Busca pedido no banco
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) },
      include: { itens: { include: { produto: true } } },
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

    // 3️⃣ Calcula total do pedido
    const total = pedido.itens.reduce(
      (acc, item) => acc + item.quantidade * Number(item.produto.preco),
      0
    );
    if (total <= 0) {
      return res.status(400).json({ message: "Valor total inválido para pagamento." });
    }

    // 4️⃣ Busca dados do usuário
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // 5️⃣ Verifica se cliente já existe no Asaas (usando externalReference)
    let clienteId;
    try {
      const clienteBusca = await axios.get(
        `${ASAAS_API_URL}/customers?externalReference=${usuarioId}`,
        { headers: { access_token: ASAAS_API_KEY } }
      );

      if (clienteBusca.data?.data?.length > 0) {
        clienteId = clienteBusca.data.data[0].id;
        console.log("✅ Cliente já existe no Asaas:", clienteId);
      }
    } catch (err) {
      console.warn("⚠️ Cliente não encontrado no Asaas, será criado um novo...");
    }

    // 6️⃣ Cria cliente no Asaas se não existir
    if (!clienteId) {
      if (!usuario.cpf) {
        return res.status(400).json({
          message: "CPF não cadastrado. Adicione no perfil ou cadastre-se novamente.",
        });
      }

      const clienteResponse = await axios.post(
        `${ASAAS_API_URL}/customers`,
        {
          name: usuario.nome,
          email: usuario.email,
          cpfCnpj: usuario.cpf,
          phone: usuario.telefone || "",
          externalReference: String(usuarioId),
        },
        { headers: { access_token: ASAAS_API_KEY } }
      );
      clienteId = clienteResponse.data.id;
      console.log("✅ Cliente criado no Asaas:", clienteId);
    }

    // 7️⃣ Cria cobrança no Asaas
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
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        value: total.toFixed(2),
        description: `Pedido #${pedidoId} - PetShop`,
        externalReference: `pedido_${pedidoId}`,
      },
      { headers: { access_token: ASAAS_API_KEY } }
    );

    const cobranca = cobrancaResponse.data;
    console.log("✅ Cobrança criada no Asaas:", cobranca.id);

    // 8️⃣ Retorna dados para o front
    return res.status(201).json({
      pixQrCode: cobranca.pixQrCode,
      pixCopiaCola: cobranca.pixCopiaCola,
      linkPagamento: cobranca.invoiceUrl,
      paymentId: cobranca.id,
    });
  } catch (error) {
    console.error("❌ Erro ao criar pagamento Asaas:");
    if (error.response) {
      console.error("  Status:", error.response.status);
      console.error("  Dados do erro:", error.response.data);
      return res.status(error.response.status).json({
        message: "Erro na API do Asaas.",
        detalhe: error.response.data,
      });
    } else if (error.request) {
      console.error("  Erro de conexão:", error.request);
      return res.status(500).json({
        message: "Erro de conexão com o Asaas.",
        detalhe: error.message,
      });
    } else {
      console.error("  Erro interno:", error.message);
      return res.status(500).json({
        message: "Erro interno ao processar pagamento.",
        detalhe: error.message,
      });
    }
  }
};
