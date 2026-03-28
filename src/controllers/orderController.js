const Order = require('../models/orderModel');
const { mapOrderToDatabase, mapUpdateToDatabase, mapOrderToResponse } = require('../mappers/orderMapper');

// POST /order — Criar novo pedido
async function createOrder(req, res, next) {
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

    const order = new Order(orderData);
    const savedOrder = await order.save();

    return res.status(201).json(mapOrderToResponse(savedOrder));
  } catch (error) {
    next(error);
  }
}

// GET /order/:numeroPedido — Obter pedido pelo número
async function getOrderById(req, res, next) {
  try {
    const { numeroPedido } = req.params;
    const order = await Order.findOne({ orderId: numeroPedido });

    if (!order) {
      return res.status(404).json({
        error: 'Pedido não encontrado',
        message: `Nenhum pedido encontrado com o número ${numeroPedido}`,
      });
    }

    return res.status(200).json(mapOrderToResponse(order));
  } catch (error) {
    next(error);
  }
}

// GET /order — Listar todos os pedidos com paginação
async function listOrders(req, res, next) {
  try {
    // Paginação
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find().skip(skip).limit(limit),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      data: orders.map(mapOrderToResponse),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /order/:numeroPedido — Atualizar pedido
async function updateOrder(req, res, next) {
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

    return res.status(200).json(mapOrderToResponse(updatedOrder));
  } catch (error) {
    next(error);
  }
}

// DELETE /order/:numeroPedido — Deletar pedido
async function deleteOrder(req, res, next) {
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
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};

