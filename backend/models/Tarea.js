const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rutina = require('./Rutina');

const Tarea = sequelize.define('tareas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rutina_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rutina,
      key: 'id'
    }
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  hora_programada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  duracion_minutos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notificaciones_activas: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Relationships
Rutina.hasMany(Tarea, { foreignKey: 'rutina_id', onDelete: 'CASCADE' });
Tarea.belongsTo(Rutina, { foreignKey: 'rutina_id' });

module.exports = Tarea;
