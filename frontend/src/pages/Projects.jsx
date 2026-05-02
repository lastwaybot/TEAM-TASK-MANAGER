import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api';
import { getColor } from '../components/Sidebar';

function Projects() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(Array.isArray(r.data) ? r.data : [])).catch(() => setError('Failed to load projects')).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await api.post('/projects', { name: name.trim() });
      setProjects(prev => [res.data, ...prev]);
      setName(''); setShowForm(false);
      toast.success('Project created!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setCreating(false); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="page" id="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-subtitle">Manage and organize your team's work</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="btn-toggle-create">
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="create-form" id="create-project-form">
          <div className="create-form-title">Create New Project</div>
          <div className="create-form-row">
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" placeholder="e.g. Website Redesign" value={name} onChange={e => setName(e.target.value)} disabled={creating} id="input-project-name" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating || !name.trim()} id="btn-create-project" style={{marginBottom:0,alignSelf:'flex-end'}}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration"><img src="/images/empty-projects.png" alt="No projects" /></div>
          <h3>No projects yet</h3>
          <p className="text-muted">Create your first project to get started</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, idx) => {
            const color = getColor(project.name);
            const members = project.members || [];
            return (
              <Link to={`/projects/${project.id}`} key={project.id} className="project-card" style={{ borderTopColor: color }} id={`project-${project.id}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--r)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.8rem', flexShrink: 0 }}>
                    {project.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3>{project.name}</h3>
                    <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Created {fmtDate(project.createdAt)}</span>
                  </div>
                </div>
                <div className="project-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    {members.length} members
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Projects;
