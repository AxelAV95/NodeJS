const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Espera "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.positions = decoded.positions; // Extraemos las posiciones del token
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };