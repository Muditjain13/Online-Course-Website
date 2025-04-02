const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Route: GET /recommendations/:category
// Simulates course recommendations by category
router.get('/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const recommendedCourses = await Course.find({ category }).limit(3);
        res.json(recommendedCourses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching recommendations' });
    }
});

module.exports = router;
