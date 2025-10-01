// controllers/agendamento.js
const prisma = require('../connect'); 

async function criarAgendamento(req, res) {
  const { produto_id, data, hora } = req.body;

  if (!produto_id || !data || !hora) {
    return res.status(400).json({ message: 'produto_id, data e hora são obrigatórios.' });
  }

  try {
    // Verifica se o produto existe e é serviço
    const produto = await prisma.produto.findFirst({
      where: {
        id: produto_id,
        marca: 'Servicos'
      }
    });

    if (!produto) {
      return res.status(400).json({ message: 'Produto não encontrado ou não é um serviço.' });
    }

    // Verifica se já existe agendamento no mesmo dia e hora para o mesmo serviço (opcional)
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        produto_id,
        data,
        hora
      }
    });

    if (agendamentoExistente) {
      return res.status(409).json({ message: 'Horário já agendado para este serviço.' });
    }

    // Insere o agendamento
    await prisma.agendamento.create({
      data: {
        produto_id,
        data,
        hora
      }
    });

    return res.status(201).json({ message: 'Agendamento criado com sucesso.' });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = {
  criarAgendamento
};