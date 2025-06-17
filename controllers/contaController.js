const ContaDAO = require('../dao/ContaDAO');
const TransacaoDAO = require('../dao/TransacaoDAO');
const auditoriaController = require('./auditoriaController');

class ContaController {
  // Criar nova conta
  async criarConta(req, res) {
    try {
      const { clienteId, tipo } = req.body;
      
      if (!clienteId || !tipo) {
        return res.status(400).json({ mensagem: "ID do cliente e tipo de conta são obrigatórios!" });
      }

      const novaConta = await ContaDAO.criar(clienteId, tipo);
      
      await auditoriaController.registrarAuditoria(clienteId, "CRIACAO_CONTA", { 
        id_conta: novaConta.id_conta, 
        tipo_conta: tipo 
      });
      
      return res.status(201).json({ 
        mensagem: "Conta criada com sucesso!", 
        conta: novaConta 
      });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Consultar saldo
  async consultarSaldo(req, res) {
    try {
      const { contaId } = req.params;
      const saldo = await ContaDAO.consultarSaldo(contaId);
      
      if (saldo === null) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
      }
      
      return res.status(200).json({ saldo });
    } catch (error) {
      console.error("Erro ao consultar saldo:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Consultar limite
  async consultarLimite(req, res) {
    try {
      const { contaId } = req.params;
      const limiteAtual = await ContaDAO.consultarLimite(contaId);
      
      if (limiteAtual === null) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
      }
      
      const projecao = Number((limiteAtual * 1.05).toFixed(2));
      return res.status(200).json({ limiteAtual, limiteProjecao: projecao });
    } catch (error) {
      console.error("Erro ao consultar limite:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new ContaController();
