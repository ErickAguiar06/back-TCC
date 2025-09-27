// controllers/pedido.js
const prisma = require('../connect'); // usa o mesmo prisma do usuario.js
const asaas = require("../../services/asaas"); // nossa instância configurada

module.exports = {
  // Criar pedido e gerar pagamento no Asaas
  async create(req, res) {
    try {
      const usuarioLogado = req.usuario;
      if (!usuarioLogado?.id) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const { itens, metodoPagamento } = req.body;

      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Itens do pedido inválidos." });
      }

      // 1️⃣ Criar pedido no banco
      const pedido = await prisma.pedido.create({
        data: {
          usuarioId: usuarioLogado.id,
          itens: {
            create: itens.map(item => ({
              produtoId: item.id,
              quantidade: item.quantidade,
            })),
          },
        },
        include: {
          itens: { include: { produto: true } },
          usuario: true,
        },
      });

      // 2️⃣ Calcular valor total
      const valorTotal = pedido.itens.reduce(
        (acc, it) => acc + it.produto.preco * it.quantidade,
        0
      );

      // 3️⃣ Criar ou buscar cliente no Asaas
      let clienteAsaas;
      try {
        const resp = await asaas.get("/customers", { params: { email: pedido.usuario.email } });
        if (resp.data?.data?.length > 0) {
          clienteAsaas = resp.data.data[0];
        }
      } catch (err) {
        console.warn("Cliente não encontrado no Asaas:", err.response?.data || err.message);
      }

      if (!clienteAsaas) {
        const respCreate = await asaas.post("/customers", {
          name: pedido.usuario.nome,
          email: pedido.usuario.email,
          mobilePhone: pedido.usuario.telefone || undefined,
        });
        clienteAsaas = respCreate.data;
      }
      
      // 4️⃣ Criar pagamento PIX no Asaas
      const paymentResp = await asaas.post("/payments", {
        customer: clienteAsaas.id,
        billingType: metodoPagamento || "PIX",
        value: Number(valorTotal.toFixed(2)),
        dueDate: new Date().toISOString().split("T")[0],
        description: `Pedido #${pedido.id} - Petshop`,
        externalReference: `pedido_${pedido.id}`,
        callbackUrl: "https://back-tcc.vercel.app/webhook/asaas" // opcional
      });

      const pagamento = paymentResp.data;

      return res.status(201).json({
        message: "Pedido criado e cobrança gerada com sucesso.",
        pedido,
        pagamentoAsaas: pagamento,
        linkPagamento: pagamento.invoiceUrl || null,
        pixQrCode: pagamento.pixQrCode || null,
        pixCopiaCola: pagamento.pixCopiaECola || null
      });

    } catch (error) {
      console.error("Erro ao criar pedido:", error.response?.data || error.message);
      return res.status(500).json({
        error: "Erro ao criar pedido.",
        detalhes: error.message,
      });
    }
  },

async listarPorUsuario(req, res) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { usuarioId: req.usuario.id },
      include: { itens: { include: { produto: true } } }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar seus pedidos." });
  }
}

};