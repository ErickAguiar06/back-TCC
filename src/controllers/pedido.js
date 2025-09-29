// controllers/pedido.js
const prisma = require('../connect');
const asaas = require("../../services/asaas"); // cliente axios do Asaas

module.exports = {
  // 🛒 Criar pedido e gerar pagamento no Asaas
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

      // 3️⃣ Buscar ou criar cliente no Asaas
      let clienteAsaas;
      try {
        const resp = await asaas.get("/customers", {
          params: { email: pedido.usuario.email }
        });
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

      // 4️⃣ Criar cobrança no Asaas
      const paymentResp = await asaas.post("/payments", {
        customer: clienteAsaas.id,
        billingType: metodoPagamento || "PIX", // PIX, CREDIT_CARD ou BOLETO
        value: Number(valorTotal.toFixed(2)),
        dueDate: new Date().toISOString().split("T")[0],
        description: `Pedido #${pedido.id} - Petshop`,
        externalReference: `pedido_${pedido.id}`,
        callbackUrl: "https://back-tcc.vercel.app/webhook/asaas"
      });

      const pagamento = paymentResp.data;

      // 5️⃣ Atualizar status do pedido
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { status: "AGUARDANDO_PAGAMENTO" }
      });

      return res.status(201).json({
        message: "Pedido criado e cobrança gerada com sucesso.",
        pedido,
        pagamentoAsaas: pagamento,
        linkPagamento: pagamento.invoiceUrl || null,
        pixQrCode: pagamento.pixQrCodeImage || null,
        pixCopiaCola: pagamento.pixCopiaECola || null
      });

    } catch (error) {
      console.error("❌ Erro ao criar pedido:", error.response?.data || error.message);
      return res.status(500).json({
        error: "Erro ao criar pedido.",
        detalhes: error.response?.data || error.message,
      });
    }
  },

  // 📦 Listar pedidos do usuário autenticado
  async listarPorUsuario(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        where: { usuarioId: req.usuario.id },
        include: { itens: { include: { produto: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(pedidos);
    } catch (error) {
      console.error("❌ Erro ao listar pedidos:", error.message);
      return res.status(500).json({ error: "Erro ao buscar seus pedidos." });
    }
  },

  // 📜 Listar todos os pedidos (ADMIN)
  async listarTodos(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          usuario: { select: { nome: true, email: true } },
          itens: { include: { produto: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(pedidos);
    } catch (error) {
      console.error("❌ Erro ao listar todos os pedidos:", error.message);
      return res.status(500).json({ error: "Erro ao listar pedidos." });
    }
  },

  // ✏️ Atualizar pedido (ADMIN)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: parseInt(id) },
        data: { status },
        include: { itens: { include: { produto: true } } }
      });

      return res.json(pedidoAtualizado);
    } catch (error) {
      console.error("❌ Erro ao atualizar pedido:", error.message);
      return res.status(500).json({ error: "Erro ao atualizar pedido." });
    }
  },

  // 🗑️ Remover pedido (ADMIN)
  async remove(req, res) {
    try {
      const { id } = req.params;

      await prisma.pedido.delete({ where: { id: parseInt(id) } });
      return res.json({ message: "Pedido removido com sucesso." });
    } catch (error) {
      console.error("❌ Erro ao remover pedido:", error.message);
      return res.status(500).json({ error: "Erro ao remover pedido." });
    }
  }
};
