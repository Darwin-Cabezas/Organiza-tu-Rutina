const Task = require('../models/Tarea');
const Routine = require('../models/Rutina');

exports.getTasksByRoutine = async (req, res) => {
    try {
        const { routineId } = req.params;
        // Verificar que la rutina pertenezca al usuario
        const routine = await Routine.findOne({ where: { id: routineId, usuario_id: req.userId } });
        if (!routine) return res.status(404).json({ message: 'Rutina no encontrada' });

        const tasks = await Task.findAll({ where: { rutina_id: routineId } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { rutina_id, titulo, hora_programada, duracion_minutos } = req.body;

        const routine = await Routine.findOne({ where: { id: rutina_id, usuario_id: req.userId } });
        if (!routine) return res.status(404).json({ message: 'Rutina no válida' });

        const newTask = await Task.create({
            rutina_id,
            titulo,
            hora_programada,
            duracion_minutos
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id, {
            include: [{ model: Routine, where: { usuario_id: req.userId } }]
        });

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada o sin permisos' });

        await task.destroy();
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
    }
};