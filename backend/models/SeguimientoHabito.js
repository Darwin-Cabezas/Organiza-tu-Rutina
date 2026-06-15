const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const SeguimientoHabito = sequelize.define('seguimiento_habitos', {
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
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  rutinas_completadas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rutinas_totales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  habitos_saludables_completados: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'fecha']
    }
  ]
});

// Relationships
Usuario.hasMany(SeguimientoHabito, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
SeguimientoHabito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = SeguimientoHabito;
