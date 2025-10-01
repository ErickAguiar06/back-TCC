const express = require("express");
const rota = express.Router();

// Controllers
const usuarioController = require("./controllers/usuario");
const produtoController = require("./controllers/produto");
const pedidoController = require("./controllers/pedido");
const webhookController = require("./controllers/webhook");

// Middleware
const { autenticarJWT, verificarAdmin } = require("./middleware/auth");

// Função utilitária para garantir que o handler existe
function ensureFunction(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`Handler inválido: ${name} não é uma função. Verifique se está exportado corretamente no controller.`);
  }
  return fn;
}

// ==============================
// 👤 ROTAS DE USUÁRIO
// ==============================
rota.post("/usuarios", ensureFunction(usuarioController.create, "usuarioController.create"));
rota.post("/login", ensureFunction(usuarioController.login, "usuarioController.login"));
rota.post("/recuperar-senha", ensureFunction(usuarioController.solicitarRecuperacao, "usuarioController.solicitarRecuperacao"));
rota.post("/resetar-senha", ensureFunction(usuarioController.resetarSenha, "usuarioController.resetarSenha"));
rota.get("/usuarios", autenticarJWT, ensureFunction(usuarioController.listar, "usuarioController.listar")); // 🔒 ADMIN

// ==============================
// 📦 ROTAS DE PRODUTO
// ==============================
rota.get("/produtos", ensureFunction(produtoController.listar, "produtoController.listar"));
rota.post("/produtos", autenticarJWT, verificarAdmin, ensureFunction(produtoController.create, "produtoController.create"));
rota.put("/produtos/:id", autenticarJWT, verificarAdmin, ensureFunction(produtoController.update, "produtoController.update"));
rota.delete("/produtos/:id", autenticarJWT, verificarAdmin, ensureFunction(produtoController.remove, "produtoController.remove"));

// ==============================
// 🛒 ROTAS DE PEDIDO
// ==============================
rota.post("/pedidos", autenticarJWT, ensureFunction(pedidoController.criarPedido || pedidoController.create, "pedidoController.criarPedido/create"));
rota.get("/pedidos", autenticarJWT, verificarAdmin, ensureFunction(pedidoController.listarTodos, "pedidoController.listarTodos"));
rota.get("/meus-pedidos", autenticarJWT, ensureFunction(pedidoController.listarPorUsuario, "pedidoController.listarPorUsuario"));
rota.put("/pedidos/:id", autenticarJWT, verificarAdmin, ensureFunction(pedidoController.update, "pedidoController.update"));
rota.delete("/pedidos/:id", autenticarJWT, verificarAdmin, ensureFunction(pedidoController.remove, "pedidoController.remove"));

// ==============================
// 📬 WEBHOOK ASAAS
// ==============================
rota.post("/webhook/asaas", express.json(), ensureFunction(webhookController.receberWebhook, "webhookController.receberWebhook"));

module.exports = rota;
