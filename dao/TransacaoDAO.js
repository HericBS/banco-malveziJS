const pool = require('../config/database');

class TransacaoDAO {
  // Registrar nova transação
  async registrar(id_conta_origem, tipo_transacao, valor, descricao, id_conta_destino = null) {
    const query = id_conta_destino 
      ? "INSERT INTO transacao (id_conta_origem, id_conta_destino, tipo_transacao, valor, descricao) VALUES (?, ?, ?, ?, ?)"
      : "INSERT INTO transacao (id_conta_origem, tipo_transacao, valor, descricao) VALUES (?, ?, ?, ?)";
    
    const params = id_conta_destino 
      ? [id_conta_origem, id_conta_destino, tipo_transacao, valor, descricao]
      : [id_conta_origem, tipo_transacao, valor, descricao];
    
    const [result] = await pool.execute(query, params);
    return result.insertId;
  }

  // Buscar extrato de conta
  async buscarExtrato(contaId) {
    const [rows] = await pool.execute(
      "SELECT * FROM transacao WHERE (id_conta_origem = ? OR id_conta_destino = ?) ORDER BY data_hora DESC",
      [contaId, contaId]
    );
    return rows;
  }
}

module.exports = new TransacaoDAO();
