const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await Usuario.create({
      nombre,
      email,
      password_hash
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'super_secret_key_organiza_tu_rutina_2026',
      { expiresIn: '24h' }
    );

    res.header('authorization', token).json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.userId, {
      attributes: ['id', 'nombre', 'email', 'profile_image_url', 'personal_data', 'fecha_registro']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nombre, email, profileImageUrl, personalData, oldPassword, newPassword } = req.body;
    const user = await Usuario.findByPk(req.userId);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Actualizar datos básicos
    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.profile_image_url = profileImageUrl || user.profile_image_url;
    user.personal_data = personalData || user.personal_data;

    // Lógica de cambio de contraseña si se solicita
    if (newPassword) {
      const validPass = await bcrypt.compare(oldPassword, user.password_hash);
      if (!validPass) return res.status(401).json({ message: 'La contraseña actual es incorrecta' });

      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({
      message: 'Perfil actualizado con éxito',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        profileImageUrl: user.profile_image_url,
        personalData: user.personal_data
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};