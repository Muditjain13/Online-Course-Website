const User = require('./models/User');  // Assuming the user model is in the models folder
const Course = require('./models/Course');  // Assuming the course model is in the models folder

async function prepareDataForRecommendation() {
    // Fetch all users and their enrolled courses
    const users = await User.find().populate('enrolledCourses.courseId');

    const userCourseRatings = [];

    users.forEach(user => {
        user.enrolledCourses.forEach(course => {
            userCourseRatings.push({
                userId: user.email,  // Use email as unique user ID
                courseId: course.courseId._id,  // Course ID from the course reference
                rating: course.rating  // User's rating for the course
            });
        });
    });

    // Return user-course ratings in the format suitable for ML
    return userCourseRatings;
}
