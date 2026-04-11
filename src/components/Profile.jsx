import React from 'react';
import { Mail, Briefcase, Star, AppWindow, Shield, User, ExternalLink, HardDrive, AlertCircle } from 'lucide-react';

const Profile = ({ user }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* Header context */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Employee Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>View your personnel details and access levels.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        
        {/* Left Column: Avatar & Basic Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
               width: '120px', 
               height: '120px', 
               borderRadius: '50%', 
               background: 'var(--bg-surface)', 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               fontSize: '3.5rem', 
               fontWeight: 'bold',
               color: 'var(--accent-color)',
               marginBottom: '1.5rem',
               boxShadow: '0 0 0 4px var(--bg-surface), 0 0 0 8px var(--accent-glow)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{user.name}</h2>
            
            <div style={{ background: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1.5rem', border: '1px solid var(--accent-color)' }}>
              {user.role}
            </div>

            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
              <Mail size={16} color="var(--text-muted)" />
              <span>{user.email || 'No email provided'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
            <User size={22} color="var(--accent-color)" />
            <span>Professional Details</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Briefcase size={18} /><span>Job Role</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{user.role}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <AppWindow size={18} /><span>Assigned Product</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{user.product}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Star size={18} /><span>Specialization</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{user.specialization}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <HardDrive size={18} /><span>Personal Drive Link</span>
              </div>
              <div>
                {user.driveLink && user.driveLink.includes('http') ? (
                  <a href={user.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 1rem', textDecoration: 'none', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    Open My Folder <ExternalLink size={14} />
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not assigned</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Shield size={18} /><span>Security Clearance</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--success-color)', background: 'var(--success-bg)', padding: '0.4rem 1rem', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(46, 204, 168, 0.3)' }}>
                Standard Access
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--warning-bg)', border: '1px solid var(--warning-color)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', alignItems: 'flex-start', boxShadow: '0 0 20px var(--warning-bg)' }}>
            <AlertCircle size={24} color="var(--warning-color)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--warning-color)' }}>HR Notice</strong>
              Profile details are securely synced from the Master Roster. To update your role, specialization, or access level, please raise a query with the Admin desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
