const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Rutina = sequelize.define('rutinas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  color_hex: {
    type: DataTypes.STRING(7),
    defaultValue: '#FAD3CF',
  },
  icono: {
    type: DataTypes.STRING(50),
    defaultValue: 'default-icon',
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Relationships
Usuario.hasMany(Rutina, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Rutina.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Rutina;
