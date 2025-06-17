const express = require('express');
const router = express.Router();
const contaController = require('../controllers/contaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.post('/criar', verificarToken, contaController.criarConta);
router.get('/saldo/:contaId', verificarToken, contaController.consultarSaldo);
router.get('/limite/:contaId', verificarToken, contaController.consultarLimite);

module.exports = router;
