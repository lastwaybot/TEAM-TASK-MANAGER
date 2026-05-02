import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api';
import TaskList from '../components/TaskList';
import { getColor } from '../components/Sidebar';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?projectId=${id}`)])
      .then(([p, t]) => { setProject(p.data); setTasks(Array.isArray(t.data) ? t.data : []); })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail.trim() });
      setMemberEmail('');
      const r = await api.get(`/projects/${id}`);
      setProject(r.data);
      toast.success('Member added!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setAddingMember(false); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee) return;
    setCreatingTask(true);
    try {
      const r = await api.post('/tasks', { title: taskTitle.trim(), description: taskDesc.trim(), projectId: id, assignedTo: taskAssignee, deadline: taskDeadline || null });
      setTasks(prev => [r.data, ...prev]);
      setTaskTitle(''); setTaskDesc(''); setTaskAssignee(''); setTaskDeadline('');
      setShowTaskForm(false);
      toast.success('Task created!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setCreatingTask(false); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success('Task updated');
    } catch (err) { toast.error('Failed to update'); }
  };

  if (loading) return <div className="page"><div className="loading-state"><div className="spinner"></div></div></div>;
  if (error || !project) return <div className="page"><div className="alert alert-error">{error || 'Not found'}</div><button className="btn btn-secondary" onClick={() => navigate('/projects')}>Back</button></div>;

  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="page" id="project-detail-page">
      <button className="btn-back" onClick={() => navigate('/projects')} id="btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Projects
      </button>

      <div className="project-hero">
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{project.name}</h1>
          <p className="page-subtitle">Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="project-hero-stats">
          <div className="hero-stat"><span className="hero-stat-num">{tasks.length}</span><span className="hero-stat-label">Tasks</span></div>
          <div className="hero-stat"><span className="hero-stat-num">{project.members?.length || 0}</span><span className="hero-stat-label">Members</span></div>
          <div className="hero-stat"><span className="hero-stat-num" style={{ color: pct >= 70 ? 'var(--success)' : 'var(--primary)' }}>{pct}%</span><span className="hero-stat-label">Done</span></div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks <span className="tab-count">{tasks.length}</span></button>
        <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>Members <span className="tab-count">{project.members?.length || 0}</span></button>
      </div>

      {activeTab === 'tasks' && (
        <div>
          {isAdmin && (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)} id="btn-toggle-task">{showTaskForm ? 'Cancel' : '+ New Task'}</button>
            </div>
          )}
          {showTaskForm && isAdmin && (
            <form onSubmit={handleCreateTask} className="create-form" id="create-task-form">
              <div className="create-form-title">Create Task</div>
              <div className="form-group"><label>Title *</label><input placeholder="Task name" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} disabled={creatingTask} id="task-title" /></div>
              <div className="form-group"><label>Description</label><textarea placeholder="Details..." value={taskDesc} onChange={e => setTaskDesc(e.target.value)} disabled={creatingTask} rows="2" /></div>
              <div className="form-row">
                <div className="form-group"><label>Assign To *</label><select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} disabled={creatingTask}><option value="">Select</option>{project.members?.map((m, i) => <option key={i} value={m}>{m}</option>)}</select></div>
                <div className="form-group"><label>Deadline</label><input type="date" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} disabled={creatingTask} /></div>
              </div>
              <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowTaskForm(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={creatingTask || !taskTitle.trim() || !taskAssignee}>{creatingTask ? 'Creating...' : 'Create Task'}</button></div>
            </form>
          )}
          <TaskList tasks={tasks} onStatusChange={handleStatusChange} isAdmin={isAdmin} currentUserEmail={user?.email} />
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          {isAdmin && (
            <form onSubmit={handleAddMember} className="create-form" id="add-member-form" style={{ marginBottom: '1rem' }}>
              <div className="create-form-title">Add Member</div>
              <div className="create-form-row">
                <div className="form-group"><input type="email" placeholder="member@company.com" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} disabled={addingMember} id="input-member-email" /></div>
                <button type="submit" className="btn btn-primary" disabled={addingMember || !memberEmail.trim()} style={{ alignSelf: 'flex-end' }}>{addingMember ? 'Adding...' : 'Add'}</button>
              </div>
            </form>
          )}
          <div className="members-grid">
            {project.members?.map((email, i) => (
              <div key={i} className="member-card">
                <div className="member-avatar" style={{ background: getColor(email) }}>{email[0].toUpperCase()}</div>
                <div><div className="member-email">{email}</div><div className="member-role" >Team Member</div></div>
              </div>
            ))}
            {(!project.members || project.members.length === 0) && <div className="empty-state"><h3>No members yet</h3><p className="text-muted">Add members to assign tasks</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
