const TransacaoDAO = require('../dao/TransacaoDAO');
const ContaDAO = require('../dao/ContaDAO');
const auditoriaController = require('./auditoriaController');

class TransacaoController {
  // Realizar depósito
  async realizarDeposito(req, res) {
    try {
      const { contaId, valor } = req.body;
      
      if (!contaId || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: "Conta e valor válido são obrigatórios!" });
      }

      const conta = await ContaDAO.buscarPorId(contaId);
      if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
      }
      
      await ContaDAO.incrementarSaldo(contaId, valor);
      
      await TransacaoDAO.registrar(
        contaId, 
        'DEPOSITO', 
        valor, 
        "Depósito realizado"
      );
      
      const novoSaldo = await ContaDAO.consultarSaldo(contaId);
      
      await auditoriaController.registrarAuditoria(
        conta.id_cliente, 
        "DEPOSITO", 
        { contaId, valor, novoSaldo }
      );
      
      return res.status(200).json({ 
        mensagem: "Depósito realizado!", 
        saldo: novoSaldo 
      });
    } catch (error) {
      console.error("Erro em depósito:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Realizar saque
  async realizarSaque(req, res) {
    try {
      const { contaId, valor } = req.body;
      
      if (!contaId || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: "Conta e valor válido são obrigatórios!" });
      }

      const conta = await ContaDAO.buscarPorId(contaId);
      if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
      }
      
      const saldoAtual = await ContaDAO.consultarSaldo(contaId);
      if (saldoAtual < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
      }
      
      await ContaDAO.decrementarSaldo(contaId, valor);
      
      await TransacaoDAO.registrar(
        contaId, 
        'SAQUE', 
        valor, 
        "Saque realizado"
      );
      
      const novoSaldo = await ContaDAO.consultarSaldo(contaId);
      
      await auditoriaController.registrarAuditoria(
        conta.id_cliente, 
        "SAQUE", 
        { contaId, valor, novoSaldo }
      );
      
      return res.status(200).json({ 
        mensagem: "Saque realizado!", 
        saldo: novoSaldo 
      });
    } catch (error) {
      console.error("Erro em saque:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Realizar transferência
  async realizarTransferencia(req, res) {
    try {
      const { origemId, destinoId, valor } = req.body;
      
      if (!origemId || !destinoId || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: "Contas de origem, destino e valor válido são obrigatórios!" });
      }

      const contaOrigem = await ContaDAO.buscarPorId(origemId);
      const contaDestino = await ContaDAO.buscarPorId(destinoId);
      
      if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: "Conta(s) não encontrada(s)!" });
      }
      
      const saldoOrigem = await ContaDAO.consultarSaldo(origemId);
      if (saldoOrigem < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
      }
      
      await ContaDAO.decrementarSaldo(origemId, valor);
      await ContaDAO.incrementarSaldo(destinoId, valor);
      
      await TransacaoDAO.registrar(
        origemId,
        'TRANSFERENCIA',
        valor,
        "Transferência realizada",
        destinoId
      );
      
      await auditoriaController.registrarAuditoria(
        contaOrigem.id_cliente,
        "TRANSFERENCIA",
        { origemId, destinoId, valor }
      );
      
      return res.status(200).json({ mensagem: "Transferência realizada!" });
    } catch (error) {
      console.error("Erro em transferência:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }

  // Emitir extrato
  async emitirExtrato(req, res) {
    try {
      const { contaId } = req.params;
      
      const conta = await ContaDAO.buscarPorId(contaId);
      if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
      }
      
      const transacoes = await TransacaoDAO.buscarExtrato(contaId);
      
      if (transacoes.length === 0) {
        return res.status(404).json({ mensagem: "Nenhuma transação encontrada!" });
      }
      
      await auditoriaController.registrarAuditoria(
        conta.id_cliente,
        "CONSULTA_EXTRATO",
        { contaId }
      );
      
      return res.status(200).json({ extrato: transacoes });
    } catch (error) {
      console.error("Erro ao emitir extrato:", error);
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

module.exports = new TransacaoController();
