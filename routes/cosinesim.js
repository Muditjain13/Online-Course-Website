const UserCourseInteraction = require('../models/userCourseInteraction');
const Course = require('../models/course');

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    const magnitudeVec1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitudeVec2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitudeVec1 * magnitudeVec2);
}

// Step 1: Get User-Item Matrix for Collaborative Filtering
async function getUserItemMatrix() {
    try {
        const interactions = await UserCourseInteraction.find().populate('userId courseId');
        let userItemMatrix = {};

        interactions.forEach(interaction => {
            const userId = interaction.userId._id.toString();
            const courseId = interaction.courseId._id.toString();
            const interactionType = interaction.interactionType; // e.g., purchased, viewed

            if (!userItemMatrix[userId]) {
                userItemMatrix[userId] = {};
            }

            // Storing interaction type, can be adjusted if we need more granular tracking
            userItemMatrix[userId][courseId] = interactionType;
        });

        return userItemMatrix;
    } catch (error) {
        console.error('Error fetching interactions:', error);
    }
}

// Step 2: Calculate Similarity Between Courses (Collaborative Filtering)
function calculateCourseSimilarity(userItemMatrix) {
    const courseIds = Object.keys(userItemMatrix[Object.keys(userItemMatrix)[0]]);
    let courseSimilarityMatrix = {};

    // Initialize similarity matrix
    courseIds.forEach(courseId => {
        courseSimilarityMatrix[courseId] = {};
    });

    // Calculate cosine similarity between each pair of courses
    courseIds.forEach(courseId1 => {
        courseIds.forEach(courseId2 => {
            if (courseId1 !== courseId2) {
                let commonUsers = [];
                Object.keys(userItemMatrix).forEach(userId => {
                    if (userItemMatrix[userId][courseId1] && userItemMatrix[userId][courseId2]) {
                        commonUsers.push(userId);
                    }
                });

                if (commonUsers.length > 0) {
                    // Create vectors for the two courses based on common users
                    let vec1 = commonUsers.map(userId => userItemMatrix[userId][courseId1] ? 1 : 0);
                    let vec2 = commonUsers.map(userId => userItemMatrix[userId][courseId2] ? 1 : 0);

                    // Calculate cosine similarity between the two course vectors
                    const similarity = cosineSimilarity(vec1, vec2);
                    courseSimilarityMatrix[courseId1][courseId2] = similarity;
                }
            }
        });
    });

    return courseSimilarityMatrix;
}

// Step 3: Get Collaborative Recommendations for a User
async function getCollaborativeRecommendations(userId, userItemMatrix, courseSimilarityMatrix) {
    const userCourses = userItemMatrix[userId];
    let recommendedCourses = [];

    // For each course the user has interacted with (purchased/viewed)
    for (let courseId in userCourses) {
        if (userCourses[courseId] === 1) {  // If the user has purchased the course
            // Find similar courses to this one
            let similarCourses = courseSimilarityMatrix[courseId];
            for (let similarCourseId in similarCourses) {
                if (!userCourses[similarCourseId]) {  // If the user hasn't interacted with this course
                    recommendedCourses.push({ courseId: similarCourseId, similarity: similarCourses[similarCourseId] });
                }
            }
        }
    }

    // Sort recommendations by similarity score
    recommendedCourses.sort((a, b) => b.similarity - a.similarity);  // Sort by similarity
    return recommendedCourses.slice(0, 5);  // Return top 5 recommendations
}

// Step 4: Get Content-Based Recommendations (Using Course Descriptions)
const TfidfVectorizer = require('tf-idf-vectorizer'); // For content-based filtering

async function getContentBasedRecommendations(courseId) {
    const courses = await Course.find();  // Fetch all courses
    let courseDescriptions = courses.map(course => course.description);

    const vectorizer = new TfidfVectorizer();
    const tfidf = vectorizer.fit(courseDescriptions);
    const courseMatrix = tfidf.transform(courseDescriptions);

    const selectedCourseIndex = courses.findIndex(course => course._id.toString() === courseId);
    const selectedCourseVector = courseMatrix.getRow(selectedCourseIndex);
    const similarities = [];

    // Calculate content-based similarity between the selected course and others
    for (let i = 0; i < courseMatrix.rows; i++) {
        const similarity = selectedCourseVector.dot(courseMatrix.getRow(i));  // Cosine similarity between courses
        similarities.push({ courseId: courses[i]._id, similarity });
    }

    similarities.sort((a, b) => b.similarity - a.similarity);  // Sort by similarity
    return similarities.slice(1, 6);  // Top 5 recommendations (skip the selected course itself)
}

// Step 5: Combine Collaborative and Content-Based Recommendations (Hybrid)
async function getHybridRecommendations(userId, courseId, userItemMatrix, courseSimilarityMatrix) {
    const collaborativeRecommendations = await getCollaborativeRecommendations(userId, userItemMatrix, courseSimilarityMatrix);
    const contentRecommendations = await getContentBasedRecommendations(courseId);

    // Combine both and remove duplicates
    const allRecommendations = [...new Set([...collaborativeRecommendations, ...contentRecommendations])];

    // Return final recommended courses
    return allRecommendations;
}

module.exports = {
    getUserItemMatrix,
    calculateCourseSimilarity,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations
};
