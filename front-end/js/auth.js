// assets/js/auth.js
import * as api from './api.js';

/**
 * Lida com o processo de login do usuário.
 * Pega os dados do formulário, chama a API e redireciona em caso de sucesso.
 * @param {Event} event - O evento de submit do formulário.
 * @param {string} tipo - O tipo de usuário ('cliente' ou 'funcionario').
 */
async function handleLogin(event, tipo) {
    event.preventDefault(); // Impede o recarregamento da página

    const form = event.target;
    const cpf = form.cpf.value;
    const senha = form.senha.value;
    const errorMessageElement = document.getElementById('error-message');

    try {
        errorMessageElement.textContent = ''; // Limpa mensagens de erro antigas
        const data = await api.login(cpf, senha, tipo);

        if (data.token && data.user) {
            // Salva o token e os dados do usuário no localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redireciona para o painel apropriado
            if (data.user.tipo === 'cliente') {
                window.location.href = '/cliente.html';
            } else if (data.user.tipo === 'funcionario') {
                window.location.href = '/funcionario.html';
            }
        } else {
            throw new Error(data.message || 'Resposta de login inválida.');
        }
    } catch (error) {
        errorMessageElement.textContent = `Erro no login: ${error.message}`;
        console.error('Falha no login:', error);
    }
}

/**
 * Lida com o processo de logout.
 * Limpa os dados do localStorage e redireciona para a página de login.
 */
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

/**
 * Verifica se o usuário está logado e se tem a permissão necessária para acessar a página.
 * @param {string[]} allowedRoles - Um array com os tipos de usuário permitidos (ex: ['cliente']).
 */
function protectPage(allowedRoles) {
    const user = JSON.parse(localStorage.getItem('user'));

    // Se não houver usuário ou o tipo dele não for permitido, redireciona para o login
    if (!user || !allowedRoles.includes(user.tipo)) {
        window.location.href = '/index.html';
    }
}

/**
 * Retorna os dados do usuário logado.
 * @returns {object|null} - O objeto do usuário ou null se não estiver logado.
 */
function getAuthenticatedUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Exporta as funções para que possam ser usadas em outros arquivos
export { handleLogin, handleLogout, protectPage, getAuthenticatedUser };