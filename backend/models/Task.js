const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Routine = require('./Routine');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rutina_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    hora_programada: {
        type: DataTypes.TIME,
        allowNull: false
    },
    duracion_minutos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    notificaciones_activas: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, { tableName: 'tareas' });

module.exports = Task;