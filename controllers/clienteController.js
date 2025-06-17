const ClienteDAO = require('../dao/ClienteDAO');
const bcrypt = require('bcryptjs');
const auditoriaController = require('./auditoriaController');

class ClienteController {
  // Cadastrar novo cliente
  async cadastrarCliente(req, res) {
    try {
      const { nome, cpf, telefone, senha, data_nascimento } = req.body;
      
      if (!nome || !cpf || !telefone || !senha || !data_nascimento) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
      }

      const clienteExistente = await ClienteDAO.buscarPorCPF(cpf);
      if (clienteExistente) {
        return res.status(409).json({ mensagem: "Este CPF já está cadastrado!" });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const novoCliente = await ClienteDAO.cadastrar(nome, cpf, data_nascimento, telefone, senhaHash);
      
      await auditoriaController.registrarAuditoria(novoCliente.id_usuario, "CADASTRO_CLIENTE", { nome, cpf });
      
      return res.status(201).json({ 
        mensagem: "Cliente cadastrado com sucesso!", 
        cliente: novoCliente 
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Listar todos os clientes
  async listarClientes(req, res) {
    try {
      const clientes = await ClienteDAO.listarTodos();
      return res.status(200).json({ clientes });
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new ClienteController();
