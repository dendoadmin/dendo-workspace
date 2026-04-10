import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

// THE CORS KILLER HELPER
const fetchJsonp = (url) => {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
      resolve(data);
      delete window[callbackName];
      document.body.removeChild(script);
    };
    const script = document.createElement('script');
    script.src = url + '&callback=' + callbackName;
    script.onerror = () => {
      reject(new Error("JSONP request failed"));
      delete window[callbackName];
      document.body.removeChild(script);
    };
    document.body.appendChild(script);
  });
};

const Login = ({ onLogin, apiUrl }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !phone) {
      setError('Email and password (phone number) are required.');
      return;
    }

    if (email === 'dendo2462@gmail.com' && phone === '9606909443Ks@#') {
      onLogin({ name: 'Super Admin', role: 'Admin', product: 'Master Overseer', specialization: 'System Administrator', email: 'dendo2462@gmail.com' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // JSONP completely bypasses CORS!
      const targetUrl = `${apiUrl}?action=login&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
      const data = await fetchJsonp(targetUrl);
      
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('Connection to remote server lost. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-grid">
      <div className="ambient-bg"></div>
      <div className="landing-content animate-slide-up">
        <div style={{ marginBottom: '4rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Elevate your <br /><span className="text-gradient-accent">productivity.</span></h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>Access the command center to manage products, track progress, and collaborate seamlessly across teams.</p>
        </div>
      </div>

      <div className="landing-form-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glow-orb"></div>
        <div className="surface-glass" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center' }}>Enter your work email and password.</p>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(255, 95, 89, 0.3)', color: 'var(--danger-color)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="input" style={{ paddingLeft: '2.75rem', height: '3rem' }} placeholder="name@dendo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" className="input" style={{ paddingLeft: '2.75rem', height: '3rem' }} placeholder="Enter your password" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '3rem', marginTop: '0.75rem' }} disabled={loading}>
              {loading ? <><div className="spinner"></div><span>Authenticating...</span></> : <><span>Secure Login</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;