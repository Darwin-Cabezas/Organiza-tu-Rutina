import React, { useState } from 'react';
import { Heart, Share2, BookOpen, User, CheckCircle2, Award, ExternalLink, GraduationCap, Edit, Save, XCircle } from 'lucide-react';
import api from '../services/api';

interface WellnessResource {
  id: number;
  title: string;
  category: string;
  description: string;
  readTime: string;
  icon: string;
}

const Wellness: React.FC = () => {
  const [waterChecked, setWaterChecked] = useState(false);
  const [stretchChecked, setStretchChecked] = useState(false);
  const [sleepChecked, setSleepChecked] = useState(false);

  const [sharedId, setSharedId] = useState<number | null>(null);

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('Darwin David Cabezas Alvarez');
  const [profileEmail, setProfileEmail] = useState('darwin.cabezas@example.com'); // Assuming an email for the profile
  const [profileImageUrl, setProfileImageUrl] = useState('https://via.placeholder.com/150'); // Placeholder image
  const [personalData, setPersonalData] = useState('Estudiante de Ingeniería en Desarrollo de Software con pasión por las aplicaciones móviles y el bienestar.');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const resources: WellnessResource[] = [
    {
      id: 1,
      title: 'Manejo del Estrés en Época de Exámenes',
      category: 'Salud Mental',
      description: 'Aprende la técnica de respiración 4-7-8 y cómo realizar pausas de desconexión efectivas de 5 minutos.',
      readTime: '4 min lectura',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'Alimentación que potencia tu Cerebro',
      category: 'Nutrición',
      description: 'Los mejores superalimentos que ayudan a la retención de memoria y previenen la fatiga mental durante el estudio.',
      readTime: '5 min lectura',
      icon: '🥗'
    },
    {
      id: 3,
      title: 'Higiene del Sueño para Estudiantes',
      category: 'Descanso',
      description: 'Evitar pantallas 30 minutos antes de dormir aumenta tu fase de sueño profundo, mejorando tu rendimiento al día siguiente.',
      readTime: '3 min lectura',
      icon: '😴'
    }
  ];

  const handleShare = async (resource: WellnessResource) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard if Web Share API is missing
        await navigator.clipboard.writeText(`${resource.title}: ${resource.description}`);
        setSharedId(resource.id);
        setTimeout(() => setSharedId(null), 3000);
      }
    } catch (err) {
      console.error('Error sharing/copying resource:', err);
    }
  };

  const handleSaveProfile = async () => {
    // Simulate API call to update profile
    console.log('Guardando cambios del perfil...');
    console.log('Nombre:', profileName);
    console.log('Email:', profileEmail);
    console.log('URL Imagen:', profileImageUrl);
    console.log('Datos Personales:', personalData);

    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        alert('Las nuevas contraseñas no coinciden.');
        return;
      }
      // Simulate API call to change password
      console.log('Cambiando contraseña...');
      console.log('Contraseña Antigua:', oldPassword);
      console.log('Nueva Contraseña:', newPassword);
      // In a real app, you'd send oldPassword and newPassword to the backend
      // and handle hashing and validation there.
    }

    // In a real application, you would make API calls here:
    // try {
    //   await api.put('/api/user/profile', { name: profileName, email: profileEmail, imageUrl: profileImageUrl, personalData });
    //   if (newPassword) {
    //     await api.post('/api/user/change-password', { oldPassword, newPassword });
    //   }
    //   alert('Perfil actualizado exitosamente!');
    //   setIsEditingProfile(false);
    // } catch (error) {
    //   console.error('Error al actualizar el perfil:', error);
    //   alert('Hubo un error al actualizar el perfil.');
    // }

    alert('Perfil actualizado exitosamente (simulado)!');
    setIsEditingProfile(false);
    // Clear password fields after saving
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form fields to original profile data or last saved state
    // For now, just clear password fields
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Title */}
      <div>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', fontWeight: 600 }}>
          Hábitos & Desarrollo Estudiantil
        </span>
        <h1 style={{ fontSize: '1.8rem', marginTop: '4px', fontWeight: 800 }}>
          Descubrir Bienestar
        </h1>
      </div>

      {/* Habits Tracker */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(22, 22, 37, 0.7), rgba(192, 132, 252, 0.05))'
      }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={18} color="var(--color-primary)" />
          Tus Hábitos Saludables de Hoy
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Habit 1 */}
          <button
            onClick={() => setWaterChecked(!waterChecked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: waterChecked ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: waterChecked ? '1px solid var(--color-blue)' : '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>💧</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Beber 2 Litros de Agua</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mantén la hidratación cerebral</p>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: waterChecked ? 'none' : '1.5px solid var(--text-muted)',
              backgroundColor: waterChecked ? 'var(--color-blue)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050508'
            }}>
              {waterChecked && <CheckCircle2 size={16} color="#ffffff" />}
            </div>
          </button>

          {/* Habit 2 */}
          <button
            onClick={() => setStretchChecked(!stretchChecked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: stretchChecked ? 'rgba(74, 222, 128, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: stretchChecked ? '1px solid var(--color-mint)' : '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏃</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pausas Activas (Estiramientos)</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cada 2 horas de estudio continuo</p>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: stretchChecked ? 'none' : '1.5px solid var(--text-muted)',
              backgroundColor: stretchChecked ? 'var(--color-mint)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050508'
            }}>
              {stretchChecked && <CheckCircle2 size={16} color="#ffffff" />}
            </div>
          </button>

          {/* Habit 3 */}
          <button
            onClick={() => setSleepChecked(!sleepChecked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: sleepChecked ? 'rgba(192, 132, 252, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: sleepChecked ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>🛌</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dormir entre 7 y 8 Horas</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consolidación del aprendizaje diario</p>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: sleepChecked ? 'none' : '1.5px solid var(--text-muted)',
              backgroundColor: sleepChecked ? 'var(--color-primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050508'
            }}>
              {sleepChecked && <CheckCircle2 size={16} color="#ffffff" />}
            </div>
          </button>
        </div>
      </div>

      {/* Wellness Resources */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', fontWeight: 700 }}>Artículos Recomendados</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {resources.map((res) => (
            <div
              key={res.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {res.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.readTime}</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>{res.icon}</span>
                <span>{res.title}</span>
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '140%' }}>
                {res.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => handleShare(res)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <Share2 size={14} />
                  <span>{sharedId === res.id ? '¡Enlace copiado!' : 'Compartir artículo'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid rgba(192, 132, 252, 0.15)',
        background: 'radial-gradient(circle at 100% 0%, rgba(192, 132, 252, 0.05) 0%, transparent 80%)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#050508'
          }}>
            DC
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Darwin David Cabezas Alvarez</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <GraduationCap size={14} />
              <span>Instituto Superior Tecnológico Alberto Enríquez</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <User size={14} />
              <span>{profileEmail}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Rol</span>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>Desarrollador & Scrum Master</p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Proyecto</span>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-blue)', marginTop: '2px' }}>Organiza tu Rutina v1.0</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditingProfile(true)}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px 15px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-blue)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
        >
          <Edit size={18} />
          Editar Perfil
        </button>
      </div>

      {/* Profile Configuration Section (Conditional Rendering) */}
      {isEditingProfile && (
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(192, 132, 252, 0.15)',
          background: 'radial-gradient(circle at 100% 0%, rgba(192, 132, 252, 0.05) 0%, transparent 80%)',
          marginTop: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--color-primary)" />
            Configuración del Perfil
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Edit Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nombre:</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Edit Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email:</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Edit Profile Image URL */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>URL Imagen de Perfil:</label>
              <input
                type="text"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Edit Personal Data */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Datos Personales:</label>
              <textarea
                value={personalData}
                onChange={(e) => setPersonalData(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>

            {/* Change Password */}
            <div style={{ marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '15px', fontWeight: 600, color: 'var(--color-primary)' }}>Cambiar Contraseña</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Contraseña Actual:</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirmar Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleSaveProfile}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-mint)',
                  color: '#050508',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                <Save size={18} />
                Guardar Cambios
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                <XCircle size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Title (Addressing UX Maquette Correction) */}
      <footer style={{
        textAlign: 'center',
        padding: '10px 0 20px',
        borderTop: '1px solid var(--glass-border)',
        marginTop: '10px'
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          PROPUESTA & PERFIL
        </span>
      </footer>
    </div>
  );
};

export default Wellness;
      </div >

  {/* Footer Title (Addressing UX Maquette Correction) */ }
  < footer style = {{
  textAlign: 'center',
    padding: '10px 0 20px',
      borderTop: '1px solid var(--glass-border)',
        marginTop: '10px'
}}>
  <span style={{
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  }}>
    PROPUESTA & PERFIL
  </span>
      </footer >
    </div >
  );
};

export default Wellness;
