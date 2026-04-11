import React, { useState, useEffect, useMemo } from 'react';
import { 
  LogOut, LayoutDashboard, RefreshCw, Users, Search, 
  Activity, Layers, UserPlus, Briefcase, Mail, Phone, ExternalLink, CalendarDays, CheckCircle2, ShieldAlert, Moon, Sun, Sparkles
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { sounds } from '../utils/sounds';
import logoImage from './logo/logo.jpeg';

const workQuotes = [
  "\"Great leaders don't set out to be a leader. They set out to make a difference.\"",
  "\"Management is doing things right; leadership is doing the right things.\" - Peter Drucker",
  "\"To handle yourself, use your head; to handle others, use your heart.\" - Eleanor Roosevelt",
  "\"A good manager is a man who isn't worried about his own career but rather the careers of those who work for him.\" - H. S. M. Burns",
  "\"The greatest asset of a company is its people.\" - Jorge Paulo Lemann",
  "\"Focus on being productive instead of busy.\" - Tim Ferriss"
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

const AdminDashboard = ({ user, onLogout, apiUrl, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, directory, assign
  const [tasks, setTasks] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState('');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');

  // Assign Task states
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => { 
    setQuote(workQuotes[Math.floor(Math.random() * workQuotes.length)]);
    fetchMasterData(); 
  }, [apiUrl]);

  const fetchMasterData = async () => {
    if (!apiUrl) return;
    setLoading(true);
    setError('');
    
    try {
      const taskRes = await fetchJsonp(`${apiUrl}?action=getAllTasks`);
      const dirRes = await fetchJsonp(`${apiUrl}?action=getDirectory`);
      
      if (taskRes.success) setTasks(taskRes.tasks);
      else setError(taskRes.message);

      if (dirRes.success) setDirectory(dirRes.directory);
      
    } catch (err) {
      setError(`Failed to load data from master servers.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTaskDesc || !newTaskAssignee) {
      alert("Task Description and Assignee are required.");
      return;
    }
    setAssigning(true);
    try {
      const url = `${apiUrl}?action=assignTask&desc=${encodeURIComponent(newTaskDesc)}&assigned=${encodeURIComponent(newTaskAssignee)}&deadline=${encodeURIComponent(newTaskDeadline)}`;
      const response = await fetchJsonp(url);
      
      if (response.success) {
        sounds.playSuccess();
        alert("Task successfully pushed to master sheet!");
        setNewTaskDesc('');
        setNewTaskAssignee('');
        setNewTaskDeadline('');
        fetchMasterData();
        setActiveTab('overview');
      } else {
        sounds.playAlert();
        alert("Error: " + response.message);
      }
    } catch (err) {
      sounds.playAlert();
      alert("Failed to assign task. Check network.");
    } finally {
      setAssigning(false);
    }
  };

  // Data processing
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.taskDesc.toLowerCase().includes(searchQuery.toLowerCase()) || task.sno.toString().includes(searchQuery);
      
      let matchesStatus = true;
      const tStat = String(task.status).toLowerCase();
      if (filterStatus === 'Not Started') matchesStatus = !tStat.includes('done') && !tStat.includes('complet') && !tStat.includes('progress') && !tStat.includes('pending');
      if (filterStatus === 'Pending') matchesStatus = tStat.includes('progress') || tStat.includes('pending') || tStat.includes('doing');
      if (filterStatus === 'Completed') matchesStatus = tStat.includes('done') || tStat.includes('complet');

      let matchesAssignee = true;
      if (filterAssignee !== 'All') {
        matchesAssignee = String(task.assigned).toLowerCase().includes(filterAssignee.toLowerCase());
      }

      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [tasks, searchQuery, filterStatus, filterAssignee]);

  const uniqueAssignees = [...new Set(tasks.map(t => t.assigned).filter(a => a && a !== 'Unassigned'))].sort();

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase().trim();
    if (s.includes('complet') || s.includes('done')) {
      return <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Completed</span>;
    }
    if (s.includes('pending') || s.includes('progress')) {
      return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Pending</span>;
    }
    return <span className="status-badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>Not Started</span>;
  };

  return (
    <div className="premium-workspace animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* --- ANIMATIONS --- */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        .hover-spin:hover { transform: rotate(90deg); }

        /* --- THEME STYLES --- */
        .premium-workspace { color: var(--text-primary); font-family: system-ui, -apple-system, sans-serif; }
        .glass-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; box-shadow: var(--shadow-sm); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .glass-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .premium-input { background: var(--bg-surface) !important; border: 1px solid var(--border-color) !important; color: var(--text-primary) !important; border-radius: 8px !important; padding: 0.75rem 1rem !important; transition: 0.2s !important; }
        .premium-input:focus { border-color: var(--accent-color) !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important; outline: none; }
        .btn-premium { background: linear-gradient(135deg, var(--accent-color), #1d4ed8); color: white; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-premium:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
        .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 8px; cursor: pointer; font-weight: 500; transition: 0.2s; }
        .btn-outline:hover { background: var(--bg-surface-hover); border-color: var(--border-high); color: var(--text-primary); }
        .nav-link { padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
        .nav-link.active { background: var(--bg-surface-hover); color: var(--text-primary); }
        .nav-link.inactive { background: transparent; color: var(--text-muted); }
        .nav-link.inactive:hover { background: var(--bg-surface-hover); color: var(--text-primary); }
        .status-badge { padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .admin-table th { padding: 1rem 1.5rem; font-weight: 600; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid var(--border-color); text-align: left;}
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); vertical-align: top; }
        .admin-table tr { transition: background 0.2s; }
        .admin-table tr:hover { background: var(--bg-surface-hover); }
      `}} />

      <header className="animate-slide-up" style={{ animationDuration: '0.4s', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src={logoImage} alt="Dendo Logo" style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>Dendo</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginTop: '3px' }}>Employee Maintenance Portal (Admin)</span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-deep)', padding: '0.35rem', borderRadius: '10px' }}>
            <button onClick={() => setActiveTab('overview')} className={`nav-link ${activeTab === 'overview' ? 'active' : 'inactive'}`}>Global Telemetry</button>
            <button onClick={() => setActiveTab('directory')} className={`nav-link ${activeTab === 'directory' ? 'active' : 'inactive'}`}>Employee Directory</button>
            <button onClick={() => setActiveTab('assign')} className={`nav-link ${activeTab === 'assign' ? 'active' : 'inactive'}`}>Assign Tasks</button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => { sounds.playClick(); toggleTheme(); }} className="btn-outline hover-spin" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-color)', opacity: 0.9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}>
            A
          </div>
          <button onClick={() => { sounds.playClick(); onLogout(); }} className="btn-outline" style={{ border: 'none', background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '0.5rem', borderRadius: '8px' }} title="Secure Exit">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '3rem auto', padding: '0 2rem' }}>
        
        {error && (
          <div className="glass-card animate-slide-up" style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
            <strong>System Error:</strong> {error}
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div>
            <div className="animate-slide-up stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Global Telemetry</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulseDot 2s infinite' }}></span>
                  Live view of all product development activity.
                </p>
              </div>
              <button onClick={() => { sounds.playClick(); fetchMasterData(); }} className="btn-outline" style={{ padding: '0.6rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={16} className={loading ? "spinner" : ""} style={{ borderColor: loading ? 'var(--accent-color)' : '', borderRightColor: loading ? 'transparent' : '' }} /> 
                {loading ? 'Syncing...' : 'Sync Database'}
              </button>
            </div>

            {/* Admin Quote Card */}
            <div className="glass-card animate-slide-up stagger-1" style={{ padding: '1.25rem 2rem', background: 'var(--bg-surface)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <Sparkles size={20} color="var(--accent-color)" />
               <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)', fontStyle: 'normal' }}>Admin Note: </strong> {quote}
               </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--text-muted)', opacity: 0.05, borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Workload</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tasks.length}</div>
              </div>
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--warning-color)', opacity: 0.1, borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Tasks</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning-color)' }}>
                  {tasks.filter(t => String(t.status).toLowerCase().includes('pending') || String(t.status).toLowerCase().includes('progress')).length}
                </div>
              </div>
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--success-color)', opacity: 0.1, borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success-color)' }}>
                  {tasks.filter(t => String(t.status).toLowerCase().includes('complet') || String(t.status).toLowerCase().includes('done')).length}
                </div>
              </div>
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.4s', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--accent-color)', opacity: 0.1, borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Personnel</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)' }}>{directory.length}</div>
              </div>
            </div>

            <div className="glass-card animate-slide-up stagger-3" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" className="premium-input" placeholder="Search tasks by description or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem !important' }} />
                </div>
                <select className="premium-input" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} style={{ minWidth: '200px' }}>
                  <option value="All">All Employees</option>
                  {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select className="premium-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
                  <option value="All">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="spinner" style={{ borderColor: 'var(--border-color)', borderRightColor: 'var(--accent-color)', borderWidth: '3px', width: '32px', height: '32px' }}></div>
                  <span style={{ fontWeight: 500 }}>Syncing master ledger...</span>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>Deliverable & Context</th>
                        <th>Assigned To</th>
                        <th>Timeline</th>
                        <th>Status</th>
                        <th>Assets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(task => (
                        <tr key={task.sno}>
                          <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600 }}>#{String(task.sno).padStart(3, '0')}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{task.taskDesc}</div>
                            {task.remarks && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-deep)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>{task.remarks}</div>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '28px', height: '28px', background: 'var(--bg-deep)', color: 'var(--accent-color)', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {String(task.assigned).charAt(0)}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{task.assigned}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {task.deadline && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CalendarDays size={12}/> <strong>Due:</strong> {new Date(task.deadline).toLocaleDateString() === 'Invalid Date' ? task.deadline : new Date(task.deadline).toLocaleDateString()}</div>}
                              {task.estdDays && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><strong>Est:</strong> {task.estdDays} Days</div>}
                              {task.completedDate && <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={12}/> <strong>Logged:</strong> {new Date(task.completedDate).toLocaleDateString() === 'Invalid Date' ? task.completedDate : new Date(task.completedDate).toLocaleDateString()}</div>}
                            </div>
                          </td>
                          <td>{getStatusBadge(task.status)}</td>
                          <td>
                            {task.driveLink && task.driveLink.includes('http') ? (
                              <a href={task.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-flex', padding: '0.4rem 0.75rem', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                                View <ExternalLink size={12}/>
                              </a>
                            ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>None</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTasks.length === 0 && <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500 }}>No deliverables found matching your criteria.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <div>
            <div className="animate-slide-up stagger-1" style={{ marginBottom: '2rem' }}>
               <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Employee Directory</h1>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Manage personnel access and roles.</p>
            </div>
            
            {loading ? <div className="spinner" style={{ borderColor: 'var(--border-color)', borderRightColor: 'var(--accent-color)' }}></div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {directory.map((emp, i) => (
                  <div key={i} className="glass-card animate-slide-up" style={{ animationDelay: `${(i * 0.05) + 0.2}s`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{emp.name}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{emp.role}</span>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Briefcase size={16} color="var(--text-muted)"/> <strong>Product:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.product}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Layers size={16} color="var(--text-muted)"/> <strong>Spec:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.specialization}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Mail size={16} color="var(--text-muted)"/> {emp.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Phone size={16} color="var(--text-muted)"/> {emp.phone}</div>
                    </div>

                    {emp.driveLink && emp.driveLink.includes('http') && (
                      <a href={emp.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', marginTop: '0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                        Open User Folder <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: ASSIGN TASK ================= */}
        {activeTab === 'assign' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="animate-slide-up stagger-1" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <UserPlus size={28} color="#10b981" />
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Dispatch Task</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Push a new deliverable directly to the master roster.</p>
            </div>

            <div className="glass-card animate-slide-up stagger-2" style={{ padding: '2.5rem' }}>
              <form onSubmit={(e) => { sounds.playClick(); handleAssignTask(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Assign To</label>
                  <select className="premium-input" style={{ width: '100%' }} value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} required>
                    <option value="" disabled>Select Employee...</option>
                    {directory.map((emp, i) => (
                      <option key={i} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Task Description</label>
                  <textarea className="premium-input" style={{ width: '100%', resize: 'vertical' }} rows="3" placeholder="What needs to be done?" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Deadline (Optional)</label>
                  <input type="date" className="premium-input" style={{ width: '100%' }} value={newTaskDeadline} onChange={(e) => setNewTaskDeadline(e.target.value)} />
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <button type="submit" className="btn-premium" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={assigning || loading} onMouseEnter={() => sounds.playHover()}>
                    {assigning ? <><div className="spinner" style={{ borderColor: 'var(--bg-surface)', borderRightColor: 'transparent', width: '20px', height: '20px' }}></div> Pushing to Sheet...</> : 'Dispatch Assignment'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
