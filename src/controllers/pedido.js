// controllers/pedido.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const asaas = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.ASAAS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

module.exports = {
  // Criar pedido e gerar pagamento na Asaas
  async create(req, res) {
    try {
      const { usuarioId, itens, metodoPagamento } = req.body;

      if (!usuarioId || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Dados inválidos." });
      }

      // Salva o pedido no banco
      const pedido = await prisma.pedido.create({
        data: {
          usuarioId,
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

      // Calcula o valor total do pedido
      const valorTotal = pedido.itens.reduce(
        (soma, item) => soma + (item.produto.preco * item.quantidade),
        0
      );

      // 🔑 Busca ou cria cliente no Asaas
      let clienteAsaas;
      try {
        const { data } = await asaas.get(`/customers?cpfCnpj=${pedido.usuario.cpf}`);
        if (data.data.length > 0) {
          clienteAsaas = data.data[0];
        } else {
          const { data: novoCliente } = await asaas.post("/customers", {
            name: pedido.usuario.nome,
            email: pedido.usuario.email,
            cpfCnpj: pedido.usuario.cpf,
            phone: pedido.usuario.telefone,
          });
          clienteAsaas = novoCliente;
        }
      } catch (err) {
        console.error("Erro ao criar/buscar cliente Asaas:", err.response?.data || err.message);
        return res.status(500).json({ error: "Erro na integração com Asaas (cliente)." });
      }

      // 🔑 Cria pagamento no Asaas
      try {
        const { data: pagamento } = await asaas.post("/payments", {
          customer: clienteAsaas.id,
          billingType: metodoPagamento || "PIX", // PIX, BOLETO, CREDIT_CARD
          value: valorTotal,
          dueDate: new Date().toISOString().split("T")[0], // hoje
          description: `Pedido #${pedido.id} - Petshop`,
        });

        return res.status(201).json({
          pedido,
          pagamentoAsaas: pagamento,
        });
      } catch (err) {
        console.error("Erro ao criar pagamento Asaas:", err.response?.data || err.message);
        return res.status(500).json({ error: "Erro ao gerar pagamento no Asaas." });
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ error: "Erro ao criar pedido.", detalhes: error.message });
    }
  },

  // Listar pedidos (ADMIN)
  async listarTodos(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          itens: { include: { produto: true } },
          usuario: true,
        },
      });
      res.json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ error: "Erro ao listar pedidos.", detalhes: error.message });
    }
  },

  // Atualizar pedido (ADMIN)
  async update(req, res) {
    const { id } = req.params;
    const { itens } = req.body;

    try {
      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: parseInt(id) },
        data: {
          itens: {
            deleteMany: {},
            create: itens.map(item => ({
              produtoId: item.id,
              quantidade: item.quantidade,
            })),
          },
        },
        include: { itens: { include: { produto: true } }, usuario: true },
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ error: "Erro ao atualizar pedido.", detalhes: error.message });
    }
  },

  // Remover pedido (ADMIN)
  async remove(req, res) {
    const { id } = req.params;

    try {
      await prisma.pedido.delete({ where: { id: parseInt(id) } });
      res.json({ mensagem: "Pedido removido com sucesso." });
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      res.status(500).json({ error: "Erro ao remover pedido.", detalhes: error.message });
    }
  },
};
