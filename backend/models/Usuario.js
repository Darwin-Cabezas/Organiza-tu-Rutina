const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  profile_image_url: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://via.placeholder.com/150',
  },
  personal_data: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;