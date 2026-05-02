const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

/**
 * POST /projects
 * Create a new project (Admin only).
 * Body: { name }
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Verify user is admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create projects' });
    }

    const project = {
      name,
      createdBy: req.user.uid,
      members: [req.user.email],
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('projects').add(project);
    res.status(201).json({ id: docRef.id, ...project });
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /projects
 * Get all projects where logged-in user is a member.
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const snapshot = await db
      .collection('projects')
      .where('members', 'array-contains', req.user.email)
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /projects/:id
 * Get a single project by ID.
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const projectDoc = await db.collection('projects').doc(req.params.id).get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = { id: projectDoc.id, ...projectDoc.data() };

    // Verify user is a member
    if (!project.members.includes(req.user.email)) {
      return res.status(403).json({ error: 'Access denied: Not a project member' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /projects/:id/members
 * Add a member to a project (Admin only).
 * Body: { email }
 */
router.post('/:id/members', authenticate, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Member email is required' });
    }

    // Verify user is admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add members' });
    }

    const projectRef = db.collection('projects').doc(req.params.id);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify the user being added exists in the system
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: 'User with this email not found in the system' });
    }

    const members = projectDoc.data().members || [];
    if (members.includes(email)) {
      return res.status(400).json({ error: 'User is already a member of this project' });
    }

    await projectRef.update({
      members: [...members, email],
    });

    res.json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
