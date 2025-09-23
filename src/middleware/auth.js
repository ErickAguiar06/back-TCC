const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secreta';

// Middleware base de autenticação
function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido ou expirado' });
        }

        req.usuario = usuario; // aqui vai ter { id, email, tipo } que você salvou no login
        next();
    });
}

// Middleware extra para verificar ADMIN
function verificarAdmin(req, res, next) {
    if (req.usuario && req.usuario.tipo === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ erro: 'Acesso restrito a administradores' });
}

module.exports = { autenticarJWT, verificarAdmin };
