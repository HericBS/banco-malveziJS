const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class ClienteDAO {
  // Buscar cliente por CPF
  async buscarPorCPF(cpf) {
    const [rows] = await pool.execute("SELECT * FROM usuario WHERE cpf = ?", [cpf]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Cadastrar novo cliente
  async cadastrar(nome, cpf, data_nascimento, telefone, senhaHash) {
    const [result] = await pool.execute(
      "INSERT INTO usuario (nome, cpf, data_nascimento, telefone, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?, ?, 'CLIENTE')",
      [nome, cpf, data_nascimento, telefone, senhaHash]
    );
    return { id_usuario: result.insertId, nome, cpf, data_nascimento, telefone };
  }

  // Listar todos os clientes
  async listarTodos() {
    const [rows] = await pool.execute("SELECT * FROM usuario WHERE tipo_usuario = 'CLIENTE'");
    return rows;
  }

  // Atualizar OTP para cliente
  async atualizarOTP(id_usuario, otp, otpExpiration) {
    await pool.execute(
      "UPDATE usuario SET otp_ativo = ?, otp_expiracao = ? WHERE id_usuario = ?",
      [otp, otpExpiration, id_usuario]
    );
  }
}

module.exports = new ClienteDAO();
