const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const Usuario = require('./models/Usuario'); // Importar el modelo Usuario
// Importación de rutas
const authRoutes = require('./routes/authRoutes');
const routineRoutes = require('./routes/routineRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/tasks', taskRoutes);

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
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

startServer();