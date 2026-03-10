const Order = require('../models/orderModel');
const { mapOrderToDatabase, mapUpdateToDatabase } = require('../mappers/orderMapper');

// POST /order — Criar novo pedido
async function createOrder(req, res) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação dos campos obrigatórios
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os campos numeroPedido, valorTotal, dataCriacao e items são obrigatórios',
      });
    }

    // Mapear campos PT-BR para EN
    const orderData = mapOrderToDatabase(req.body);

    // Verificar se o pedido já existe
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
    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

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

// GET /order/list — Listar todos os pedidos
async function listOrders(req, res) {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
}

// PUT /order/:numeroPedido — Atualizar pedido
async function updateOrder(req, res) {
  try {
    const { numeroPedido } = req.params;

    // Mapear campos para atualização
    const updateData = mapUpdateToDatabase(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Nenhum campo válido fornecido para atualização',
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: numeroPedido },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        error: 'Pedido não encontrado',
        message: `Nenhum pedido encontrado com o número ${numeroPedido}`,
      });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
}

// DELETE /order/:numeroPedido — Deletar pedido
async function deleteOrder(req, res) {
  try {
    const { numeroPedido } = req.params;
    const deletedOrder = await Order.findOneAndDelete({ orderId: numeroPedido });

    if (!deletedOrder) {
      return res.status(404).json({
        error: 'Pedido não encontrado',
        message: `Nenhum pedido encontrado com o número ${numeroPedido}`,
      });
    }

    return res.status(200).json({
      message: `Pedido ${numeroPedido} deletado com sucesso`,
    });
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
  listOrders,
  updateOrder,
  deleteOrder,
};
