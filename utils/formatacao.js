/**
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: R$ 1.234,56)
 */
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

/**
 * Formata uma data para o padrão brasileiro
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} - Data formatada (ex: 31/12/2023)
 */
const formatarData = (data) => {
  const dataObj = data instanceof Date ? data : new Date(data);
  return dataObj.toLocaleDateString('pt-BR');
};

/**
 * Formata um CPF com pontuação
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (ex: 123.456.789-00)
 */
const formatarCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um número de telefone
 * @param {string} telefone - Telefone sem formatação
 * @returns {string} - Telefone formatado (ex: (11) 98765-4321)
 */
const formatarTelefone = (telefone) => {
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

module.exports = {
  formatarMoeda,
  formatarData,
  formatarCPF,
  formatarTelefone
};
