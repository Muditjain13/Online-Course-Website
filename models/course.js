const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL or path to the image
    category: { type: String, required: true },
    difficulty: { type: String, required: true }
});

// Create the Course model based on the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
