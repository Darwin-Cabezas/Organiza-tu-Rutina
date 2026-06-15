const SeguimientoHabito = require('../models/SeguimientoHabito');
const { Op } = require('sequelize');

// Get tracking records for a date range or the last 7 days
exports.getTracking = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 7 days if not provided
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 7);
    
    const whereClause = {
      usuario_id: req.userId
    };

    if (startDate && endDate) {
      whereClause.fecha = {
        [Op.between]: [startDate, endDate]
      };
    } else {
      whereClause.fecha = {
        [Op.gte]: limitDate.toISOString().split('T')[0]
      };
    }

    const records = await SeguimientoHabito.findAll({
      where: whereClause,
      order: [['fecha', 'ASC']]
    });

    res.status(200).json(records);
  } catch (error) {
    console.error('Error al obtener seguimiento:', error);
    res.status(500).json({ message: 'Error al obtener el historial de seguimiento.' });
  }
};

// Log or update tracking for a specific date
exports.updateTracking = async (req, res) => {
  try {
    const { fecha, rutinas_completadas, rutinas_totales, habitos_saludables_completados } = req.body;

    if (!fecha) {
      return res.status(400).json({ message: 'La fecha es obligatoria.' });
    }

    // Find or create record for this date and user
    const [record, created] = await SeguimientoHabito.findOrCreate({
      where: {
        usuario_id: req.userId,
        fecha: fecha
      },
      defaults: {
        rutinas_completadas: rutinas_completadas || 0,
        rutinas_totales: rutinas_totales || 0,
        habitos_saludables_completados: habitos_saludables_completados || 0
      }
    });

    // If it already existed, update it
    if (!created) {
      await record.update({
        rutinas_completadas: rutinas_completadas !== undefined ? rutinas_completadas : record.rutinas_completadas,
        rutinas_totales: rutinas_totales !== undefined ? rutinas_totales : record.rutinas_totales,
        habitos_saludables_completados: habitos_saludables_completados !== undefined ? habitos_saludables_completados : record.habitos_saludables_completados
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Error al actualizar seguimiento:', error);
    res.status(500).json({ message: 'Error al actualizar el seguimiento diario.' });
  }
};
