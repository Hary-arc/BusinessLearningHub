const path = require("path");
const dotenv = require("dotenv");

// Load env vars from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

// Validate required configuration
const requiredEnvVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./utils/dbConnect");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Register all models
require("./models/User");
require("./models/Course");
require("./models/Lesson");
require("./models/Quiz");
require("./models/Assignment");
require("./models/Payment");
require("./models/Progress");
require("./models/Certificate");
require("./models/Discussion");
require("./models/Notification");
require("./models/Review");
require("./models/LearningPath");

// Import routes
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const lessonsRouter = require('./routes/lessons');
const quizzesRouter = require('./routes/quizzes');
const assignmentsRouter = require('./routes/assignments');
const paymentsRouter = require('./routes/payments');
const certificatesRouter = require('./routes/certificates');
const discussionsRouter = require('./routes/discussions');
const notificationsRouter = require('./routes/notifications');
const reviewsRouter = require('./routes/reviews');
const learningPathsRouter = require('./routes/learningPaths');

// Mount routes
app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/discussions', discussionsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/learning-paths', learningPathsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
