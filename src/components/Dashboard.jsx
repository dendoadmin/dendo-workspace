import React, { useState, useEffect } from 'react';
import { 
  LogOut, LayoutDashboard, CheckCircle2, Clock, RefreshCw, ChevronRight, 
  Activity, Layers, ExternalLink, X, UploadCloud, CalendarDays, 
  MessageSquareWarning, HelpCircle, Briefcase
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Profile from './Profile';

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
  // THE COMPLETED FIX: Added a space at the end to match your Google Sheet
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
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
      <div className="modal-content animate-scale-in" style={{ background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        
        <div className="modal-header" style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Update Task</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>ID: #{String(task.sno).padStart(3, '0')} - {task.taskDesc}</p>
          </div>
          <button onClick={onClose} className="btn-icon" disabled={updatingTask === task.sno} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: '#64748b', transition: '0.2s' }}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label" style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Task Status</label>
              <select className="input premium-input" value={status} onChange={(e) => setStatus(e.target.value)} disabled={updatingTask === task.sno}>
                <option value="Not Yet Started">Not Yet Started</option>
                <option value="Pending">Pending</option>
                {/* SPACE ADDED BELOW TO MATCH GOOGLE SHEETS */}
                <option value="Completed ">Completed</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="label" style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Est. Days Needed</label>
              <input type="number" min="0" step="0.5" className="input premium-input" placeholder="e.g. 2.5" value={estdDays} onChange={(e) => setEstdDays(e.target.value)} disabled={updatingTask === task.sno} />
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} color="#2563eb" /> Project Assets
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Upload your screenshots, code, or deliverables to your secure Drive folder, then paste the direct file link below.
            </p>
            
            {user.driveLink && user.driveLink.includes('http') ? (
              <a href={user.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginBottom: '1rem', padding: '0.6rem', textDecoration: 'none', fontWeight: 500 }}>
                Open My Dedicated Drive Folder <ExternalLink size={16} />
              </a>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                No Personal Drive folder assigned. Contact Admin.
              </div>
            )}

            <input type="text" className="input premium-input" placeholder="Paste specific file URL here (Optional)" value={taskDriveLink} onChange={(e) => setTaskDriveLink(e.target.value)} disabled={updatingTask === task.sno} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="label" style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Remarks / Notes</label>
            <textarea className="input premium-input" rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add specific context, dependencies, or blockers..." disabled={updatingTask === task.sno} />
          </div>

        </div>
        
        <div className="modal-footer" style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn-outline" onClick={onClose} disabled={updatingTask === task.sno} style={{ padding: '0.6rem 1.5rem' }}>Cancel</button>
          <button className="btn-premium" onClick={() => onSave(status, remarks, estdDays, taskDriveLink)} disabled={updatingTask === task.sno} style={{ padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {updatingTask === task.sno ? <><div className="spinner" style={{ borderColor: '#fff', borderRightColor: 'transparent', width: '16px', height: '16px' }}></div> Syncing...</> : 'Save & Sync'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout, apiUrl }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTask, setUpdatingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  const [activeView, setActiveView] = useState('overview');

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

  useEffect(() => { fetchTasks(); }, [user.name, apiUrl]);

  const handleSaveModal = async (newStatus, newRemarks, estdDays, driveLink) => {
    if (!apiUrl || !modalTask) return;
    
    setUpdatingTask(modalTask.sno);
    try {
      const targetUrl = `${apiUrl}?action=updateTask&sno=${encodeURIComponent(modalTask.sno)}&status=${encodeURIComponent(newStatus)}&remarks=${encodeURIComponent(newRemarks)}&estdDays=${encodeURIComponent(estdDays)}&driveLink=${encodeURIComponent(driveLink)}`;
      const data = await fetchJsonp(targetUrl);
      
      if (data.success) {
        await fetchTasks();
        setModalTask(null);
      } else alert("System Error: " + data.message);
    } catch (err) {
      alert('Network error while committing changes.');
    } finally {
      setUpdatingTask(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase().trim();
    if (s.includes('complet') || s.includes('done')) {
      return <span className="status-badge" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>Completed</span>;
    }
    if (s.includes('pending') || s.includes('progress')) {
      return <span className="status-badge" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>Pending</span>;
    }
    return <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>Not Yet Started</span>;
  };

  const getChartColor = (statusName) => {
    if (statusName === 'Completed') return '#10b981'; 
    if (statusName === 'Pending') return '#f59e0b';   
    return '#94a3b8'; 
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
    <div className="premium-workspace animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .premium-workspace {
          background-color: #f8fafc;
          color: #0f172a;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .glass-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.3s ease;
        }
        .glass-card:hover {
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06);
        }
        .premium-input {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          border-radius: 8px !important;
          padding: 0.75rem 1rem !important;
          transition: all 0.2s ease !important;
        }
        .premium-input:focus { 
          border-color: #2563eb !important; 
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
          outline: none;
        }
        .btn-premium {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-premium:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.25);
        }
        .btn-outline {
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-outline:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
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
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .task-row-premium:hover {
          background: #f8fafc;
          transform: translateX(4px);
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
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .nav-link.inactive {
          background: transparent;
          color: #64748b;
        }
        .nav-link.inactive:hover {
          color: #0f172a;
          background: rgba(255,255,255,0.5);
        }
      `}} />

      {modalTask && <UpdateModal task={modalTask} user={user} onClose={() => setModalTask(null)} onSave={handleSaveModal} updatingTask={updatingTask} />}

      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', padding: '0.5rem', borderRadius: '10px' }}>
              <Layers size={20} color="#ffffff" /> 
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#0f172a' }}>Dendo</span>
          </div>

          <nav style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '10px' }}>
            <button onClick={() => setActiveView('overview')} className={`nav-link ${activeView === 'overview' ? 'active' : 'inactive'}`}>Dashboard</button>
            <button onClick={() => setActiveView('profile')} className={`nav-link ${activeView === 'profile' ? 'active' : 'inactive'}`}>Profile</button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          <button onClick={handleRaiseQuery} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <HelpCircle size={16} color="#2563eb" /> Raise Query
          </button>

          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.role}</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.name.charAt(0)}
            </div>
          </div>

          <button onClick={onLogout} className="btn-outline" style={{ border: 'none', background: '#fef2f2', color: '#dc2626', padding: '0.5rem', borderRadius: '8px' }} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {activeView === 'profile' ? <div className="app-container" style={{ marginTop: '3rem', maxWidth: '1000px', margin: '3rem auto' }}><Profile user={user} /></div> : (
        <main className="app-container animate-slide-up" style={{ marginTop: '3rem', maxWidth: '1200px', margin: '3rem auto', padding: '0 2rem' }}>
          
          <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>My Workspace</h1>
              <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Track your progress, update deliverables, and manage assets.</p>
            </div>
            <button onClick={fetchTasks} disabled={loading} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}>
              <RefreshCw size={16} className={loading ? "spinner" : ""} style={{ borderColor: loading ? '#2563eb' : '', borderRightColor: loading ? 'transparent' : '' }} /> 
              {loading ? 'Syncing...' : 'Sync Database'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <Activity size={20} color="#2563eb" /> 
                  <h3 style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Velocity Metrics</h3>
                </div>
                
                <div style={{ height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getChartColor(entry.name)} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem' }}>Quick Links</h4>
                <button onClick={handleRaiseQuery} className="btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', background: 'white' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><HelpCircle size={16} color="#64748b"/> Support Desk</span>
                  <ExternalLink size={14} color="#94a3b8" />
                </button>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Briefcase size={22} color="#0f172a" /> 
                <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Assigned Deliverables</h3>
              </div>

              {loading ? (
                <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#64748b' }}>
                  <div className="spinner" style={{ borderColor: '#e2e8f0', borderRightColor: '#2563eb', width: '32px', height: '32px', borderWidth: '3px' }}></div>
                  <span style={{ fontWeight: 500 }}>Syncing secure database...</span>
                </div>
              ) : tasks.length === 0 ? (
                <div style={{ padding: '5rem 2rem', textAlign: 'center', color: '#64748b' }}>
                  <CheckCircle2 size={48} color="#cbd5e1" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.25rem', color: '#334155', marginBottom: '0.5rem' }}>Inbox Zero</h3>
                  <p>You have no assigned deliverables at the moment.</p>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map(task => (
                    <div key={task.sno}>
                      <div className="task-row-premium" style={{ padding: '1.25rem 2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setActiveTask(activeTask === task.sno ? null : task.sno)}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600, background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                              #{String(task.sno).padStart(3, '0')}
                            </span> 
                            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem' }}>{task.taskDesc}</span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 500, paddingLeft: '3.5rem' }}>
                            {task.deadline && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: new Date(task.deadline) < new Date() && !String(task.status).toLowerCase().includes('done') && !String(task.status).toLowerCase().includes('complet') ? '#ef4444' : 'inherit' }}>
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
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: activeTask === task.sno ? '#e0e7ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                            <ChevronRight size={18} color={activeTask === task.sno ? '#2563eb' : '#94a3b8'} style={{ transform: activeTask === task.sno ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                          </div>
                        </div>
                      </div>

                      {activeTask === task.sno && (
                        <div style={{ padding: '1.5rem 2rem 2rem 5.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            
                            <div>
                              <strong style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Remarks</strong>
                              <p style={{ marginTop: '0.5rem', color: '#334155', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {task.remarks || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No remarks documented.</span>}
                              </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div>
                                <strong style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Allocation</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#0f172a', fontWeight: 600, background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                                  <Clock size={16} color="#64748b"/>
                                  {task.estdDays ? `${task.estdDays} Days Est.` : 'Not assigned'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
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