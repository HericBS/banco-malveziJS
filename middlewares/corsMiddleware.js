const cors = require('cors');

// Configuração do middleware CORS
const configurarCORS = () => {
  return cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 horas em segundos
  });
};

module.exports = configurarCORS;
