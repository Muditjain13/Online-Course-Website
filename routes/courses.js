const express = require('express');
const router = express.Router();
const Course = require('../models/Course');  // Assuming you have a Course model
const auth = require('../routes/authMiddleware'); 
const User = require('../models/user');

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

// Get enrolled courses for a user
router.get('/mycourses', auth, async (req, res) => {
    const userId = req.userId;  // Extract userId from the JWT token

    try {
        // Find the user by userId and populate the enrolled courses with course details
        const user = await User.findById(userId).populate('enrolledCourses.courseId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Send the enrolled courses (courseId details)
        res.status(200).json(user.enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
