const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
const auth = require('../routes/authMiddleware');  // Your authentication middleware

// Simulate course purchase
router.post('/buy/:courseId', auth, async (req, res) => {
    const { courseId } = req.params;
    const userId = req.userId;  // Access userId from the JWT token

    try {
        // Find the user by userId (now taken from req.userId)
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the course by courseId
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check if the user is already enrolled in the course
        const alreadyEnrolled = user.enrolledCourses.some(enrolled =>
            enrolled.courseId.toString() === courseId
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        // Simulate adding the course to the user's enrolled courses
        user.enrolledCourses.push({ courseId: course._id });
        await user.save();

        res.status(200).json({ message: 'Course purchased successfully' });
        
        
        
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
