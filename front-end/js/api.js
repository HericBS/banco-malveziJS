// assets/js/api.js

const API_BASE_URL = 'http://localhost:3000'; // Certifique-se que a porta está correta

/**
 * Função base para realizar requisições fetch.
 * Ela anexa o token de autenticação em todas as requisições que o exigem.
 * @param {string} endpoint - O endpoint da API para o qual fazer a requisição.
 * @param {object} options - As opções da requisição (method, headers, body, etc.).
 * @param {boolean} requireAuth - Indica se a requisição precisa de autenticação.
 * @returns {Promise<any>} - A resposta da API em formato JSON.
 */
async function fetchAPI(endpoint, options = {}, requireAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (requireAuth) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/index.html';
            throw new Error('Token de autenticação não encontrado.');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro na requisição: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return {};
}

// --- Funções de Autenticação ---

export const login = (cpf, senha, tipo) => {
    return fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ cpf, senha, tipo }),
    }, false); // Login não exige autenticação prévia
};

// --- Funções do Cliente ---

export const getClienteInfo = (clienteId) => {
    return fetchAPI(`/clientes/${clienteId}`);
};

export const getContaInfo = (contaId) => {
    return fetchAPI(`/contas/${contaId}`);
};

export const getExtrato = (contaId) => {
    return fetchAPI(`/transacoes/extrato/${contaId}`);
};

export const realizarDeposito = (contaId, valor) => {
    return fetchAPI('/transacoes/deposito', {
        method: 'POST',
        body: JSON.stringify({ contaId, valor }),
    });
};

export const realizarSaque = (contaId, valor) => {
    return fetchAPI('/transacoes/saque', {
        method: 'POST',
        body: JSON.stringify({ contaId, valor }),
    });
};

export const realizarTransferencia = (contaOrigemId, contaDestinoId, valor) => {
    return fetchAPI('/transacoes/transferencia', {
        method: 'POST',
        body: JSON.stringify({ contaOrigemId, contaDestinoId, valor }),
    });
};


// --- Funções do Funcionário ---
export const getTodosClientes = () => {
    return fetchAPI('/funcionarios/clientes');
};

export const cadastrarCliente = (dadosCliente) => {
    return fetchAPI('/clientes', {
        method: 'POST',
        body: JSON.stringify(dadosCliente),
    });
};

export const atualizarCliente = (clienteId, dadosCliente) => {
    return fetchAPI(`/clientes/${clienteId}`, {
        method: 'PUT',
        body: JSON.stringify(dadosCliente),
    });
};

export const deletarCliente = (clienteId) => {
    return fetchAPI(`/clientes/${clienteId}`, {
        method: 'DELETE',
    });
};

export const getAuditoria = () => {
    return fetchAPI('/auditoria');
};