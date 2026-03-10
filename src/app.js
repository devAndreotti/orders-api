const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rotas
app.use('/order', orderRoutes);

// Conexão com o MongoDB e inicialização do servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });

module.exports = app;
