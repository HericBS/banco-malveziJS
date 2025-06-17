const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "sua_chave_secreta";

// Middleware para verificar autenticação via JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido. Autenticação necessária." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
};

// Middleware para verificar se o usuário é funcionário
const verificarFuncionario = (req, res, next) => {
  if (req.usuario.tipo !== 'FUNCIONARIO') {
    return res.status(403).json({ mensagem: "Acesso negado. Apenas funcionários podem realizar esta operação." });
  }
  next();
};

// Middleware para verificar se o usuário é administrador
const verificarAdmin = (req, res, next) => {
  if (req.usuario.tipo !== 'ADMIN') {
    return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem realizar esta operação." });
  }
  next();
};

module.exports = {
  verificarToken,
  verificarFuncionario,
  verificarAdmin
};
