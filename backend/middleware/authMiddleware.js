const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Adjunta el ID del usuario a la solicitud
    next();
  } catch (error) {
    console.error('Error de verificación de token:', error);
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = verifyToken;