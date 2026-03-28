const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

// POST /order — Criar novo pedido
router.post('/', createOrder);

// GET /order — Listar todos os pedidos
router.get('/', listOrders);

// GET /order/:numeroPedido — Obter pedido pelo número
router.get('/:numeroPedido', getOrderById);

// PUT /order/:numeroPedido — Atualizar pedido
router.put('/:numeroPedido', updateOrder);

// DELETE /order/:numeroPedido — Deletar pedido
router.delete('/:numeroPedido', deleteOrder);

module.exports = router;
