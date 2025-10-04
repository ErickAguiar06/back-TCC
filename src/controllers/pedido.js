const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar novo pedido com status PENDENTE
exports.criarPedido = async (req, res) => {
  try {
    const { itens } = req.body;

    // Suporta tanto req.user quanto req.usuario (fallback)
    const usuarioId = req.user?.id || req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado (token inválido ou middleware não definiu req.user)." });
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: "Carrinho vazio ou inválido." });
    }

    // Valida formato dos itens e converte
    const itensValidados = itens.map((it) => {
      const produtoId = Number(it.produtoId ?? it.id ?? it.produto_id);
      const quantidade = Number(it.quantidade ?? it.qtd ?? it.qty ?? 0);
      return { produtoId, quantidade };
    });

    for (const it of itensValidados) {
      if (!it.produtoId || it.quantidade <= 0) {
        return res.status(400).json({ erro: "Formato inválido de item. Cada item precisa de produtoId e quantidade > 0." });
      }
    }

    // Verifica se os produtos existem no banco
    const ids = [...new Set(itensValidados.map(i => i.produtoId))];
    const produtosEncontrados = await prisma.produto.findMany({
      where: { id: { in: ids } },
      select: { id: true }
    });
    const encontradosIds = produtosEncontrados.map(p => p.id);
    const faltantes = ids.filter(id => !encontradosIds.includes(id));
    if (faltantes.length > 0) {
      return res.status(400).json({ erro: `Produtos não encontrados: ${faltantes.join(", ")}` });
    }

    // Criar pedido com itens (transação implícita)
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        status: "PENDENTE",
        itens: {
          create: itensValidados.map(it => ({
            produtoId: it.produtoId,
            quantidade: it.quantidade,
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

    return res.status(201).json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido (detalhe):", error);
    // Retorna a mensagem de erro para ajudar no debug (remova em produção)
    return res.status(500).json({
      erro: "Erro ao criar pedido",
      detalhes: error.message ?? String(error),
    });
  }
};

// Listar todos os pedidos (apenas ADMIN)
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

// Listar pedidos do usuário logado
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

// Atualizar status do pedido (apenas ADMIN)
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

// Remover pedido (apenas ADMIN)
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