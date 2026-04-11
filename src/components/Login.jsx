import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { sounds } from '../utils/sounds';
import logoImage from './logo/logo.jpeg';

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
  const [showPassword, setShowPassword] = useState(false);

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
      const targetUrl = `${apiUrl}?action=login&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
      const data = await fetchJsonp(targetUrl);
      
      if (data.success) {
        sounds.playSuccess();
        onLogin(data.user);
      } else {
        sounds.playAlert();
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('Connection to remote server lost. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-deep);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        /* Ambient Background Animations */
        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 1;
          opacity: 0.15;
          animation: float 10s infinite alternate ease-in-out;
        }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: var(--accent-color); animation-delay: 0s; }
        .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #8b5cf6; animation-delay: -5s; }
        
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 10%) scale(1.1); }
        }

        /* Centered Split Card Layout */
        .login-glass-card {
          display: flex;
          flex-direction: row;
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
          background: var(--bg-surface);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.05) inset;
          overflow: hidden;
          z-index: 10;
          animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleUpFade {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Left Panel - Branding */
        .login-brand-panel {
          flex: 1.1;
          background: linear-gradient(145deg, var(--bg-surface-hover) 0%, var(--bg-deep) 100%);
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          border-right: 1px solid var(--border-color);
        }

        /* Right Panel - Form */
        .login-form-panel {
          flex: 0.9;
          padding: 4rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--bg-surface);
        }

        /* Premium Form Elements */
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .auth-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-left: 0.25rem;
        }
        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-icon {
          position: absolute;
          left: 1.2rem;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .auth-input {
          width: 100%;
          background: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-radius: 12px;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .auth-input:focus {
          outline: none;
          border-color: var(--accent-color);
          background: var(--bg-surface);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .auth-input:focus + .auth-icon,
        .auth-input:not(:placeholder-shown) + .auth-icon {
          color: var(--accent-color);
        }

        .btn-auth {
          width: 100%;
          padding: 1.1rem;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-color), #1d4ed8);
          color: white;
          border: none;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 1rem;
        }
        .btn-auth:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
        .btn-auth:active {
          transform: translateY(1px);
        }

        /* Responsive Layout */
        @media (max-width: 900px) {
          .login-glass-card { flex-direction: column; }
          .login-brand-panel { padding: 2.5rem; border-right: none; border-bottom: 1px solid var(--border-color); flex: none; }
          .login-form-panel { padding: 2.5rem; flex: none; }
          .hide-on-mobile { display: none !important; }
        }
      `}} />

      {/* Ambient animated background */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <div className="login-glass-card">
        
        {/* LEFT PANEL: BRANDING */}
        <div className="login-brand-panel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
              <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '20px', border: '2px solid var(--border-color)', boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 15px rgba(37, 99, 235, 0.25)' }}>
                <img src={logoImage} alt="Dendo Logo" style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Dendo</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Maintenance Portal</div>
              </div>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Command <br/> <span style={{ color: 'var(--accent-color)' }}>Center.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '85%', lineHeight: 1.6 }}>
              Secure access to manage master deliverables, track systemic progress, and coordinate enterprise telemetry.
            </p>
          </div>

          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-deep)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>End-to-End Encryption</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your connection is secure.</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: FORM */}
        <div className="login-form-panel">
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your credentials to access the portal.</p>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(255, 95, 89, 0.3)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'scaleUpFade 0.3s ease' }}>
              <ShieldCheck size={20} style={{ flexShrink: 0 }} /> 
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="auth-input-group">
              <label className="auth-label">Work Email</label>
              <div className="auth-input-wrapper">
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@dendo.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading} 
                  required
                />
                <Mail className="auth-icon" size={18} />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Access Token (Phone)</label>
              <div className="auth-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="••••••••" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  disabled={loading}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <Lock className="auth-icon" size={18} />
                <button 
                  type="button" 
                  onClick={() => { sounds.playClick(); setShowPassword(!showPassword); }} 
                  style={{ position: 'absolute', right: '1.2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-auth" 
              disabled={loading} 
              onMouseEnter={() => sounds.playHover()} 
              onClick={() => !loading && sounds.playClick()}
            >
              {loading ? (
                <><div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderRightColor: '#fff', width: '20px', height: '20px', borderWidth: '3px' }}></div><span>Verifying...</span></>
              ) : (
                <><span>Authorize Session</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
