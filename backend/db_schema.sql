CREATE DATABASE IF NOT EXISTS organiza_tu_rutina;
USE organiza_tu_rutina;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Rutinas
CREATE TABLE IF NOT EXISTS rutinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    color_hex VARCHAR(7) DEFAULT '#FAD3CF',
    icono VARCHAR(50) DEFAULT 'default-icon',
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Tareas vinculadas a las rutinas
CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rutina_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    hora_programada TIME NOT NULL,
    duracion_minutos INT DEFAULT 0,
    notificaciones_activas BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rutina_id) REFERENCES rutinas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Seguimiento diario para estadísticas
CREATE TABLE IF NOT EXISTS seguimiento_habitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    rutinas_completadas INT DEFAULT 0,
    rutinas_totales INT DEFAULT 0,
    habitos_saludables_completados INT DEFAULT 0,
    UNIQUE KEY unica_fecha_usuario (usuario_id, fecha),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
