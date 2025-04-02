const express = require('express');
const router = express.Router();
const { getUserItemMatrix, calculateCourseSimilarity, getCollaborativeRecommendations, getContentBasedRecommendations } = require('../routes/recommendationController');
const auth = require('../routes/authMiddleware');  // Add your auth middleware

// Get recommendations for a user
router.get('/recommendations', auth, async (req, res) => {
    const userId = req.userId; // Extract userId from JWT token (auth middleware will add it)

    try {
        // Get the user-item matrix (Collaborative Filtering)
        const userItemMatrix = await getUserItemMatrix();

        // Calculate similarity between courses based on user interactions
        const courseSimilarityMatrix = calculateCourseSimilarity(userItemMatrix);

        // Get Collaborative Recommendations
        const collaborativeRecommendations = await getCollaborativeRecommendations(userId, userItemMatrix, courseSimilarityMatrix);

        // Get Content-Based Recommendations (based on the last course the user interacted with or purchased)
        const userCourses = userItemMatrix[userId];
        const courseIds = Object.keys(userCourses);
        const lastCourseId = courseIds[courseIds.length - 1];  // Use the last interacted course (or pick a relevant course ID)

        const contentRecommendations = await getContentBasedRecommendations(lastCourseId);

        // Combine both collaborative and content-based recommendations (Hybrid)
        const allRecommendations = [...collaborativeRecommendations, ...contentRecommendations];

        // Remove duplicates by courseId (if necessary) and sort by similarity (optional)
        const uniqueRecommendations = [];
        const courseIdsSet = new Set();

        allRecommendations.forEach(item => {
            if (!courseIdsSet.has(item.courseId)) {
                courseIdsSet.add(item.courseId);
                uniqueRecommendations.push(item);
            }
        });

        // Sort by similarity if necessary
        uniqueRecommendations.sort((a, b) => b.similarity - a.similarity);  // Sort by similarity score (highest first)

        // Return top 5 recommendations
        res.status(200).json(uniqueRecommendations.slice(0, 5));  // Return top 5 recommendations
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
