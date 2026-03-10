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

// GET /order/list — Listar todos os pedidos (deve vir antes de /:numeroPedido)
router.get('/list', listOrders);

// GET /order/:numeroPedido — Obter pedido pelo número
router.get('/:numeroPedido', getOrderById);

// PUT /order/:numeroPedido — Atualizar pedido
router.put('/:numeroPedido', updateOrder);

// DELETE /order/:numeroPedido — Deletar pedido
router.delete('/:numeroPedido', deleteOrder);

module.exports = router;
