const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

/**
 * POST /tasks
 * Create a new task (Admin only).
 * Body: { title, description, projectId, assignedTo, deadline }
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, deadline } = req.body;

    // Required field validation
    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({
        error: 'Title, projectId, and assignedTo are required',
      });
    }

    // Verify user is admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create tasks' });
    }

    // Verify project exists
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify assignee is a member of the project
    const members = projectDoc.data().members || [];
    if (!members.includes(assignedTo)) {
      return res.status(400).json({
        error: 'Assigned user must be a member of the project',
      });
    }

    const task = {
      title,
      description: description || '',
      projectId,
      assignedTo,
      status: 'todo',
      deadline: deadline || null,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('tasks').add(task);
    res.status(201).json({ id: docRef.id, ...task });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /tasks
 * Get tasks. Admins see all tasks, members see only assigned tasks.
 * Query params: ?projectId=xxx (optional filter)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = db.collection('tasks');

    if (projectId) {
      query = query.where('projectId', '==', projectId);
    }

    const snapshot = await query.get();
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Role-based filtering: members only see their assigned tasks
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userRole = userDoc.exists ? userDoc.data().role : 'member';
    const userEmail = req.user.email;

    let filteredTasks = tasks;
    if (userRole !== 'admin') {
      filteredTasks = tasks.filter((task) => task.assignedTo?.toLowerCase() === userEmail?.toLowerCase());
    }

    res.json(filteredTasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /tasks/:id
 * Update task status.
 * Only the assigned user or an admin can update.
 * Body: { status } — valid values: 'todo', 'in-progress', 'done'
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'review', 'done'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required: todo, in-progress, review, or done',
      });
    }

    const taskRef = db.collection('tasks').doc(req.params.id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskDoc.data();

    // Authorization: only assigned user or admin can update
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userRole = userDoc.exists ? userDoc.data().role : 'member';

    if (userRole !== 'admin' && task.assignedTo !== req.user.email) {
      return res.status(403).json({
        error: 'Only the assigned user or an admin can update task status',
      });
    }

    await taskRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ id: req.params.id, ...task, status });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
