const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.post('/deposito', verificarToken, transacaoController.realizarDeposito);
router.post('/saque', verificarToken, transacaoController.realizarSaque);
router.post('/transferencia', verificarToken, transacaoController.realizarTransferencia);
router.get('/extrato/:contaId', verificarToken, transacaoController.emitirExtrato);

module.exports = router;
