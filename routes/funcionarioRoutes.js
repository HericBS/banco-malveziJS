const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.post('/cadastrar', verificarToken, verificarAdmin, funcionarioController.cadastrarFuncionario);
router.get('/', verificarToken, verificarAdmin, funcionarioController.listarFuncionarios);

module.exports = router;
