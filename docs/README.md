# Banco Malvezi - README

## Visão Geral

Este projeto implementa uma API RESTful para o sistema bancário do Banco Malvezi, oferecendo funcionalidades como gestão de clientes, contas bancárias, transações financeiras, autenticação e auditoria.

## Estrutura do Projeto

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

```
/banco-malvezi
│
├── /config             # Configuração do banco de dados e outras definições globais
│   ├── database.js     # Conexão com MySQL
│
├── /controllers        # Controladores que gerenciam as regras de negócio
│   ├── clienteController.js   # Gerencia operações relacionadas a clientes
│   ├── contaController.js     # Gerencia operações de contas bancárias
│   ├── transacaoController.js # Gerencia transações financeiras
│   ├── authController.js      # Gerencia autenticação e login
│   ├── funcionarioController.js # Gerencia operações de funcionários
│   ├── auditoriaController.js  # Gerencia registros de auditoria
│
├── /dao                # Camada de acesso ao banco de dados
│   ├── ClienteDAO.js   # Operações SQL relacionadas a clientes
│   ├── ContaDAO.js     # Operações SQL relacionadas a contas bancárias
│   ├── TransacaoDAO.js # Operações SQL relacionadas a transações
│   ├── FuncionarioDAO.js # Operações SQL para funcionários
│
├── /middlewares        # Middlewares para proteção e validações
│   ├── authMiddleware.js # Middleware para autenticação JWT
│   ├── corsMiddleware.js # Middleware para permitir CORS
│
├── /routes             # Definição das rotas da API
│   ├── clienteRoutes.js   # Rotas relacionadas a clientes
│   ├── contaRoutes.js     # Rotas relacionadas a contas bancárias
│   ├── transacaoRoutes.js # Rotas relacionadas a transações financeiras
│   ├── authRoutes.js      # Rotas de autenticação e login
│   ├── funcionarioRoutes.js # Rotas de funcionários
│   ├── auditoriaRoutes.js  # Rotas de auditoria
│
├── /utils              # Funções auxiliares e utilitários
│   ├── criptografia.js   # Funções para hashing de senha e segurança
│   ├── formatacao.js     # Utilitários para formatação de dados
│
├── /docs               # Documentação do projeto
│   ├── README.md        # Instruções gerais do projeto
│   ├── api-docs.md      # Especificação da API e endpoints
│
├── index.js            # Arquivo principal que inicializa o servidor
```

## Instalação e Execução

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=banco_malvezi
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   ```

3. Inicie o servidor:
   ```
   npm start
   ```

## Tecnologias Utilizadas

- Node.js
- Express.js
- MySQL
- JWT para autenticação
- bcrypt para criptografia de senhas

## Documentação da API

Para mais detalhes sobre os endpoints disponíveis, consulte o arquivo `docs/api-docs.md`.
