const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const Usuario = require('./models/Usuario'); // Importar el modelo Usuario
// Importar modelos restantes para asegurar que sequelize.sync() cree todas las tablas
require('./models/Rutina');
require('./models/Tarea');
require('./models/SeguimientoHabito');

// Importación de rutas
const authRoutes = require('./routes/authRoutes');
const routineRoutes = require('./routes/routineRoutes');
const taskRoutes = require('./routes/taskRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tracking', trackingRoutes);

// Ruta de salud (Health check)
app.get('/', (req, res) => {
  res.json({ message: 'API de Organiza tu Rutina funcionando correctamente' });
});

// Sincronización de Base de Datos y arranque del servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');

    // sync() asegura que los modelos existan en la BD sin borrar datos existentes
    // alter: true actualizará las tablas existentes si agregas nuevos campos a los modelos
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

startServer();