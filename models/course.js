const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL or file path to image
    category: { type: String, required: true }, // e.g., "Development", "AI"
    topic: { type: String }, // e.g., "Machine Learning", "Web Dev"
    difficulty: { type: String }, // Beginner, Intermediate, Advanced
    certification: { type: Boolean, default: false }, // Does it give a certificate?
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
