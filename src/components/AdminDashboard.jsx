import React, { useState, useEffect, useMemo } from 'react';
import { 
  LogOut, LayoutDashboard, RefreshCw, Users, Search, 
  Activity, Layers, UserPlus, Briefcase, Mail, Phone, ExternalLink, CalendarDays, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis } from 'recharts';

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

const AdminDashboard = ({ user, onLogout, apiUrl }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, directory, assign
  const [tasks, setTasks] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');

  // Assign Task states
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchMasterData = async () => {
    if (!apiUrl) return;
    setLoading(true);
    setError('');
    
    try {
      // Fetch both tasks and directory simultaneously
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

  useEffect(() => { fetchMasterData(); }, [apiUrl]);

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
        alert("Task successfully pushed to master sheet!");
        setNewTaskDesc('');
        setNewTaskAssignee('');
        setNewTaskDeadline('');
        fetchMasterData(); // Refresh data
        setActiveTab('overview'); // Switch back to view it
      } else {
        alert("Error: " + response.message);
      }
    } catch (err) {
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
    if (s.includes('complet') || s.includes('done')) return <span className="status-badge" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>Completed</span>;
    if (s.includes('pending') || s.includes('progress')) return <span className="status-badge" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>Pending</span>;
    return <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>Not Yet Started</span>;
  };

  return (
    <div className="premium-workspace animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '100vh', background: '#f8fafc' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .premium-workspace { color: #0f172a; font-family: system-ui, -apple-system, sans-serif; }
        .glass-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03); }
        .premium-input { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; border-radius: 8px !important; padding: 0.75rem 1rem !important; transition: 0.2s !important; }
        .premium-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important; outline: none; }
        .btn-premium { background: linear-gradient(135deg, #0f172a, #334155); color: white; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
        .btn-premium:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(15, 23, 42, 0.2); }
        .btn-outline { background: white; border: 1px solid #cbd5e1; color: #475569; border-radius: 8px; cursor: pointer; font-weight: 500; transition: 0.2s; }
        .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }
        .nav-link { padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
        .nav-link.active { background: #0f172a; color: white; }
        .nav-link.inactive { background: transparent; color: #64748b; }
        .nav-link.inactive:hover { background: #f1f5f9; color: #0f172a; }
        .status-badge { padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .admin-table th { padding: 1rem 1.5rem; font-weight: 600; color: #64748b; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; text-align: left;}
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .admin-table tr:hover { background: #f8fafc; }
      `}} />

      {/* MASTER TOP NAVIGATION */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', padding: '0.5rem', borderRadius: '10px' }}>
              <ShieldAlert size={20} color="#ffffff" /> 
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#0f172a' }}>Master Admin</span>
          </div>

          <nav style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={() => setActiveTab('overview')} className={`nav-link ${activeTab === 'overview' ? 'active' : 'inactive'}`}>Global Telemetry</button>
            <button onClick={() => setActiveTab('directory')} className={`nav-link ${activeTab === 'directory' ? 'active' : 'inactive'}`}>Employee Directory</button>
            <button onClick={() => setActiveTab('assign')} className={`nav-link ${activeTab === 'assign' ? 'active' : 'inactive'}`}>Assign Tasks</button>
          </nav>
        </div>

        <button onClick={onLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <LogOut size={16} /> Secure Exit
        </button>
      </header>

      <main style={{ maxWidth: '1400px', margin: '3rem auto', padding: '0 2rem' }}>
        
        {error && (
          <div className="glass-card" style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
            <strong>System Error:</strong> {error}
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>Global Telemetry</h1>
                <p style={{ color: '#64748b' }}>Bird's eye view of all product development activity.</p>
              </div>
              <button onClick={fetchMasterData} className="btn-outline" style={{ padding: '0.6rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                <RefreshCw size={16} className={loading ? "spinner" : ""} /> Sync Database
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Workload</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>{tasks.length}</div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Tasks</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97706', marginTop: '0.5rem' }}>
                  {tasks.filter(t => String(t.status).toLowerCase().includes('pending') || String(t.status).toLowerCase().includes('progress')).length}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', marginTop: '0.5rem' }}>
                  {tasks.filter(t => String(t.status).toLowerCase().includes('complet') || String(t.status).toLowerCase().includes('done')).length}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Personnel</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.5rem' }}>{directory.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
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
                <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}><div className="spinner" style={{ borderColor: '#e2e8f0', borderRightColor: '#2563eb' }}></div></div>
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
                          <td style={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>#{String(task.sno).padStart(3, '0')}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{task.taskDesc}</div>
                            {task.remarks && <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>{task.remarks}</div>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '24px', height: '24px', background: '#e0e7ff', color: '#3730a3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                {String(task.assigned).charAt(0)}
                              </div>
                              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{task.assigned}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                              {task.deadline && <div><strong>Due:</strong> {new Date(task.deadline).toLocaleDateString() === 'Invalid Date' ? task.deadline : new Date(task.deadline).toLocaleDateString()}</div>}
                              {task.estdDays && <div><strong>Est:</strong> {task.estdDays} Days</div>}
                              {task.completedDate && <div style={{ color: '#059669' }}><strong>Logged:</strong> {new Date(task.completedDate).toLocaleDateString() === 'Invalid Date' ? task.completedDate : new Date(task.completedDate).toLocaleDateString()}</div>}
                            </div>
                          </td>
                          <td>{getStatusBadge(task.status)}</td>
                          <td>
                            {task.driveLink && task.driveLink.includes('http') ? (
                              <a href={task.driveLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
                                View <ExternalLink size={14}/>
                              </a>
                            ) : <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>None</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTasks.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No tasks found matching criteria.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Employee Directory</h1>
            
            {loading ? <div className="spinner"></div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {directory.map((emp, i) => (
                  <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold', color: '#475569' }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{emp.name}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase' }}>{emp.role}</span>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={14}/> <strong>Product:</strong> {emp.product}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={14}/> <strong>Spec:</strong> {emp.specialization}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14}/> {emp.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14}/> {emp.phone}</div>
                    </div>

                    {emp.driveLink && emp.driveLink.includes('http') && (
                      <a href={emp.driveLink} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'block', textAlign: 'center', padding: '0.5rem', marginTop: '0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                        Open Assigned Drive Folder
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
          <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <UserPlus size={28} color="#16a34a" />
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Dispatch Task</h1>
              <p style={{ color: '#64748b' }}>Push a new deliverable directly to the master roster.</p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Assign To</label>
                  <select className="premium-input" style={{ width: '100%' }} value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} required>
                    <option value="" disabled>Select Employee...</option>
                    {directory.map((emp, i) => (
                      <option key={i} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Task Description</label>
                  <textarea className="premium-input" style={{ width: '100%' }} rows="3" placeholder="What needs to be done?" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Target Deadline (Optional)</label>
                  <input type="date" className="premium-input" style={{ width: '100%' }} value={newTaskDeadline} onChange={(e) => setNewTaskDeadline(e.target.value)} />
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                  <button type="submit" className="btn-premium" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={assigning || loading}>
                    {assigning ? <><div className="spinner" style={{ borderColor: 'white', borderRightColor: 'transparent', width: '20px', height: '20px' }}></div> Pushing to Sheet...</> : 'Dispatch Assignment'}
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