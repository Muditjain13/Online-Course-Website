const UserCourseInteraction = require('../models/userCourseInteraction');
const Course = require('../models/course');
 // Correct import from ml-matrix
const natural = require('natural');
const TfIdf = natural.TfIdf;  // For content-based filtering

// Step 1: Get User-Item Matrix for Collaborative Filtering
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, v1, idx) => sum + v1 * vec2[idx], 0);
    const magnitudeVec1 = Math.sqrt(vec1.reduce((sum, v1) => sum + v1 * v1, 0));
    const magnitudeVec2 = Math.sqrt(vec2.reduce((sum, v2) => sum + v2 * v2, 0));

    if (magnitudeVec1 === 0 || magnitudeVec2 === 0) {
        return 0;  // Prevent division by zero
    }

    return dotProduct / (magnitudeVec1 * magnitudeVec2);
}

async function getUserItemMatrix() {
    try {
        const interactions = await UserCourseInteraction.find().populate('userId courseId');
        let userItemMatrix = {};

        interactions.forEach(interaction => {
            const userId = interaction.userId._id.toString();
            const courseId = interaction.courseId._id.toString();
            const interactionType = interaction.interactionType;

            if (!userItemMatrix[userId]) {
                userItemMatrix[userId] = {};
            }

            userItemMatrix[userId][courseId] = interactionType;  // Store interaction type (purchased, viewed)
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

    courseIds.forEach(courseId => {
        courseSimilarityMatrix[courseId] = {};
    });

    // Calculate cosine similarity between each pair of courses
    courseIds.forEach(courseId1 => {
        courseIds.forEach(courseId2 => {
            if (courseId1 !== courseId2) {
                let commonUsers = [];

                // Loop through each user and find common users who have interacted with both courses
                Object.keys(userItemMatrix).forEach(userId => {
                    if (userItemMatrix[userId][courseId1] && userItemMatrix[userId][courseId2]) {
                        commonUsers.push(userId);
                    }
                });

                if (commonUsers.length > 0) {
                    // Create vectors for the two courses based on common users
                    let vec1 = commonUsers.map(userId => userItemMatrix[userId][courseId1] ? 1 : 0);
                    let vec2 = commonUsers.map(userId => userItemMatrix[userId][courseId2] ? 1 : 0);

                    // Calculate cosine similarity between the two course vectors using ml-matrix's function
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

    for (let courseId in userCourses) {
        if (userCourses[courseId] === 1) {  // If the user interacted with the course (e.g., purchased)
            let similarCourses = courseSimilarityMatrix[courseId];
            for (let similarCourseId in similarCourses) {
                if (!userCourses[similarCourseId]) {  // Recommend only courses the user hasn't interacted with
                    // Fetch the course details from the database
                    const course = await Course.findById(similarCourseId);
                    recommendedCourses.push({
                        courseId: similarCourseId,
                        title: course.title,
                        description: course.description,
                        price: course.price,
                        similarity: similarCourses[similarCourseId]
                    });
                }
            }
        }
    }

    recommendedCourses.sort((a, b) => b.similarity - a.similarity);
    return recommendedCourses.slice(0, 5);  // Return top 5 recommendations
}

// Step 4: Get Content-Based Recommendations (Using Course Descriptions)
async function getContentBasedRecommendations(courseId) {
    const courses = await Course.find();
    let courseDescriptions = courses.map(course => course.description);

    const tfidf = new TfIdf();

    // Add each course's description to the TF-IDF vectorizer
    courseDescriptions.forEach(description => tfidf.addDocument(description));

    const selectedCourseIndex = courses.findIndex(course => course._id.toString() === courseId);
    const selectedCourseVector = tfidf.listTerms(selectedCourseIndex); // Get the TF-IDF vector for the selected course

    const similarities = [];

    // Calculate content-based similarity between the selected course and others
    for (let i = 0; i < tfidf.documents.length; i++) {
        if (i !== selectedCourseIndex) {  // Skip the selected course itself
            const similarity = cosineSimilarity(selectedCourseVector, tfidf.listTerms(i));  // Use cosine similarity
            similarities.push({
                courseId: courses[i]._id,
                title: courses[i].title,
                description: courses[i].description,
                price: courses[i].price,
                similarity
            });
        }
    }

    similarities.sort((a, b) => b.similarity - a.similarity);  // Sort by similarity
    return similarities.slice(0, 5);  // Return top 5 recommendations
}

// Step 5: Combine Collaborative and Content-Based Recommendations (Hybrid)
async function getHybridRecommendations(userId, courseId, userItemMatrix, courseSimilarityMatrix) {
    // Get recommendations from both Collaborative Filtering and Content-Based Filtering
    const collaborativeRecommendations = await getCollaborativeRecommendations(userId, userItemMatrix, courseSimilarityMatrix);
    const contentRecommendations = await getContentBasedRecommendations(courseId);

    // Combine the recommendations (Merge and remove duplicates)
    const allRecommendations = [...collaborativeRecommendations, ...contentRecommendations];

    // Return final list of recommendations (optional: you can apply additional filtering or sorting)
    return allRecommendations;
}

module.exports = {
    getUserItemMatrix,
    calculateCourseSimilarity,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations
};
