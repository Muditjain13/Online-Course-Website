const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Assuming you have a User model

// Get user profile details by user ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);  // Get user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);  // Send user profile details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.json(updatedUser);  // Return updated user details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
