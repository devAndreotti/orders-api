const Order = require('../models/orderModel');
const { mapOrderToDatabase } = require('../mappers/orderMapper');

// POST /order — Criar novo pedido
async function createOrder(req, res) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os campos numeroPedido, valorTotal, dataCriacao e items são obrigatórios',
      });
    }

    const orderData = mapOrderToDatabase(req.body);

    const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    if (existingOrder) {
      return res.status(400).json({
        error: 'Pedido duplicado',
        message: `O pedido ${orderData.orderId} já existe`,
      });
    }

    const order = new Order(orderData);
    const savedOrder = await order.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
}

// GET /order/:numeroPedido — Obter pedido pelo número
async function getOrderById(req, res) {
  try {
    const { numeroPedido } = req.params;
    const order = await Order.findOne({ orderId: numeroPedido });

    if (!order) {
      return res.status(404).json({
        error: 'Pedido não encontrado',
        message: `Nenhum pedido encontrado com o número ${numeroPedido}`,
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getOrderById,
};
