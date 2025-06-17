
import { handleLogout, protectPage } from './auth.js';

// Função para determinar a página atual e aplicar as devidas regras.
function inicializarPagina() {
    const pagina = window.location.pathname;

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }

    if (pagina.includes('cliente.html')) {
        protectPage(['cliente']);
        // A lógica específica do cliente será carregada pelo seu próprio script.
    } else if (pagina.includes('funcionario.html')) {
        protectPage(['funcionario']);
        // A lógica específica do funcionário será carregada pelo seu próprio script.
    }
}

// Garante que o DOM está carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', inicializarPagina);