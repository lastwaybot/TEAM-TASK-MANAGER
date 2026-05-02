import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api';
import { getColor } from '../components/Sidebar';

const COLS = [
  { key: 'todo', label: 'Backlog', color: '#94a3b8' },
  { key: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'review', label: 'Review', color: '#3b82f6' },
  { key: 'done', label: 'Done', color: '#10b981' },
];

export default function KanbanPage() {
  const { isAdmin, user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignee, setAssignee] = useState('');
  const [projectId, setProjectId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [creating, setCreating] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/projects')])
      .then(([t, p]) => { setTasks(t.data); setProjects(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
      toast.success('Task moved');
    } catch (e) { toast.error('Failed'); }
  };

  // --- Drag & Drop ---
  const onDragStart = (e, taskId) => {
    setDragId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image slightly transparent
    setTimeout(() => e.target.style.opacity = '0.4', 0);
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDragId(null);
    setDragOver(null);
  };

  const onDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(colKey);
  };

  const onDragLeave = () => {
    setDragOver(null);
  };

  const onDrop = (e, colKey) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragId) return;
    const task = tasks.find(t => t.id === dragId);
    if (!task || task.status === colKey) return;
    // Check permission
    if (!isAdmin && task.assignedTo !== user?.email) return;
    handleStatus(dragId, colKey);
    setDragId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !assignee || !projectId) return;
    setCreating(true);
    try {
      const r = await api.post('/tasks', { title: title.trim(), description: desc.trim(), projectId, assignedTo: assignee, deadline: deadline || null });
      setTasks(p => [r.data, ...p]);
      setTitle(''); setDesc(''); setAssignee(''); setDeadline('');
      setShowForm(false);
      toast.success('Task created!');
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
    finally { setCreating(false); }
  };

  const allMembers = [...new Set(projects.flatMap(p => p.members || []))];

  const getStatusTasks = (status) => {
    const display = isAdmin ? tasks : tasks.filter(t => t.assignedTo?.toLowerCase() === user?.email?.toLowerCase());
    return display.filter(t => t.status === status);
  };

  if (loading) return <div className="page"><div className="loading-state"><div className="spinner"></div></div></div>;

  return (
    <div className="page" id="kanban-page">
      <div className="page-header">
        <div><h1>TeamFlow Kanban</h1><p className="page-subtitle">Drag & drop tasks between columns to update status.</p></div>
        {isAdmin && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Create'}</button>}
      </div>

      {showForm && isAdmin && (
        <form className="create-form" onSubmit={handleCreate} id="kanban-create-form">
          <div className="create-form-title">New Task</div>
          <div className="form-row">
            <div className="form-group"><label>Title *</label><input placeholder="Task name" value={title} onChange={e=>setTitle(e.target.value)} disabled={creating}/></div>
            <div className="form-group"><label>Project *</label>
              <select value={projectId} onChange={e=>setProjectId(e.target.value)} disabled={creating}>
                <option value="">Select project</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Assign To *</label>
              <select value={assignee} onChange={e=>setAssignee(e.target.value)} disabled={creating}>
                <option value="">Select member</option>
                {allMembers.map((m,i)=><option key={i} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Deadline</label><input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} disabled={creating}/></div>
          </div>
          <div className="form-group"><label>Description</label><textarea placeholder="Details..." value={desc} onChange={e=>setDesc(e.target.value)} disabled={creating} rows="2"/></div>
          <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={creating||!title.trim()||!assignee||!projectId}>{creating?'Creating...':'Create Task'}</button></div>
        </form>
      )}

      <div className="kanban">
        {COLS.map(col => {
          const colTasks = getStatusTasks(col.key);
          const isOver = dragOver === col.key;
          return (
            <div
              className={`kanban-col ${isOver ? 'kanban-col-hover' : ''}`}
              key={col.key}
              onDragOver={(e) => onDragOver(e, col.key)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, col.key)}
            >
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span style={{width:8,height:8,borderRadius:'50%',background:col.color,display:'inline-block'}}></span>
                  {col.label}
                </div>
                <span className="kanban-count">{colTasks.length}</span>
              </div>
              <div className="kanban-cards">
                {colTasks.map(t => (
                  <div
                    className={`kanban-card ${dragId === t.id ? 'kanban-card-dragging' : ''}`}
                    key={t.id}
                    id={`kanban-${t.id}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, t.id)}
                    onDragEnd={onDragEnd}
                  >
                    <div className="kanban-card-title">{t.title}</div>
                    <div className="kanban-card-email">{t.assignedTo}</div>
                    <div className="kanban-card-badges">
                      <span className={`badge ${t.status === 'done' ? 'badge-done' : t.status === 'in-progress' ? 'badge-progress' : t.status === 'review' ? 'badge-purple' : 'badge-todo'}`}>
                        {t.status === 'in-progress' ? 'In Progress' : t.status === 'done' ? 'Done' : t.status === 'review' ? 'Review' : 'Backlog'}
                      </span>
                    </div>
                    <div className="kanban-card-actions">
                      {t.status === 'todo' && <button className="btn btn-sm btn-primary" onClick={() => handleStatus(t.id, 'in-progress')}>Start</button>}
                      {t.status === 'in-progress' && <button className="btn btn-sm btn-primary" onClick={() => handleStatus(t.id, 'review')}>Review</button>}
                      {t.status === 'review' && <button className="btn btn-sm btn-success" onClick={() => handleStatus(t.id, 'done')}>Done</button>}
                      {t.status === 'review' && <button className="btn btn-sm btn-secondary" onClick={() => handleStatus(t.id, 'in-progress')}>Back</button>}
                      {t.status === 'in-progress' && <button className="btn btn-sm btn-secondary" onClick={() => handleStatus(t.id, 'todo')}>Back</button>}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className={`kanban-drop-zone ${isOver ? 'kanban-drop-active' : ''}`}>
                    <p className="text-muted">
                      {isOver ? 'Drop here!' : 'No tasks'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
