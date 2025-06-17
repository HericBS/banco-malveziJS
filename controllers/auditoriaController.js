const pool = require('../config/database');

class AuditoriaController {
  // Registrar evento de auditoria
  async registrarAuditoria(id_usuario, acao, detalhes = {}) {
    try {
      await pool.execute(
        "INSERT INTO auditoria (id_usuario, acao, detalhes) VALUES (?, ?, ?)", 
        [
          id_usuario,
          acao,
          JSON.stringify(detalhes)
        ]
      );
      return true;
    } catch (error) {
      console.error("Erro ao registrar auditoria:", error);
      return false;
    }
  }

  // Listar registros de auditoria
  async listarRegistros(req, res) {
    try {
      const { dataInicio, dataFim, idUsuario } = req.query;
      
      let query = "SELECT a.*, u.nome, u.cpf FROM auditoria a JOIN usuario u ON a.id_usuario = u.id_usuario";
      const params = [];
      
      const whereConditions = [];
      
      if (idUsuario) {
        whereConditions.push("a.id_usuario = ?");
        params.push(idUsuario);
      }
      
      if (dataInicio) {
        whereConditions.push("a.data_hora >= ?");
        params.push(dataInicio);
      }
      
      if (dataFim) {
        whereConditions.push("a.data_hora <= ?");
        params.push(dataFim);
      }
      
      if (whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ");
      }
      
      query += " ORDER BY a.data_hora DESC";
      
      const [rows] = await pool.execute(query, params);
      
      return res.status(200).json({ registros: rows });
    } catch (error) {
      console.error("Erro ao listar registros de auditoria:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new AuditoriaController();
