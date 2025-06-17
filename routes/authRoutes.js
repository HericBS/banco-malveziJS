const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas públicas
router.post('/login', authController.login);
router.post('/gerar-otp', authController.gerarOTP);
router.post('/logout', authController.encerrarSessao);

module.exports = router;
