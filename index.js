// Conteúdo correto para o arquivo: index.js (o seu servidor)

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const contaRoutes = require('./routes/contaRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/contas', contaRoutes);
app.use('/transacoes', transacaoRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/auditoria', auditoriaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 