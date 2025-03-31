const express = require('express');
const router = express.Router();
const Course = require('../models/Course');  // Assuming you have a Course model

// Get courses by topic
router.get('/:topic', async (req, res) => {
    try {
        const courses = await Course.find({ topic: req.params.topic });  // Find courses by topic
        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses found for this topic' });
        }
        res.json(courses);  // Send courses based on topic
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
