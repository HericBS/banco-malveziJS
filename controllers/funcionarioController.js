const FuncionarioDAO = require('../dao/FuncionarioDAO');
const ClienteDAO = require('../dao/ClienteDAO');
const bcrypt = require('bcryptjs');
const auditoriaController = require('./auditoriaController');

class FuncionarioController {
  // Cadastrar novo funcionário
  async cadastrarFuncionario(req, res) {
    try {
      const { nome, cpf, telefone, senha, cargo, id_supervisor } = req.body;
      
      if (!nome || !cpf || !telefone || !senha || !cargo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos!" });
      }
      
      const usuarioExistente = await ClienteDAO.buscarPorCPF(cpf);
      if (usuarioExistente) {
        return res.status(409).json({ mensagem: "Este CPF já está cadastrado!" });
      }
      
      const senhaHash = await bcrypt.hash(senha, 10);

      const [result] = await pool.execute(
        "INSERT INTO usuario (nome, cpf, telefone, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?, 'FUNCIONARIO')",
        [nome, cpf, telefone, senhaHash]
      );
      
      const id_usuario = result.insertId;
      const codigoFuncionario = `FUNC${id_usuario}`;
      
      await FuncionarioDAO.cadastrar(id_usuario, codigoFuncionario, cargo, id_supervisor);
      
      await auditoriaController.registrarAuditoria(
        id_usuario, 
        "CADASTRO_FUNCIONARIO", 
        { nome, cpf, cargo }
      );
      
      return res.status(201).json({ mensagem: "Funcionário cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro em cadastrar funcionário:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Listar funcionários
  async listarFuncionarios(req, res) {
    try {
      const funcionarios = await FuncionarioDAO.listarTodos();
      return res.status(200).json({ funcionarios });
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new FuncionarioController();
