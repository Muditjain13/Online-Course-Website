const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const courseRoutes = require('./routes/courses');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notifications');
const certificationRoutes = require('./routes/certification');
const topicRoutes = require('./routes/topic');
const myCoursesRoutes = require('./routes/mycourses');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/courseDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.use('/courses', courseRoutes);
app.use('/profile', profileRoutes);
app.use('/notifications', notificationRoutes);
app.use('/certification', certificationRoutes);
app.use('/topic', topicRoutes);
app.use('/my-courses', myCoursesRoutes);

// Serve static files and the homepage
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
