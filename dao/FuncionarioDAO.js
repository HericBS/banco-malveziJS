const pool = require('../config/database');

class FuncionarioDAO {
  // Cadastrar novo funcionário
  async cadastrar(id_usuario, codigoFuncionario, cargo, id_supervisor) {
    await pool.execute(
      "INSERT INTO funcionario (id_usuario, codigo_funcionario, cargo, id_supervisor) VALUES (?, ?, ?, ?)",
      [id_usuario, codigoFuncionario, cargo, id_supervisor || null]
    );
    return { id_usuario, codigoFuncionario, cargo, id_supervisor };
  }

  // Buscar funcionário por ID
  async buscarPorId(id_usuario) {
    const [rows] = await pool.execute(
      "SELECT f.*, u.nome, u.cpf, u.telefone FROM funcionario f JOIN usuario u ON f.id_usuario = u.id_usuario WHERE f.id_usuario = ?",
      [id_usuario]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Listar todos os funcionários
  async listarTodos() {
    const [rows] = await pool.execute(
      "SELECT f.*, u.nome, u.cpf, u.telefone FROM funcionario f JOIN usuario u ON f.id_usuario = u.id_usuario"
    );
    return rows;
  }
}

module.exports = new FuncionarioDAO();
