// assets/js/cliente.js
import * as api from './api.js';
import { getAuthenticatedUser } from './auth.js';

// Função para formatar valores monetários
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Função para formatar a data
const formatDate = (dateString) => {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('pt-BR', options);
};

// Elementos da página que vamos manipular
const nomeClienteEl = document.getElementById('nome-cliente');
const saldoEl = document.getElementById('saldo-conta');
const extratoContainerEl = document.getElementById('extrato-container');

// Formulários
const depositoForm = document.getElementById('deposito-form');
const saqueForm = document.getElementById('saque-form');
const transferenciaForm = document.getElementById('transferencia-form');

let contaIdCliente; // Vamos armazenar o ID da conta do cliente aqui

/**
 * Função principal que carrega os dados do cliente na página.
 */
async function carregarDadosCliente() {
    const user = getAuthenticatedUser();
    if (!user) return; // Se não houver usuário, interrompe a execução

    try {
        // Pega as informações detalhadas do cliente (incluindo o ID da conta)
        const infoCliente = await api.getClienteInfo(user.id);
        contaIdCliente = infoCliente.conta.id; // Armazena o ID da conta

        nomeClienteEl.textContent = infoCliente.nome; // Exibe o nome do cliente

        // Carrega o saldo e o extrato
        await atualizarSaldo();
        await atualizarExtrato();

    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        alert(error.message);
    }
}

/**
 * Busca e atualiza o saldo na tela.
 */
async function atualizarSaldo() {
    try {
        const contaInfo = await api.getContaInfo(contaIdCliente);
        saldoEl.textContent = formatCurrency(contaInfo.saldo);
    } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        saldoEl.textContent = 'Erro ao carregar';
    }
}

/**
 * Busca e renderiza o extrato de transações.
 */
async function atualizarExtrato() {
    try {
        const transacoes = await api.getExtrato(contaIdCliente);
        extratoContainerEl.innerHTML = ''; // Limpa o extrato antigo

        if (transacoes.length === 0) {
            extratoContainerEl.innerHTML = '<p>Nenhuma transação encontrada.</p>';
            return;
        }

        // Cria uma tabela para o extrato
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Origem/Destino</th>
                </tr>
            </thead>
            <tbody>
                ${transacoes.map(t => `
                    <tr>
                        <td>${formatDate(t.data)}</td>
                        <td>${t.tipo}</td>
                        <td style="color: ${t.tipo === 'saque' || (t.tipo === 'transferencia' && t.conta_origem_id === contaIdCliente) ? 'red' : 'green'};">
                            ${formatCurrency(t.valor)}
                        </td>
                        <td>
                           ${t.tipo === 'transferencia' ? 
                                (t.conta_origem_id === contaIdCliente ? `Para conta ${t.conta_destino_id}` : `De conta ${t.conta_origem_id}`)
                                : '-'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        extratoContainerEl.appendChild(table);
    } catch (error) {
        console.error('Erro ao atualizar extrato:', error);
        extratoContainerEl.innerHTML = '<p>Erro ao carregar extrato.</p>';
    }
}

// --- Event Listeners para os Formulários ---

depositoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valorDeposito.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor de depósito válido.');
        return;
    }

    try {
        await api.realizarDeposito(contaIdCliente, valor);
        alert('Depósito realizado com sucesso!');
        depositoForm.reset(); // Limpa o formulário
        await atualizarSaldo();
        await atualizarExtrato();
    } catch (error) {
        alert(`Erro no depósito: ${error.message}`);
    }
});

saqueForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valorSaque.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor de saque válido.');
        return;
    }

    try {
        await api.realizarSaque(contaIdCliente, valor);
        alert('Saque realizado com sucesso!');
        saqueForm.reset();
        await atualizarSaldo();
        await atualizarExtrato();
    } catch (error) {
        alert(`Erro no saque: ${error.message}`);
    }
});

transferenciaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const contaDestinoId = parseInt(event.target.contaDestino.value, 10);
    const valor = parseFloat(event.target.valorTransferencia.value);

    if (isNaN(valor) || valor <= 0 || isNaN(contaDestinoId)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    if(contaDestinoId === contaIdCliente) {
        alert('Você não pode transferir para sua própria conta.');
        return;
    }

    try {
        await api.realizarTransferencia(contaIdCliente, contaDestinoId, valor);
        alert('Transferência realizada com sucesso!');
        transferenciaForm.reset();
        await atualizarSaldo();
        await atualizarExtrato();
    } catch (error) {
        alert(`Erro na transferência: ${error.message}`);
    }
});

// --- Inicialização ---


document.addEventListener('DOMContentLoaded', carregarDadosCliente);