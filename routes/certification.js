const express = require('express');
const router = express.Router();
const Course = require('../models/Course');  // Assuming you have a Course model

// Get courses that provide certification
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ certification: true });  // Find courses that offer certification
        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses with certification found' });
        }
        res.json(courses);  // Send courses with certification
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
