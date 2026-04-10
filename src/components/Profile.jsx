import React from 'react';
import { Mail, Briefcase, Star, AppWindow, Shield, User, ExternalLink, HardDrive } from 'lucide-react';

const Profile = ({ user }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* Header context */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Employee Profile</h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>View your personnel details and access levels.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        
        {/* Left Column: Avatar & Basic Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
               width: '100px', 
               height: '100px', 
               borderRadius: '50%', 
               background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               fontSize: '3.5rem', 
               fontWeight: 'bold',
               color: '#fff',
               marginBottom: '1.5rem',
               boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>{user.name}</h2>
            
            <div style={{ background: '#dbeafe', color: '#1e40af', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1.5rem', border: '1px solid #bfdbfe' }}>
              {user.role}
            </div>

            <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '1rem 0' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>
              <Mail size={16} color="#64748b" />
              <span>{user.email || 'No email provided'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a' }}>
            <User size={22} color="#2563eb" />
            <span>Professional Details</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, max-content) 1fr', gap: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                <Briefcase size={18} />
                <span>Job Role</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                {user.role}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, max-content) 1fr', gap: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                <AppWindow size={18} />
                <span>Assigned Product</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                {user.product}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, max-content) 1fr', gap: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                <Star size={18} />
                <span>Specialization</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                {user.specialization}
              </div>
            </div>

            {/* NEW: Display the user's dedicated Drive folder link */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, max-content) 1fr', gap: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                <HardDrive size={18} />
                <span>Personal Drive Link</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                {user.driveLink && user.driveLink.includes('http') ? (
                  <a href={user.driveLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Open My Folder <ExternalLink size={14} />
                  </a>
                ) : (
                  <span style={{ color: '#ef4444' }}>Not assigned</span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, max-content) 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                <Shield size={18} />
                <span>Security Clearance</span>
              </div>
              <div style={{ fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.75rem', borderRadius: '6px', width: 'fit-content' }}>
                Standard Access
              </div>
            </div>

          </div>

          <div style={{ marginTop: '3rem', padding: '1.25rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#f59e0b', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.8rem' }}>!</div>
            <p style={{ fontSize: '0.9rem', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>HR Notice</strong>
              Profile details are securely synced from the Master Roster. To update your role, specialization, or access level, please raise a query with the Admin desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;