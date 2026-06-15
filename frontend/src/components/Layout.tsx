import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, Bell, Heart, LogOut } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';

interface LayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = async () => {
    await Preferences.remove({ key: 'auth_token' });
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/progress', label: 'Progreso', icon: BarChart2 },
    { path: '/reminders', label: 'Recordatorios', icon: Bell },
    { path: '/wellness', label: 'Bienestar', icon: Heart },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <header className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 10,
        position: 'sticky',
        top: 0
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Organiza tu Rutina
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Hola, {userName || 'Estudiante'}
          </p>
        </div>
        <button 
          onClick={handleLogoutClick} 
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ef4444',
            transition: 'var(--transition-fast)'
          }}
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingBottom: '90px', // spacing for bottom bar
        position: 'relative'
      }}>
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="glass-panel" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid var(--glass-border)',
        zIndex: 10,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-fast)',
                width: '60px'
              }}
            >
              <div style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)'
              }}>
                <Icon size={20} style={{ strokeWidth: isActive ? 2.5 : 2 }} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
