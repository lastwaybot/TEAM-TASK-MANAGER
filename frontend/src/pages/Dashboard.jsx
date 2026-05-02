import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api';
import { getColor, getInitials } from '../components/Sidebar';

export default function Dashboard() {
  const { userProfile, isAdmin, user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/tasks').then(r => setTasks(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
      toast.success('Task updated');
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const prog = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length;
  const myTasks = tasks.filter(t => t.assignedTo?.toLowerCase() === user?.email?.toLowerCase());
  const displayTasks = isAdmin ? tasks : myTasks;
  const openTasks = displayTasks.filter(t => t.status !== 'done');

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline';
  const isOverdue = (d) => d && new Date(d) < new Date();

  const stats = [
    { label: 'Total', value: total, color: '#7c3aed', bg: 'rgba(124,58,237,.15)' },
    { label: 'Done', value: done, color: '#10b981', bg: 'rgba(16,185,129,.15)' },
    { label: 'In Progress', value: prog, color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
    { label: 'Overdue', value: overdue, color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
  ];

  return (
    <div className="page" id="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome to TeamFlow</h1>
          <p className="page-subtitle">{isAdmin ? 'Manage all team tasks' : 'View your assigned tasks'}</p>
        </div>
        {isAdmin && <a href="/kanban" className="btn btn-primary">+ New Task</a>}
      </div>

      <div className="stats-grid" id="dashboard-stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">My Tasks <span>{openTasks.length} open tasks</span></div>
        {loading ? (
          <div className="loading-state"><div className="spinner"></div></div>
        ) : openTasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}><h3>No open tasks</h3><p className="text-muted">All caught up!</p></div>
        ) : (
          <div className="task-list">
            {openTasks.slice(0, 8).map(t => {
              const od = isOverdue(t.deadline) && t.status !== 'done';
              return (
                <div key={t.id} className={`task-card ${od ? 'task-overdue' : ''}`} id={`task-${t.id}`}>
                  <div className="task-avatar" style={{ background: getColor(t.assignedTo) }}>{(t.assignedTo?.[0] || '?').toUpperCase()}</div>
                  <div className="task-info">
                    <div className="task-title">{t.title}</div>
                    <div className="task-subtitle">{t.assignedTo}</div>
                  </div>
                  <div className="task-meta">
                    <span className={`task-due ${od ? 'overdue' : ''}`}>{od ? 'Overdue' : `Due ${fmtDate(t.deadline)}`}</span>
                    <span className={`badge ${t.status === 'in-progress' ? 'badge-progress' : t.status === 'done' ? 'badge-done' : t.status === 'review' ? 'badge-purple' : 'badge-todo'}`}>
                      {t.status === 'in-progress' ? 'In Progress' : t.status === 'done' ? 'Done' : t.status === 'review' ? 'Review' : 'To Do'}
                    </span>
                  </div>
                  <div className="task-actions">
                    {t.status === 'todo' && <button className="btn btn-sm btn-primary" onClick={() => handleStatus(t.id, 'in-progress')}>Start</button>}
                    {t.status === 'in-progress' && <button className="btn btn-sm btn-primary" onClick={() => handleStatus(t.id, 'review')}>Review</button>}
                    {t.status === 'review' && <button className="btn btn-sm btn-success" onClick={() => handleStatus(t.id, 'done')}>Done</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="card">
          <div className="card-title">Progress <span>{total > 0 ? Math.round((done/total)*100) : 0}%</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${total > 0 ? (done/total)*100 : 0}%` }}></div></div>
        </div>
      )}
    </div>
  );
}
