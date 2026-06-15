const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Routine = sequelize.define('Routine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    color_hex: {
        type: DataTypes.STRING(7),
        defaultValue: '#FAD3CF'
    },
    icono: {
        type: DataTypes.STRING(50),
        defaultValue: 'default-icon'
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, { tableName: 'rutinas' });

module.exports = Routine;