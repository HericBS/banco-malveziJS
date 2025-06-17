const pool = require('../config/database');

class ContaDAO {
  // Criar nova conta
  async criar(clienteId, tipo) {
    const [result] = await pool.execute(
      "INSERT INTO conta (id_agencia, id_cliente, tipo_conta, saldo, numero_conta) VALUES (?, ?, ?, 0, ?)",
      [1, clienteId, tipo, 'TEMP']
    );
    
    const numeroConta = "CONTA" + result.insertId;
    await pool.execute("UPDATE conta SET numero_conta = ? WHERE id_conta = ?", [numeroConta, result.insertId]);
    
    return { 
      id_conta: result.insertId, 
      clienteId, 
      tipo_conta: tipo, 
      saldo: 0, 
      numero_conta: numeroConta 
    };
  }

  // Buscar conta por ID
  async buscarPorId(contaId) {
    const [rows] = await pool.execute("SELECT * FROM conta WHERE id_conta = ?", [contaId]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Atualizar saldo
  async atualizarSaldo(contaId, novoSaldo) {
    await pool.execute("UPDATE conta SET saldo = ? WHERE id_conta = ?", [novoSaldo, contaId]);
  }

  // Incrementar saldo
  async incrementarSaldo(contaId, valor) {
    await pool.execute("UPDATE conta SET saldo = saldo + ? WHERE id_conta = ?", [valor, contaId]);
  }

  // Decrementar saldo
  async decrementarSaldo(contaId, valor) {
    await pool.execute("UPDATE conta SET saldo = saldo - ? WHERE id_conta = ?", [valor, contaId]);
  }

  // Consultar saldo
  async consultarSaldo(contaId) {
    const [rows] = await pool.execute("SELECT saldo FROM conta WHERE id_conta = ?", [contaId]);
    return rows.length > 0 ? rows[0].saldo : null;
  }

  // Consultar limite
  async consultarLimite(contaId) {
    const [rows] = await pool.execute("SELECT limite FROM conta WHERE id_conta = ?", [contaId]);
    return rows.length > 0 ? rows[0].limite || 0 : null;
  }
}

module.exports = new ContaDAO();
