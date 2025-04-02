const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for UserCourseInteraction
const userCourseInteractionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',  // Reference to the Course model
        required: true
    },
    interactionType: {  // e.g., 'viewed', 'purchased', 'enrolled'
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Check if the model already exists in mongoose.models, to prevent overwriting
const UserCourseInteraction = mongoose.models.UserCourseInteraction || mongoose.model('UserCourseInteraction', userCourseInteractionSchema);

module.exports = UserCourseInteraction;
