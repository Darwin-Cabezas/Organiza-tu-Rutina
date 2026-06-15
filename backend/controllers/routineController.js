const Routine = require('../models/Routine');
const Task = require('../models/Task');
const sequelize = require('../config/database');

exports.getAllRoutines = async (req, res) => {
  try {
    const routines = await Routine.findAll({
      where: { usuario_id: req.userId },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM tareas AS task
              WHERE task.rutina_id = Routine.id
            )`),
            'tareas_count'
          ]
        ]
      }
    });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rutinas', error: error.message });
  }
};

exports.createRoutine = async (req, res) => {
  try {
    const { titulo, color_hex, icono } = req.body;
    const newRoutine = await Routine.create({
      usuario_id: req.userId,
      titulo,
      color_hex,
      icono
    });
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la rutina', error: error.message });
  }
};

exports.deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    await Routine.destroy({ where: { id, usuario_id: req.userId } });
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la rutina', error: error.message });
  }
};