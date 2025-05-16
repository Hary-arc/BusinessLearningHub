
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/dbConnect");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const paymentsRouter = require('./routes/payments');

app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/payments', paymentsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
