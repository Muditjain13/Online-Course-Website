const express = require('express');
const UserCourseInteraction = require('../models/usercourseinteraction');  // Assuming the model name is 'usercourseinteraction'
const Course = require('../models/course');  // Assuming you have a course model
const { cosineSimilarity } = require('ml-matrix'); // Or a custom cosine similarity function

const router = express.Router();

// Fetch interactions for a user (for collaborative filtering)
router.get('/recommendations', async (req, res) => {
    const userId = req.userId;  // Get userId from JWT token

    try {
        // Find all interactions for the user (purchased, viewed, etc.)
        const interactions = await UserCourseInteraction.find({ userId: userId }).populate('courseId');

        // Process this data to generate recommendations using collaborative filtering or content-based filtering
        const recommendedCourses = await getRecommendations(interactions);

        res.status(200).json(recommendedCourses);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Recommendation logic (Collaborative Filtering or Content-Based Filtering)
async function getRecommendations(interactions) {
    const userCourses = interactions.map(interaction => interaction.courseId._id.toString());  // Get course IDs the user has interacted with
    const courseIds = await Course.find().select('_id');  // Fetch all course IDs

    // Collaborative Filtering Logic (using user interactions)
    const collaborativeRecommendations = await getCollaborativeRecommendations(userCourses, courseIds);

    // Content-Based Filtering Logic (based on course descriptions or categories)
    const contentRecommendations = await getContentBasedRecommendations(userCourses);

    // Combine both recommendations (Hybrid Approach)
    return [...collaborativeRecommendations, ...contentRecommendations];
}

// Collaborative Filtering Logic (Based on Similar Users' Interactions)
async function getCollaborativeRecommendations(userCourses, allCourses) {
    const courseSimilarityMatrix = {};  // Placeholder for the similarity matrix

    // Calculate the similarity between courses based on user interactions
    for (let i = 0; i < allCourses.length; i++) {
        const courseId1 = allCourses[i]._id.toString();
        courseSimilarityMatrix[courseId1] = {};

        for (let j = 0; j < allCourses.length; j++) {
            const courseId2 = allCourses[j]._id.toString();

            if (courseId1 !== courseId2) {
                const similarity = await getCourseSimilarity(courseId1, courseId2, userCourses); // Calculate similarity between courses
                courseSimilarityMatrix[courseId1][courseId2] = similarity;
            }
        }
    }

    // Get recommended courses by finding the most similar courses
    let recommendations = [];
    userCourses.forEach(courseId => {
        Object.keys(courseSimilarityMatrix[courseId]).forEach(similarCourseId => {
            if (!userCourses.includes(similarCourseId)) {  // Recommend only courses that the user hasn't interacted with
                recommendations.push({ courseId: similarCourseId, similarity: courseSimilarityMatrix[courseId][similarCourseId] });
            }
        });
    });

    // Sort recommendations by similarity (descending)
    recommendations.sort((a, b) => b.similarity - a.similarity);

    // Return top 5 recommended courses (you can adjust the number as needed)
    return recommendations.slice(0, 5).map(item => item.courseId);
}

// Get similarity between two courses based on user interactions
async function getCourseSimilarity(courseId1, courseId2, userCourses) {
    const commonUsers = await UserCourseInteraction.find({
        courseId: { $in: [courseId1, courseId2] },
    }).distinct('userId');

    const course1Users = await UserCourseInteraction.find({ courseId: courseId1 }).distinct('userId');
    const course2Users = await UserCourseInteraction.find({ courseId: courseId2 }).distinct('userId');

    const vec1 = commonUsers.map(userId => course1Users.includes(userId) ? 1 : 0);
    const vec2 = commonUsers.map(userId => course2Users.includes(userId) ? 1 : 0);

    return cosineSimilarity(vec1, vec2);  // Use cosine similarity
}

// Content-Based Filtering Logic (Based on Course Descriptions)
async function getContentBasedRecommendations(userCourses) {
    const recommendations = [];

    for (let i = 0; i < userCourses.length; i++) {
        const course = await Course.findById(userCourses[i]);

        if (course) {
            const similarCourses = await Course.find({
                category: course.category, // Example: Recommend courses from the same category
                _id: { $ne: course._id }
            }).limit(5);  // Limit the number of recommendations

            similarCourses.forEach(similarCourse => {
                recommendations.push(similarCourse._id.toString());
            });
        }
    }

    return recommendations;
}

module.exports = router;
