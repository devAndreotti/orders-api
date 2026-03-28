const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Order = require('../src/models/orderModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect(); // desconecta de possível config global
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Order.deleteMany({});
});

describe('Order API Endpoints', () => {
  const validOrderPayload = {
    numeroPedido: 'PED-1234',
    valorTotal: 1000,
    dataCriacao: '2023-01-01T12:00:00Z',
    items: [
      { idItem: '1', quantidadeItem: 2, valorItem: 500 }
    ]
  };

  test('POST /order - Deve criar um novo pedido com sucesso', async () => {
    const res = await request(app)
      .post('/order')
      .send(validOrderPayload);

    expect(res.status).toBe(201);
    expect(res.body.numeroPedido).toBe('PED-1234');
    expect(res.body).not.toHaveProperty('_id');
  });

  test('POST /order - Deve falhar ao criar pedido duplicado', async () => {
    await request(app).post('/order').send(validOrderPayload);
    const res = await request(app).post('/order').send(validOrderPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Pedido duplicado');
  });

  test('GET /order - Deve listar pedidos com paginação', async () => {
    await request(app).post('/order').send(validOrderPayload);
    await request(app).post('/order').send({ ...validOrderPayload, numeroPedido: 'PED-1235' });

    const res = await request(app).get('/order?page=1&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.pagination.totalPages).toBe(2);
  });
});
