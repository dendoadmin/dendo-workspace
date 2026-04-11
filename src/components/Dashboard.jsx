import React, { useState, useEffect } from 'react';
import { 
  LogOut, LayoutDashboard, CheckCircle2, Clock, RefreshCw, ChevronRight, 
  Activity, Layers, ExternalLink, X, UploadCloud, CalendarDays, 
  MessageSquareWarning, HelpCircle, Briefcase, Moon, Sun, Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Profile from './Profile';
import { sounds } from '../utils/sounds';
import logoImage from './logo/logo.jpeg';

const workQuotes = [
  "\"Focus on being productive instead of busy.\" - Tim Ferriss",
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"Amateurs sit and wait for inspiration, the rest of us just get up and go to work.\" - Stephen King",
  "\"Quality means doing it right when no one is looking.\" - Henry Ford",
  "\"It’s not about ideas. It’s about making ideas happen.\" - Scott Belsky",
  "\"Continuous improvement is better than delayed perfection.\" - Mark Twain",
  "\"Done is better than perfect.\" - Sheryl Sandberg"
];

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

const UpdateModal = ({ task, user, onClose, onSave, updatingTask }) => {
  let initialStatus = 'Not Yet Started';
  if (task.status) {
    const s = String(task.status).toLowerCase();
    if (s.includes('complet') || s.includes('done')) initialStatus = 'Completed ';
    else if (s.includes('pending') || s.includes('progress')) initialStatus = 'Pending';
  }

  const [status, setStatus] = useState(initialStatus);
  const [remarks, setRemarks] = useState(task.remarks || '');
  const [estdDays, setEstdDays] = useState(task.estdDays || '');
  const [taskDriveLink, setTaskDriveLink] = useState(task.driveLink && task.driveLink !== 'Click Here' ? task.driveLink : '');

  return (
    <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content animate-scale-in" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        
        <div className="modal-header" style={{ background: 'var(--bg-surface-hover)', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Update Task</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>ID: #{String(task.sno).padStart(3, '0')} - {task.taskDesc}</p>
          </div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="btn-icon hover-spin" disabled={updatingTask === task.sno} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)', transition: '0.2s' }}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Task Status</label>
              <select className="input premium-input" value={status} onChange={(e) => setStatus(e.target.value)} disabled={updatingTask === task.sno} style={{ width: '100%' }}>
                <option value="Not Yet Started">Not Yet Started</option>
                <option value="Pending">Pending</option>
                <option value="Completed ">Completed</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Est. Days Needed</label>
              <input type="number" min="0" step="0.5" className="input premium-input" placeholder="e.g. 2.5" value={estdDays} onChange={(e) => setEstdDays(e.target.value)} disabled={updatingTask === task.sno} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-hover)', borderRadius: '12px', border: '1px dashed var(--border-high)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} color="var(--accent-color)" /> Project Assets
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Upload your screenshots, code, or deliverables to your secure Drive folder, then paste the direct file link below.
            </p>
            
            {user.driveLink && user.driveLink.includes('http') ? (
              <a href={user.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginBottom: '1rem', padding: '0.6rem', textDecoration: 'none', fontWeight: 500, boxSizing: 'border-box' }}>
                Open My Dedicated Drive Folder <ExternalLink size={16} />
              </a>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                No Personal Drive folder assigned. Contact Admin.
              </div>
            )}

            <input type="text" className="input premium-input" placeholder="Paste specific file URL here (Optional)" value={taskDriveLink} onChange={(e) => setTaskDriveLink(e.target.value)} disabled={updatingTask === task.sno} style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Remarks / Notes</label>
            <textarea className="input premium-input" rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add specific context, dependencies, or blockers..." disabled={updatingTask === task.sno} style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

        </div>
        
        <div className="modal-footer" style={{ background: 'var(--bg-surface-hover)', padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn-outline" onClick={() => { sounds.playClick(); onClose(); }} disabled={updatingTask === task.sno} style={{ padding: '0.6rem 1.5rem' }}>Cancel</button>
          <button className="btn-premium" onClick={() => { sounds.playClick(); onSave(status, remarks, estdDays, taskDriveLink); }} disabled={updatingTask === task.sno} style={{ padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {updatingTask === task.sno ? <><div className="spinner" style={{ borderColor: 'var(--bg-surface)', borderRightColor: 'transparent', width: '16px', height: '16px' }}></div> Syncing...</> : 'Save & Sync'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout, apiUrl, theme, toggleTheme }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTask, setUpdatingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [quote, setQuote] = useState('');

  useEffect(() => { 
    setQuote(workQuotes[Math.floor(Math.random() * workQuotes.length)]);
    fetchTasks(); 
  }, [user.name, apiUrl]);

  const fetchTasks = async () => {
    if (!apiUrl) return;
    setLoading(true);
    
    try {
      const targetUrl = `${apiUrl}?action=getTasks&name=${encodeURIComponent(user.name)}`;
      const data = await fetchJsonp(targetUrl);
      if (data.success) setTasks(data.tasks);
      else setError(data.message || 'Failed to fetch tasks.');
    } catch (err) {
      setError('Connection refused. Fetch tasks failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModal = async (newStatus, newRemarks, estdDays, driveLink) => {
    if (!apiUrl || !modalTask) return;
    
    setUpdatingTask(modalTask.sno);
    try {
      const targetUrl = `${apiUrl}?action=updateTask&sno=${encodeURIComponent(modalTask.sno)}&status=${encodeURIComponent(newStatus)}&remarks=${encodeURIComponent(newRemarks)}&estdDays=${encodeURIComponent(estdDays)}&driveLink=${encodeURIComponent(driveLink)}`;
      const data = await fetchJsonp(targetUrl);
      
      if (data.success) {
        sounds.playSuccess();
        await fetchTasks();
        setModalTask(null);
      } else {
        sounds.playAlert();
        alert("System Error: " + data.message);
      }
    } catch (err) {
      sounds.playAlert();
      alert('Network error while committing changes.');
    } finally {
      setUpdatingTask(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase().trim();
    if (s.includes('complet') || s.includes('done')) {
      return <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Completed</span>;
    }
    if (s.includes('pending') || s.includes('progress')) {
      return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Pending</span>;
    }
    return <span className="status-badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>Not Yet Started</span>;
  };

  const chartData = [
    { name: 'Not Started', count: tasks.filter(t => !String(t.status).toLowerCase().includes('done') && !String(t.status).toLowerCase().includes('complet') && !String(t.status).toLowerCase().includes('pending') && !String(t.status).toLowerCase().includes('progress')).length },
    { name: 'Pending', count: tasks.filter(t => String(t.status).toLowerCase().includes('pending') || String(t.status).toLowerCase().includes('progress')).length },
    { name: 'Completed', count: tasks.filter(t => String(t.status).toLowerCase().includes('complet') || String(t.status).toLowerCase().includes('done')).length },
  ];

  const handleRaiseQuery = () => {
    const subject = encodeURIComponent(`Workspace Query: ${user.name} - ${user.product}`);
    const body = encodeURIComponent(`Hello Admin,\n\nI am raising a query regarding my tasks/workspace.\n\nEmployee: ${user.name}\nRole: ${user.role}\n\nDetails of my query:\n\n`);
    window.location.href = `mailto:dendo2462@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="premium-workspace animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* --- ANIMATIONS --- */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDownExpand {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        
        .animate-slide-up { 
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          opacity: 0; /* Starts hidden until animation plays */
        }
        
        .animate-scale-in { 
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
        }
        
        .animate-expand {
          animation: slideDownExpand 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top;
        }

        /* Stagger Delays for children */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        /* Hover animations */
        .hover-spin:hover { transform: rotate(90deg); }

        /* --- THEME STYLES --- */
        .premium-workspace {
          background-color: var(--bg-deep);
          color: var(--text-primary);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .glass-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .premium-input {
          background: var(--bg-surface) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-primary) !important;
          border-radius: 8px !important;
          padding: 0.75rem 1rem !important;
          transition: all 0.2s ease !important;
        }
        .premium-input:focus { 
          border-color: var(--accent-color) !important; 
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
          outline: none;
        }
        .btn-premium {
          background: linear-gradient(135deg, var(--accent-color), #1d4ed8);
          color: white;
          border-radius: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-premium:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .btn-premium:active {
          transform: translateY(1px);
        }
        .btn-outline {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-outline:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-high);
          color: var(--text-primary);
        }
        .status-badge {
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
        }
        .task-row-premium {
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }
        .task-row-premium:hover {
          background: var(--bg-surface-hover);
          padding-left: 2.25rem !important; /* Slide right effect */
        }
        .nav-link {
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .nav-link.active {
          background: var(--bg-surface);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }
        .nav-link.inactive {
          background: transparent;
          color: var(--text-muted);
        }
        .nav-link.inactive:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }
      `}} />

      {modalTask && <UpdateModal task={modalTask} user={user} onClose={() => setModalTask(null)} onSave={handleSaveModal} updatingTask={updatingTask} />}

      <header className="animate-slide-up" style={{ animationDuration: '0.4s', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src={logoImage} alt="Dendo Logo" style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>Dendo</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginTop: '3px' }}>Employee Maintenance Portal</span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-deep)', padding: '0.35rem', borderRadius: '10px' }}>
            <button onClick={() => setActiveView('overview')} className={`nav-link ${activeView === 'overview' ? 'active' : 'inactive'}`}>Dashboard</button>
            <button onClick={() => setActiveView('profile')} className={`nav-link ${activeView === 'profile' ? 'active' : 'inactive'}`}>Profile</button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          <button onClick={() => { sounds.playClick(); toggleTheme(); }} className="btn-outline hover-spin" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={() => { sounds.playClick(); handleRaiseQuery(); }} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <HelpCircle size={16} color="var(--accent-color)" /> Raise Query
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-color)', opacity: 0.9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}>
              {user.name.charAt(0)}
            </div>
          </div>

          <button onClick={() => { sounds.playClick(); onLogout(); }} className="btn-outline" style={{ border: 'none', background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '0.5rem', borderRadius: '8px' }} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {activeView === 'profile' ? <div className="app-container" style={{ marginTop: '3rem', maxWidth: '1000px', margin: '3rem auto' }}><Profile user={user} /></div> : (
        <main className="app-container" style={{ marginTop: '3rem', maxWidth: '1200px', margin: '3rem auto', padding: '0 2rem' }}>
          
          <div className="animate-slide-up stagger-1" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>My Workspace</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Track your progress, update deliverables, and manage assets.</p>
            </div>
            <button onClick={() => { sounds.playClick(); fetchTasks(); }} disabled={loading} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}>
              <RefreshCw size={16} className={loading ? "spinner" : ""} style={{ borderColor: loading ? 'var(--accent-color)' : '', borderRightColor: loading ? 'transparent' : '' }} /> 
              {loading ? 'Syncing...' : 'Sync Database'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-card animate-slide-up stagger-2" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Activity size={20} color="var(--accent-color)" /> 
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Velocity Metrics</h3>
                </div>
                <div style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                   <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulseDot 2s infinite' }}></span> Active Sync
                </div>
                
                <div style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="name" tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{stroke: 'var(--border-high)', strokeWidth: 1, strokeDasharray: '4 4' }} 
                        contentStyle={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }} 
                      />
                      <Area type="monotone" dataKey="count" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-color)' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* NEW QUOTE CARD */}
              <div className="glass-card animate-slide-up stagger-3" style={{ padding: '1.5rem', background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={14} /> Quote of the Session
                </h4>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
                  {quote}
                </p>
              </div>

              <div className="glass-card animate-slide-up stagger-4" style={{ padding: '1.5rem', background: 'var(--bg-surface-hover)' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem' }}>Quick Links</h4>
                <button onClick={handleRaiseQuery} className="btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', borderRadius: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}><HelpCircle size={18} color="var(--accent-color)"/> Support Desk</span>
                  <ExternalLink size={16} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            <div className="glass-card animate-slide-up stagger-3" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Briefcase size={22} color="var(--text-primary)" /> 
                <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Assigned Deliverables</h3>
              </div>

              {loading ? (
                <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ borderColor: 'var(--border-color)', borderRightColor: 'var(--accent-color)', width: '32px', height: '32px', borderWidth: '3px' }}></div>
                  <span style={{ fontWeight: 500 }}>Syncing secure database...</span>
                </div>
              ) : tasks.length === 0 ? (
                <div className="animate-scale-in" style={{ padding: '6rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--bg-surface-hover)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem',  border: '1px solid var(--border-color)' }}>
                    <CheckCircle2 size={48} color="var(--success-color)" style={{ opacity: 0.8 }} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Inbox Zero</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '300px' }}>You have no active deliverables assigned to you at the moment.</p>
                  <button onClick={() => { sounds.playClick(); fetchTasks(); }} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                    <RefreshCw size={18} /> Forced Sync
                  </button>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map((task, index) => (
                    <div key={task.sno} className="animate-slide-up" style={{ animationDelay: `${(index * 0.05) + 0.3}s` }}>
                      <div className="task-row-premium" style={{ padding: '1.25rem 2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setActiveTask(activeTask === task.sno ? null : task.sno)}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600, background: 'var(--bg-deep)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                              #{String(task.sno).padStart(3, '0')}
                            </span> 
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{task.taskDesc}</span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, paddingLeft: '3.5rem' }}>
                            {task.deadline && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: new Date(task.deadline) < new Date() && !String(task.status).toLowerCase().includes('done') && !String(task.status).toLowerCase().includes('complet') ? 'var(--danger-color)' : 'inherit' }}>
                                <CalendarDays size={14} /> Due: {new Date(task.deadline).toLocaleDateString() === 'Invalid Date' ? task.deadline : new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                              </div>
                            )}
                            {task.completedDate && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669' }}>
                                <CheckCircle2 size={14} /> Logged: {new Date(task.completedDate).toLocaleDateString() === 'Invalid Date' ? task.completedDate : new Date(task.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          {getStatusBadge(task.status)}
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: activeTask === task.sno ? 'var(--accent-color)' : 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                            <ChevronRight size={18} color={activeTask === task.sno ? '#ffffff' : 'var(--text-muted)'} style={{ transform: activeTask === task.sno ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                          </div>
                        </div>
                      </div>

                      {activeTask === task.sno && (
                        <div className="animate-expand" style={{ padding: '1.5rem 2rem 2rem 5.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.1)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            
                            <div>
                              <strong style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Remarks</strong>
                              <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)', background: 'var(--bg-deep)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {task.remarks || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No remarks documented.</span>}
                              </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div>
                                <strong style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Allocation</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, background: 'var(--bg-deep)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                                  <Clock size={16} color="var(--text-muted)"/>
                                  {task.estdDays ? `${task.estdDays} Days Est.` : 'Not assigned'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-high)' }}>
                            <button className="btn-premium" onClick={() => setModalTask(task)} style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              Manage Task Details <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
export default Dashboard;
