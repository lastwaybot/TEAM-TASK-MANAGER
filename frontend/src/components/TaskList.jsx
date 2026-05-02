import { getColor } from './Sidebar';

function TaskList({ tasks, onStatusChange, isAdmin, currentUserEmail }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <img src="/images/empty-tasks.png" alt="No tasks" />
        </div>
        <h3>No tasks yet</h3>
        <p className="text-muted">Tasks will appear here once created</p>
      </div>
    );
  }

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="task-list" id="task-list">
      {tasks.map((task) => {
        const canUpdate = isAdmin || task.assignedTo?.toLowerCase() === currentUserEmail?.toLowerCase();
        const overdue = isOverdue(task.deadline) && task.status !== 'done';

        return (
          <div key={task.id} className={`task-card ${overdue ? 'task-overdue' : ''} ${task.status === 'done' ? 'task-done' : ''}`} id={`task-${task.id}`}>
            <div className="task-avatar" style={{ background: getColor(task.assignedTo) }}>
              {task.assignedTo?.[0]?.toUpperCase() || '?'}
            </div>
            
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              <div className="task-subtitle">{task.assignedTo} {task.description && `• ${task.description.slice(0, 50)}...`}</div>
            </div>

            <div className="task-meta">
              <span className={`task-due ${overdue ? 'overdue' : ''}`}>
                {overdue ? 'Overdue' : `Due ${formatDate(task.deadline)}`}
              </span>
              <span className={`badge ${task.status === 'in-progress' ? 'badge-progress' : task.status === 'done' ? 'badge-done' : task.status === 'review' ? 'badge-purple' : 'badge-todo'}`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : task.status === 'review' ? 'Review' : 'To Do'}
              </span>
            </div>

            <div className="task-actions">
              {canUpdate && task.status !== 'done' && (
                <>
                  {task.status === 'todo' && (
                    <button className="btn btn-sm btn-primary" onClick={() => onStatusChange(task.id, 'in-progress')}>
                      Start
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <>
                      <button className="btn btn-sm btn-success" onClick={() => onStatusChange(task.id, 'done')}>
                        Complete
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => onStatusChange(task.id, 'todo')}>
                        Back
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;
