const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de Segurança
app.use(helmet());
app.use(cors());

// Rate Limiting (100 requisições a cada 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'O limite de requisições foi atingido' },
});
app.use(limiter);

// Logger HTTP Requests
app.use(pinoHttp({ logger }));

// Middleware para parsear JSON
app.use(express.json());

// Rotas
app.use('/order', orderRoutes);

// Tratamento de Erros Global
app.use(errorHandler);

// Inicialização com Graceful Shutdown na fase 3 será feito depois
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('Conectado ao MongoDB com sucesso');
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error({ err: error }, 'Erro ao conectar ao MongoDB');
    process.exit(1);
  });

module.exports = app;
