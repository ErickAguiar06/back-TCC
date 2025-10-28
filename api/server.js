const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();


const allowedOrigins = [
  'http://localhost:5500',
  'https://erickaguiar06.github.io' 
];

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());


// Rotas existentes
const rota = require('../src/routes');
app.use('/', rota);


const axios = require('axios');

app.post('/create-payment', async (req, res) => {
  const { carrinho, cliente } = req.body;

  try {
    // Montar itens para Asaas
    const valorTotal = carrinho.reduce((total, p) => total + p.preco * p.quantidade, 0);

    const response = await axios.post(`${process.env.ASAAS_BASE_URL}/payments`, {
      customer: cliente.idAsaas, // ID do cliente na Asaas
      billingType: 'PIX', // ou CREDIT_CARD
      value: valorTotal,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Pedido Petshop 4 Patas'
    }, {
      headers: { 'access_token': process.env.ASAAS_API_KEY }
    });

    res.json({ paymentId: response.data.id, status: response.data.status });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Erro ao criar pagamento Asaas' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});