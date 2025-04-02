const mongoose = require('mongoose');

// Check if the model already exists to prevent overwriting
const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    certification: { type: Boolean, required: true },
    price: { type: Number, required: true }  // Added price field
}));

module.exports = Course;
