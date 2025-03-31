const express = require('express');
const router = express.Router();
const Course = require('../models/Course');  // Assuming you have a Course model

// Route to get all courses (to show on the courses page)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();  // Fetch all courses from the database
        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses found' });
        }
        res.json(courses);  // Send the courses as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /courses/filter/:category — filter courses by category
router.get('/filter/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const courses = await Course.find({ category });

        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses found in this category.' });
        }

        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
