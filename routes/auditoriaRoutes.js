const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');
const { verificarToken, verificarFuncionario } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.get('/registros', verificarToken, verificarFuncionario, auditoriaController.listarRegistros);

module.exports = router;
