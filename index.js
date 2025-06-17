const express = require('express');
const dotenv = require('dotenv');
const configurarCORS = require('./middlewares/corsMiddleware');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const clienteRoutes = require('./routes/clienteRoutes');
const contaRoutes = require('./routes/contaRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');
const authRoutes = require('./routes/authRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');

// Inicializar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(configurarCORS());

// Configurar rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/auditoria', auditoriaRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Banco Malvezi funcionando!' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensagem: 'Erro interno no servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
