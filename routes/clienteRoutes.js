const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/cadastrar', clienteController.cadastrarCliente);

// Rotas protegidas
router.get('/', verificarToken, clienteController.listarClientes);

module.exports = router;
