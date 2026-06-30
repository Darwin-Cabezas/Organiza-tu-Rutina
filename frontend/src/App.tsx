import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import api from './services/api';
import { syncPendingData, setupSyncListeners } from './services/syncService';

// Components
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Progress from './pages/Progress';
import Reminders from './pages/Reminders';
import Wellness from './pages/Wellness';

interface UserState {
  id: number;
  nombre: string;
  email: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserState | null>(null);

  // Check login status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { value } = await Preferences.get({ key: 'auth_token' });
        if (value) {
          // Verify token by calling profile endpoint
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setIsAuthenticated(true);
          
          // Trigger sync on load
          syncPendingData().catch(err => console.error('Auto-sync failed on load:', err));
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session verification failed, logging out:', error);
        // Clear token if invalid
        await Preferences.remove({ key: 'auth_token' });
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Global listener to sync whenever device goes online
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = setupSyncListeners();
      return () => cleanup();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (userData: UserState) => {
    setUser(userData);
    setIsAuthenticated(true);
    syncPendingData().catch(err => console.error('Sync failed after login:', err));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Wait for session check
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#f3f4f6'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Cargando sesión...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Unauthenticated routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Authenticated routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout userName={user?.nombre || ''} onLogout={handleLogout}>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/progress"
          element={
            isAuthenticated ? (
              <Layout userName={user?.nombre || ''} onLogout={handleLogout}>
                <Progress />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/reminders"
          element={
            isAuthenticated ? (
              <Layout userName={user?.nombre || ''} onLogout={handleLogout}>
                <Reminders />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/wellness"
          element={
            isAuthenticated ? (
              <Layout userName={user?.nombre || ''} onLogout={handleLogout}>
                <Wellness />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
