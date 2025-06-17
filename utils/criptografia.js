const bcrypt = require('bcryptjs');

// Funções para criptografia e segurança

/**
 * Gera um hash para a senha fornecida
 * @param {string} senha - Senha em texto plano
 * @returns {Promise<string>} - Hash da senha
 */
const gerarHash = async (senha) => {
  return await bcrypt.hash(senha, 10);
};

/**
 * Verifica se a senha corresponde ao hash armazenado
 * @param {string} senha - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {Promise<boolean>} - Verdadeiro se a senha corresponder ao hash
 */
const verificarSenha = async (senha, hash) => {
  return await bcrypt.compare(senha, hash);
};

/**
 * Gera um código OTP de 6 dígitos
 * @returns {string} - Código OTP
 */
const gerarOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
};

module.exports = {
  gerarHash,
  verificarSenha,
  gerarOTP
};
