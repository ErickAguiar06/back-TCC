const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar novo pedido
exports.criarPedido = async (req, res) => {
  try {
    const { itens } = req.body;
    const usuarioId = req.user.id;

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        itens: {
          create: itens.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          })),
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
};

// ✅ Listar todos os pedidos (apenas ADMIN)
exports.listarTodos = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: true,
        itens: {
          include: { produto: true },
        },
      },
    });
    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
};

// ✅ Listar pedidos do usuário logado
exports.listarPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const pedidos = await prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        itens: { include: { produto: true } },
      },
    });
    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar meus pedidos:", error);
    res.status(500).json({ erro: "Erro ao listar meus pedidos" });
  }
};

// ✅ Atualizar status do pedido (apenas ADMIN)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(pedido);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({ erro: "Erro ao atualizar pedido" });
  }
};

// ✅ Remover pedido (apenas ADMIN)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pedido.delete({
      where: { id: parseInt(id) },
    });
    res.json({ mensagem: "Pedido removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover pedido:", error);
    res.status(500).json({ erro: "Erro ao remover pedido" });
  }
};
