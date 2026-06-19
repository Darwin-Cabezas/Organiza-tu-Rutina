import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import api from '../services/api';

interface LoginProps {
  onLoginSuccess: (user: { id: number; nombre: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        await Preferences.set({ key: 'auth_token', value: token });
        onLoginSuccess(user);
        navigate('/');
      } else {
        if (!nombre || !email || !password) {
          setError('Todos los campos son obligatorios para el registro.');
          setLoading(false);
          return;
        }
        await api.post('/auth/register', { nombre, email, password });

        // Registro exitoso: Limpiar y pasar a login
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        setMode('login');
        setNombre('');
        setPassword('');
        setError('');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Ha ocurrido un error. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'var(--color-primary-glow)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        top: '15%',
        zIndex: 0
      }} />

      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid var(--glass-border)'
      }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <LogIn size={28} color="#050508" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 800 }}>
            {mode === 'login' ? 'Organiza tu Rutina' : 'Crea tu Cuenta'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {mode === 'login'
              ? 'Gestiona tu tiempo y bienestar estudiantil'
              : 'Empieza a planificar tu éxito académico'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-panel" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Nombre Completo
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Darwin Cabezas"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input-field"
                placeholder="estudiante@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
          >
            {loading ? (
              <span>Procesando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                <span>Ingresar</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Registrarse</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginLeft: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
