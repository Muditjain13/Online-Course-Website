const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Assuming you have a User model

// Get the courses enrolled by a user
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('enrolledCourses');  // Assuming 'enrolledCourses' is an array of course IDs
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.enrolledCourses);  // Send the user's enrolled courses
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
