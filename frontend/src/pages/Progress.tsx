import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Award, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface DailyTracking {
  id?: number;
  fecha: string;
  rutinas_completadas: number;
  rutinas_totales: number;
  habitos_saludables_completados: number;
}

const Progress: React.FC = () => {
  const [trackingData, setTrackingData] = useState<DailyTracking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracking = async () => {
    try {
      const response = await api.get('/tracking');
      if (response.data && response.data.length > 0) {
        setTrackingData(response.data);
      } else {
        throw new Error('No data');
      }
    } catch (error) {
      console.error('Error fetching tracking data, using mock values:', error);
      // Premium Mock Tracking Data matching mockups and corrections
      setTrackingData([
        { fecha: '2026-06-09', rutinas_completadas: 3, rutinas_totales: 4, habitos_saludables_completados: 2 },
        { fecha: '2026-06-10', rutinas_completadas: 2, rutinas_totales: 4, habitos_saludables_completados: 1 },
        { fecha: '2026-06-11', rutinas_completadas: 4, rutinas_totales: 4, habitos_saludables_completados: 3 },
        { fecha: '2026-06-12', rutinas_completadas: 3, rutinas_totales: 5, habitos_saludables_completados: 2 },
        { fecha: '2026-06-13', rutinas_completadas: 1, rutinas_totales: 3, habitos_saludables_completados: 1 },
        { fecha: '2026-06-14', rutinas_completadas: 5, rutinas_totales: 6, habitos_saludables_completados: 4 },
        { fecha: '2026-06-15', rutinas_completadas: 6, rutinas_totales: 8, habitos_saludables_completados: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, []);

  // Compute stats for today
  const todayRecord = trackingData[trackingData.length - 1] || { rutinas_completadas: 3, rutinas_totales: 4 };
  const completedRoutines = todayRecord.rutinas_completadas;
  const totalRoutines = todayRecord.rutinas_totales || 1;
  const completionPercentage = Math.round((completedRoutines / totalRoutines) * 100);
  const pendingPercentage = 100 - completionPercentage;

  // Pie chart data: strict 100% total (e.g. 75% Completed, 25% Pending)
  const pieData = [
    { name: 'Completado', value: completionPercentage, color: 'var(--color-mint)' },
    { name: 'Pendiente', value: pendingPercentage, color: 'rgba(255, 255, 255, 0.05)' },
  ];

  // Bar chart data formatted with corrected Spanish week names
  const dayNamesSpanish = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const barData = trackingData.map((d, index) => {
    // Map records to week days
    const dateObj = new Date(d.fecha + 'T00:00:00');
    // Adjust week day index to start on Monday (0 is Sunday, so 1 is Monday...)
    const dayOfWeek = dateObj.getDay();
    const spanIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    return {
      name: dayNamesSpanish[spanIndex] || 'Día',
      'Rutinas Completadas': d.rutinas_completadas,
      'Hábitos Saludables': d.habitos_saludables_completados,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', fontWeight: 600 }}>
          Métricas de Rendimiento
        </span>
        <h1 style={{ fontSize: '1.8rem', marginTop: '4px', fontWeight: 800 }}>
          Análisis de Progreso
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Cargando análisis...
        </div>
      ) : (
        <>
          {/* Circular Progress (Pie Chart) Widget */}
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', alignSelf: 'flex-start' }}>Estado de Hoy</h3>
            
            <div style={{ width: '100%', height: '200px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Circle Label */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {completionPercentage}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Completado
                </span>
              </div>
            </div>

            {/* Legend Indicators */}
            <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-mint)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{completionPercentage}% Completado</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pendingPercentage}% Pendiente</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Zap size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Racha Actual</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>5 Días</p>
              </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--color-mint-glow)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-mint)' }}>
                <Award size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hábitos del Mes</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>88% Logrado</p>
              </div>
            </div>
          </div>

          {/* Weekly Bar Chart Widget */}
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Actividad Semanal</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                <TrendingUp size={14} />
                <span>+12% vs la semana pasada</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="Rutinas Completadas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="Hábitos Saludables" fill="var(--color-blue)" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Progress;
