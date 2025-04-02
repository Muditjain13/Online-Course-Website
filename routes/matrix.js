const UserCourseInteraction = require('../models/usercourseinteraction');
const Course = require('../models/course');

// Get user-course interaction data to build the matrix
async function getUserItemMatrix() {
    try {
        // Fetch all interactions from the database
        const interactions = await UserCourseInteraction.find().populate('userId courseId');

        // Create the user-item matrix (user_id as rows, course_id as columns)
        let userItemMatrix = {};

        interactions.forEach(interaction => {
            const userId = interaction.userId._id.toString();
            const courseId = interaction.courseId._id.toString();
            const interactionType = interaction.interactionType;  // purchased, viewed, enrolled

            if (!userItemMatrix[userId]) {
                userItemMatrix[userId] = {};
            }

            userItemMatrix[userId][courseId] = interactionType;  // Track interaction type
        });

        return userItemMatrix;
    } catch (error) {
        console.error('Error fetching interactions:', error);
    }
}
