import React, { useState, useEffect } from 'react';
import { Plus, Bell, Play, Clock, X, Check } from 'lucide-react';
import api from '../services/api';
import { requestNotificationPermission } from '../services/notificationService';

interface Routine {
  id: number;
  titulo: string;
  color_hex: string;
  icono: string;
  activa: boolean;
  tareas_count?: number;
}

const Home: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Estudiante');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [routinesRes, profileRes] = await Promise.all([
        api.get('/routines'),
        api.get('/auth/profile')
      ]);
      setRoutines(routinesRes.data);
      setUserName(profileRes.data.nombre.split(' ')[0]);
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Fallback
      setRoutines([
        { id: 1, titulo: 'Mañana Productiva', color_hex: '#fad3cf', icono: '🌅', activa: true, tareas_count: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    requestNotificationPermission();
  }, []);

  const handleCreateRoutine = async () => {
    if (!newTitle) return;
    try {
      await api.post('/routines', {
        titulo: newTitle,
        color_hex: '#c084fc',
        icono: '📝'
      });
      setNewTitle('');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating routine:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* Header & Notification Widget */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>¡Hola, {userName}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className="glass-panel" style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          color: 'var(--text-primary)'
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '8px',
            height: '8px',
            background: 'var(--color-primary)',
            borderRadius: '50%',
            border: '2px solid #0a0a14'
          }} />
        </button>
      </div>

      {/* Active Routine Carousel Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tus Rutinas Activas</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>Ver todas</button>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollbarWidth: 'none'
        }} className="no-scrollbar">
          {loading ? (
            <div className="glass-panel" style={{ width: '240px', height: '160px', borderRadius: 'var(--radius-lg)' }} />
          ) : (
            routines.map((routine) => (
              <div
                key={routine.id}
                className="glass-panel"
                style={{
                  minWidth: '240px',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  borderLeft: `6px solid ${routine.color_hex}`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.03), ${routine.color_hex}05)`
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{routine.icono}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{routine.titulo}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {routine.tareas_count || 0} tareas programadas
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button style={{
                    background: routine.color_hex,
                    color: '#050508',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button - Corrected Label */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{
          width: '100%',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Plus size={24} />
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>Crear nueva rutina</span>
        </button>
      </div>

      {/* Simple Create Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 800 }}>Nueva Rutina</h3>
              <X onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: Rutina de Gimnasio"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={handleCreateRoutine}
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                <Check size={18} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;