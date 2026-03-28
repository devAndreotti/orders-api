const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Erro de duplicidade no MongoDB (E11000)
  if (err.code === 11000) {
    logger.warn({ err, mongoCode: 11000 }, 'Erro de duplicidade de chave no MongoDB');
    return res.status(400).json({
      error: 'Pedido duplicado',
      message: `Já existe um registro com os mesmos identificadores únicos no banco.`,
    });
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    logger.warn({ err }, 'Erro de validação do banco/Mongoose');
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.message,
    });
  }

  // Falha de parsing/sintaxe no JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn({ err }, 'Carga JSON inválida recebida na requisição');
    return res.status(400).json({
      error: 'Requisição mal formatada',
      message: 'O corpo da requisição contém um JSON inválido',
    });
  }

  // Erro inesperado
  logger.error({ err }, 'Erro não tratado no servidor');
  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado e o log já foi registrado.',
  });
}

module.exports = errorHandler;
