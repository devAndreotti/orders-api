const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
} = require('../controllers/orderController');

// POST /order — Criar novo pedido
router.post('/', createOrder);

// GET /order/:numeroPedido — Obter pedido pelo número
router.get('/:numeroPedido', getOrderById);

module.exports = router;
