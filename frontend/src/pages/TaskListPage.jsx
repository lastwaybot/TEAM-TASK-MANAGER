import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api';
import { getColor } from '../components/Sidebar';

const PER_PAGE = 8;

export default function TaskListPage() {
  const { isAdmin, user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { api.get('/tasks').then(r => setTasks(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
      toast.success('Task updated');
    } catch (e) { toast.error('Failed to update'); }
  };

  const display = tasks
    .filter(t => isAdmin || t.assignedTo === user?.email)
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.assignedTo?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(display.length / PER_PAGE);
  const paged = display.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
  const isOD = d => d && new Date(d) < new Date();

  return (
    <div className="page" id="tasks-page">
      <div className="page-header">
        <div><h1>Tasks</h1><p className="page-subtitle">{display.length} tasks</p></div>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search tasks, people..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading ? <div className="loading-state"><div className="spinner"></div></div> : paged.length === 0 ? (
        <div className="empty-state"><div className="empty-illustration"><img src="/images/empty-tasks.png" alt="No tasks"/></div><h3>No tasks found</h3><p className="text-muted">Try adjusting your filters</p></div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="task-table">
              <thead><tr><th>Assignee</th><th>Task</th><th>Due</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {paged.map(t => {
                  const od = isOD(t.deadline) && t.status !== 'done';
                  return (
                    <tr key={t.id} id={`task-row-${t.id}`}>
                      <td>
                        <div className="task-table-user">
                          <div className="task-table-avatar" style={{ background: getColor(t.assignedTo) }}>{(t.assignedTo?.[0]||'?').toUpperCase()}</div>
                          <div><div style={{fontWeight:600,fontSize:'.83rem'}}>{t.assignedTo?.split('@')[0]}</div><div style={{fontSize:'.7rem',color:'var(--text-muted)'}}>{t.assignedTo}</div></div>
                        </div>
                      </td>
                      <td><div style={{fontWeight:600}}>{t.title}</div>{t.description && <div style={{fontSize:'.75rem',color:'var(--text-muted)',marginTop:2}}>{t.description.slice(0,60)}</div>}</td>
                      <td><span className={od?'task-due overdue':'task-due'}>{fmtDate(t.deadline)}{od && ' ⚠'}</span></td>
                      <td><span className={`badge ${t.status==='done'?'badge-done':t.status==='in-progress'?'badge-progress':t.status==='review'?'badge-purple':'badge-todo'}`}>{t.status==='in-progress'?'In Progress':t.status==='done'?'Done':t.status==='review'?'Review':'To Do'}</span></td>
                      <td>
                        <div className="task-actions">
                          {t.status==='todo'&&(isAdmin||t.assignedTo===user?.email)&&<button className="btn btn-sm btn-primary" onClick={()=>handleStatus(t.id,'in-progress')}>Start</button>}
                          {t.status==='in-progress'&&(isAdmin||t.assignedTo===user?.email)&&<button className="btn btn-sm btn-success" onClick={()=>handleStatus(t.id,'done')}>Done</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>←</button>
              {Array.from({length: totalPages}, (_, i) => (
                <button key={i+1} className={`page-btn ${page===i+1?'active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
