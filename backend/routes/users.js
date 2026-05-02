const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

/**
 * POST /users/register
 * Register user profile in Firestore after Firebase Auth signup.
 * Body: { name, role }
 */
router.post('/register', authenticate, async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Validate role — default to 'member' if invalid
    const validRoles = ['admin', 'member'];
    const userRole = validRoles.includes(role) ? role : 'member';

    // Check if user already exists
    const existingUser = await db.collection('users').doc(req.user.uid).get();
    if (existingUser.exists) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const userData = {
      name,
      email: req.user.email,
      role: userRole,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(req.user.uid).set(userData);
    console.log('User registered:', req.user.uid);  
    res.status(201).json({ id: req.user.uid, ...userData });
  } catch (error) {
    console.error('Register user error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /users/me
 * Get current authenticated user's profile from Firestore.
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    console.log('User profile retrieved:', req.user.uid);
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
