import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmy9xHFArsXv8GN4u781GnEckkYZ3Kb5YJZYvQ12m-qJtAuMeGhxtz8q0_Vxsx2gyW/exec';

function App() {
  const [user, setUser] = useState(null);
  const [apiUrl, setApiUrl] = useState(GOOGLE_APPS_SCRIPT_URL);

  useEffect(() => {
    const storedUser = localStorage.getItem('dendo_user_v2');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('dendo_user_v2', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dendo_user_v2');
  };

  return (
    <>
      {!apiUrl || apiUrl === 'PASTE_YOUR_NEW_DEPLOYMENT_URL_HERE' ? (
        <div style={{ background: 'var(--warning-color)', color: '#09090b', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <AlertCircle size={18} />
          <span>System Setup Required: Set your GOOGLE_APPS_SCRIPT_URL in App.jsx</span>
        </div>
      ) : null}
      
      {user ? (
        user.role === 'Admin' ? (
          <AdminDashboard user={user} onLogout={handleLogout} apiUrl={apiUrl} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} apiUrl={apiUrl} />
        )
      ) : (
        <Login onLogin={handleLogin} apiUrl={apiUrl} />
      )}
    </>
  );
}

export default App;