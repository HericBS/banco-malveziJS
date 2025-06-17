# Banco Malvezi - Documentação da API

## Visão Geral

Esta API fornece serviços bancários para o Banco Malvezi, incluindo:
- Gestão de clientes
- Gestão de contas bancárias
- Operações financeiras (depósitos, saques, transferências)
- Autenticação e segurança
- Auditoria de operações

## Estrutura do Projeto

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
├── index.js            # Arquivo principal que inicializa o servidor
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Autenticação de usuário
- `POST /api/auth/gerar-otp` - Geração de OTP para autenticação de dois fatores
- `POST /api/auth/logout` - Encerramento de sessão

### Clientes
- `POST /api/clientes/cadastrar` - Cadastro de novo cliente
- `GET /api/clientes` - Listagem de clientes (requer autenticação)

### Contas
- `POST /api/contas/criar` - Criação de nova conta bancária
- `GET /api/contas/saldo/:contaId` - Consulta de saldo
- `GET /api/contas/limite/:contaId` - Consulta de limite de crédito

### Transações
- `POST /api/transacoes/deposito` - Realização de depósito
- `POST /api/transacoes/saque` - Realização de saque
- `POST /api/transacoes/transferencia` - Realização de transferência
- `GET /api/transacoes/extrato/:contaId` - Emissão de extrato

### Funcionários
- `POST /api/funcionarios/cadastrar` - Cadastro de novo funcionário (requer admin)
- `GET /api/funcionarios` - Listagem de funcionários (requer admin)

### Auditoria
- `GET /api/auditoria/registros` - Consulta de registros de auditoria (requer funcionário)

## Requisitos

- Node.js 14+
- MySQL 8+
- Dependências: express, mysql2, bcryptjs, jsonwebtoken, cors, dotenv

## Instalação

1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Configure o arquivo `.env` com as variáveis de ambiente necessárias
4. Execute `npm start` para iniciar o servidor

## Segurança

A API utiliza JWT (JSON Web Tokens) para autenticação e autorização, com middlewares específicos para proteção de rotas sensíveis. Senhas são armazenadas com hash usando bcrypt.
