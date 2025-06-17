// assets/js/funcionario.js
import * as api from './api.js';
import { getAuthenticatedUser } from './auth.js';

// --- Elementos da Página ---
const nomeFuncionarioEl = document.getElementById('nome-funcionario');
const clientesTableBodyEl = document.querySelector('#clientes-tabela tbody');
const auditoriaTableBodyEl = document.querySelector('#auditoria-tabela tbody');
const cadastrarClienteForm = document.getElementById('cadastrar-cliente-form');
const mensagemErroEl = document.getElementById('mensagem-erro');

/**
 * Formata datas para o padrão brasileiro.
 * @param {string} dateString - A data em formato ISO.
 * @returns {string} - A data formatada (dd/mm/aaaa hh:mm:ss).
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return new Date(dateString).toLocaleString('pt-BR', options);
};

/**
 * Função principal que carrega todos os dados na tela do funcionário.
 */
async function carregarDadosFuncionario() {
    const user = getAuthenticatedUser();
    if (!user) return;

    nomeFuncionarioEl.textContent = user.nome;

    try {
        await carregarClientes();
        await carregarAuditoria();
    } catch (error) {
        console.error('Erro ao carregar dados do funcionário:', error);
        alert(`Não foi possível carregar os dados do painel: ${error.message}`);
    }
}

/**
 * Busca e exibe a lista de clientes.
 */
async function carregarClientes() {
    try {
        const clientes = await api.getTodosClientes();
        clientesTableBodyEl.innerHTML = ''; // Limpa a tabela

        if (clientes.length === 0) {
            clientesTableBodyEl.innerHTML = '<tr><td colspan="5">Nenhum cliente encontrado.</td></tr>';
            return;
        }

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.email}</td>
                <td>
                    <button class="btn-excluir" data-id="${cliente.id}">Excluir</button>
                </td>
            `;
            clientesTableBodyEl.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        clientesTableBodyEl.innerHTML = `<tr><td colspan="5">Erro ao carregar clientes: ${error.message}</td></tr>`;
    }
}

/**
 * Busca e exibe os logs de auditoria.
 */
async function carregarAuditoria() {
    try {
        const logs = await api.getAuditoria();
        auditoriaTableBodyEl.innerHTML = ''; // Limpa a tabela

        if (logs.length === 0) {
            auditoriaTableBodyEl.innerHTML = '<tr><td colspan="4">Nenhum log de auditoria encontrado.</td></tr>';
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${log.id}</td>
                <td>${log.acao}</td>
                <td>${formatDate(log.data_hora)}</td>
                <td>${log.funcionario_id || 'Sistema'}</td>
            `;
            auditoriaTableBodyEl.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar auditoria:', error);
        auditoriaTableBodyEl.innerHTML = `<tr><td colspan="4">Erro ao carregar logs: ${error.message}</td></tr>`;
    }
}

// --- Event Listeners ---

// Listener para o formulário de cadastro de cliente
cadastrarClienteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensagemErroEl.textContent = '';

    const dadosCliente = {
        nome: event.target.nome.value,
        cpf: event.target.cpf.value,
        email: event.target.email.value,
        senha: event.target.senha.value
    };

    try {
        await api.cadastrarCliente(dadosCliente);
        alert('Cliente cadastrado com sucesso!');
        cadastrarClienteForm.reset();
        await carregarClientes(); // Atualiza a lista de clientes
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        mensagemErroEl.textContent = `Erro: ${error.message}`;
    }
});

// Listener para os botões de exclusão (usando delegação de eventos)
clientesTableBodyEl.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-excluir')) {
        const clienteId = event.target.dataset.id;
        const confirmacao = confirm(`Tem certeza que deseja excluir o cliente com ID ${clienteId}? Esta ação não pode ser desfeita.`);

        if (confirmacao) {
            try {
                await api.deletarCliente(clienteId);
                alert('Cliente excluído com sucesso!');
                await carregarClientes(); // Atualiza a lista
                await carregarAuditoria(); // A exclusão gera um log de auditoria
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                alert(`Erro: ${error.message}`);
            }
        }
    }
});

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', carregarDadosFuncionario);