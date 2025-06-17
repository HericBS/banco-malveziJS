const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '23144',
  database: process.env.DB_NAME || 'banco_malvezi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
