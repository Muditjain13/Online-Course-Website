const mongoose = require('mongoose');
const Course = require('./models/Course'); // Path to your Course model

// Connect to MongoDB (replace with your MongoDB URI if necessary)
mongoose.connect('mongodb://localhost/courseDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Course data to be inserted
        const courses = [
            // Development Courses
            {
                title: 'Introduction to Web Development',
                description: 'Learn the basics of web development, including HTML, CSS, and JavaScript.',
                image: 'http://localhost:3000/cover_files/Introduction_to_Web_Development.png',
                category: 'Development',
                topic: 'Web Development',
                difficulty: 'Beginner',
                certification: true
            },
            {
                title: 'Advanced JavaScript for Developers',
                description: 'Enhance your JavaScript skills with advanced concepts and techniques.',
                image: 'http://localhost:3000/cover_files/Advanced_JavaScript_for_Developers.png',
                category: 'Development',
                topic: 'JavaScript',
                difficulty: 'Intermediate',
                certification: false
            },

            // AI Courses
            {
                title: 'Machine Learning Fundamentals',
                description: 'Understand the basics of machine learning and how to build models.',
                image: 'http://localhost:3000/cover_files/Machine_Learning_Fundamentals.png',
                category: 'AI',
                topic: 'Machine Learning',
                difficulty: 'Beginner',
                certification: true
            },
            {
                title: 'Deep Learning with Python',
                description: 'Explore deep learning techniques using Python and TensorFlow.',
                image: 'http://localhost:3000/cover_files/Deep_Learning_with_Python.png',
                category: 'AI',
                topic: 'Deep Learning',
                difficulty: 'Advanced',
                certification: true
            },

            // Data Science Courses
            {
                title: 'Data Science for Beginners',
                description: 'Learn the fundamentals of data science, including data cleaning and visualization.',
                image: 'http://localhost:3000/cover_files/Data_Science_for_Beginners.png',
                category: 'Data Science',
                topic: 'Data Science',
                difficulty: 'Beginner',
                certification: false
            },
            {
                title: 'Advanced Data Analysis with R',
                description: 'Advanced techniques in data analysis using the R programming language.',
                image: 'http://localhost:3000/cover_files/Advanced_Data_Analysis_with_R.png',
                category: 'Data Science',
                topic: 'Data Analysis',
                difficulty: 'Advanced',
                certification: true
            },

            // Cybersecurity Courses
            {
                title: 'Advanced Cybersecurity Techniques',
                description: 'Learn advanced cybersecurity methods for protecting networks and systems.',
                image: 'http://localhost:3000/cover_files/Advanced_Cybersecurity_Techniques.png',
                category: 'Cybersecurity',
                topic: 'Cybersecurity',
                difficulty: 'Advanced',
                certification: true
            },
            {
                title: 'Ethical Hacking and Penetration Testing',
                description: 'Master the skills of ethical hacking and penetration testing to secure systems.',
                image: 'http://localhost:3000/cover_files/Ethical_Hacking_and_Penetration_Testing.png',
                category: 'Cybersecurity',
                topic: 'Penetration Testing',
                difficulty: 'Intermediate',
                certification: false
            },

            // Web Development Courses
            {
                title: 'Responsive Web Design',
                description: 'Learn to design web pages that look great on all devices.',
                image: 'http://localhost:3000/cover_files/Responsive_Web_Design.png',
                category: 'Development',
                topic: 'Web Design',
                difficulty: 'Beginner',
                certification: false
            },
            {
                title: 'Building Web Applications with Node.js',
                description: 'Learn to build web applications using Node.js and Express.js.',
                image: 'http://localhost:3000/cover_files/Node_js.png',
                category: 'Development',
                topic: 'Web Development',
                difficulty: 'Intermediate',
                certification: true
            },

            // AI Courses
            {
                title: 'AI for Business Professionals',
                description: 'A course designed for business professionals looking to integrate AI into their work.',
                image: 'http://localhost:3000/cover_files/AI_for_Business_Professionals.png',
                category: 'AI',
                topic: 'Business AI',
                difficulty: 'Beginner',
                certification: true
            },
            {
                title: 'Natural Language Processing with Python',
                description: 'Learn how to process and analyze text data using Python and NLP techniques.',
                image: 'http://localhost:3000/cover_files/Natural_Language_Processing_with_Python.png',
                category: 'AI',
                topic: 'Natural Language Processing',
                difficulty: 'Intermediate',
                certification: true
            },

            // Data Science Courses
            {
                title: 'Introduction to Data Visualization',
                description: 'Learn how to visualize data effectively using tools like Matplotlib and Tableau.',
                image: 'http://localhost:3000/cover_files/Introduction_to_Data_Visualization.png',
                category: 'Data Science',
                topic: 'Data Visualization',
                difficulty: 'Beginner',
                certification: false
            },
            {
                title: 'Big Data Analytics with Hadoop',
                description: 'Learn to analyze large datasets using Hadoop and its ecosystem.',
                image: 'http://localhost:3000/cover_files/Big_Data_Analytics_with_Hadoop.png',
                category: 'Data Science',
                topic: 'Big Data',
                difficulty: 'Advanced',
                certification: true
            },

            // Cybersecurity Courses
            {
                title: 'Network Security Essentials',
                description: 'Learn the fundamental techniques for securing networks and preventing attacks.',
                image: 'http://localhost:3000/cover_files/Network_Security_Essentials.png',
                category: 'Cybersecurity',
                topic: 'Network Security',
                difficulty: 'Beginner',
                certification: true
            },
            {
                title: 'Cloud Security and Data Protection',
                description: 'Understand how to secure data in the cloud and protect it from cyber threats.',
                image: 'http://localhost:3000/cover_files/Cloud_Security_and_Data_Protection.png',
                category: 'Cybersecurity',
                topic: 'Cloud Security',
                difficulty: 'Intermediate',
                certification: false
            }
        ];

        // Insert the courses into the database
        Course.insertMany(courses)
            .then(() => {
                console.log('Courses have been added to the database.');
                mongoose.connection.close(); // Close the connection after inserting data
            })
            .catch((err) => {
                console.error('Error inserting courses:', err);
                mongoose.connection.close(); // Close the connection if error occurs
            });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
