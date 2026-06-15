const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se encontró el token de sesión.' });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_key_organiza_tu_rutina_2026'
    );
    req.userId = verified.id;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(403).json({ message: 'Sesión expirada o token inválido.' });
  }
};