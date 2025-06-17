const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ClienteDAO = require('../dao/ClienteDAO');
const auditoriaController = require('./auditoriaController');

const secret = process.env.JWT_SECRET || "sua_chave_secreta";

class AuthController {
  // Login
  async login(req, res) {
    try {
      const { cpf, senha } = req.body;
      
      if (!cpf || !senha) {
        return res.status(400).json({ mensagem: "CPF e senha são obrigatórios!" });
      }

      const usuario = await ClienteDAO.buscarPorCPF(cpf);
      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" });
      }
      
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(400).json({ mensagem: "Senha incorreta!" });
      }
      
      const token = jwt.sign(
        { id: usuario.id_usuario, cpf: usuario.cpf }, 
        secret, 
        { expiresIn: '1h' }
      );
      
      await auditoriaController.registrarAuditoria(
        usuario.id_usuario,
        "LOGIN",
        { cpf }
      );
      
      return res.status(200).json({ 
        mensagem: "Login bem-sucedido!", 
        token, 
        cliente: usuario 
      });
    } catch (error) {
      console.error("Erro em login:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Gerar OTP
  async gerarOTP(req, res) {
    try {
      const { cpf } = req.body;
      
      if (!cpf) {
        return res.status(400).json({ mensagem: "CPF é obrigatório!" });
      }
      
      const usuario = await ClienteDAO.buscarPorCPF(cpf);
      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
      const otpExpiration = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 19).replace('T', ' ');

      await ClienteDAO.atualizarOTP(usuario.id_usuario, otp, otpExpiration);
      
      await auditoriaController.registrarAuditoria(
        usuario.id_usuario,
        "GERACAO_OTP",
        { cpf }
      );
      
      return res.status(200).json({ 
        mensagem: "OTP gerado com sucesso!", 
        otp, 
        otpExpiration 
      });
    } catch (error) {
      console.error("Erro em gerar OTP:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Encerrar Sessão (Logout)
  async encerrarSessao(req, res) {
    try {
      const { cpf } = req.body;
      
      if (!cpf) {
        return res.status(400).json({ mensagem: "CPF é obrigatório!" });
      }
      
      const usuario = await ClienteDAO.buscarPorCPF(cpf);
      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" });
      }
      
      await auditoriaController.registrarAuditoria(
        usuario.id_usuario,
        "LOGOUT",
        { mensagem: "Sessão encerrada pelo cliente" }
      );
      
      return res.status(200).json({ mensagem: "Sessão encerrada com sucesso!" });
    } catch (error) {
      console.error("Erro em encerrar sessão:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new AuthController();
