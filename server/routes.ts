import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoDb } from "./mongodb";
import { setupAuth } from "./auth";
import { createOrder, verifyPayment } from "./razorpay";
import { 
  insertCourseSchema, 
  insertEnrollmentSchema, 
  insertReviewSchema, 
  insertSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  function requireAuth(req: any, res: any, next: any) {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }

  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const { ObjectId } = require('mongodb');
      const db = await mongoDb.getDb('learning_platform');
      const courses = await db.collection('courses').aggregate([
        { $match: { isPublished: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'instructorId',
            foreignField: '_id',
            as: 'instructor'
          }
        },
        { $unwind: '$instructor' },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            imageUrl: 1,
            price: 1,
            currency: 1,
            category: 1,
            instructorId: {
              _id: '$instructor._id',
              name: '$instructor.name',
              email: '$instructor.email'
            },
            rating: { $ifNull: ['$rating', 0] },
            reviewCount: { $ifNull: ['$reviewCount', 0] },
            level: 1,
            duration: 1,
            isPublished: 1
          }
        }
      ]).toArray();

      // Create admin user if not exists
      const adminUser = await db.collection("users").findOne({ email: "guptaharshit279@gmail.com" });
      if (!adminUser) {
        await db.collection("users").insertOne({
          name: "John Doe",
          email: "guptaharshit279@gmail.com",
          role: "admin",
          passwordHash: "password@123",
          enrolledCourses: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0
        });
      }

      if (!courses.length) {
        // If no courses found, initialize with seed data
        const seedCourses = [{
          _id: new ObjectId(),
          title: "Introduction to Web Development",
          description: "Learn the basics of web development",
          imageUrl: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4",
          price: 9900,
          instructorId: new ObjectId(),
          category: "Web Development",
          rating: 0,
          reviewCount: 0,
          isPublished: true
        }];

        await db.collection('courses').insertMany(seedCourses);
        res.json(seedCourses);
      } else {
        res.json(courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to load courses' });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const db = await mongoDb.getDb("learning_platform");
      const { ObjectId } = require('mongodb');
      
      let courseId;
      try {
        courseId = new ObjectId(req.params.id);
      } catch (error) {
        return res.status(400).json({ message: "Invalid course ID format" });
      }

      const course = await db.collection("courses").aggregate([
        { 
          $match: { 
            _id: courseId,
            isPublished: true 
          } 
        },
        {
          $lookup: {
            from: 'users',
            let: { instructorId: '$instructorId' },
            pipeline: [
              { 
                $match: {
                  $expr: { $eq: ['$_id', '$$instructorId'] }
                }
              }
            ],
            as: 'instructor'
          }
        },
        { 
          $unwind: { 
            path: '$instructor',
            preserveNullAndEmptyArrays: true
          } 
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            imageUrl: 1,
            price: 1,
            currency: 1,
            category: 1,
            tags: 1,
            level: 1,
            duration: 1,
            rating: { $ifNull: ['$rating', 0] },
            reviewCount: { $ifNull: ['$reviewCount', 0] },
            isPublished: 1,
            featured: 1,
            createdAt: 1,
            updatedAt: 1,
            enrollmentCount: { $ifNull: ['$enrollmentCount', 0] },
            instructorId: {
              _id: { $ifNull: ['$instructor._id', null] },
              name: { $ifNull: ['$instructor.name', 'Unknown Instructor'] },
              email: { $ifNull: ['$instructor.email', null] }
            }
          }
        }
      ]).next();

      if (!course) {
        return res.status(404).json({ message: "Course not found or not published" });
      }

      const lessons = await db.collection("lessons")
        .find({ 
          courseId: courseId,
          isActive: { $ne: false }
        })
        .sort({ order: 1 })
        .project({
          _id: 1,
          title: 1,
          description: 1,
          duration: 1,
          order: 1,
          videoUrl: 1
        })
        .toArray();

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return res.json({ ...course, lessons });
    } catch (error) {
      console.error('Course fetch error:', error);
      return res.status(500).json({ message: "Failed to fetch course", error: error.message });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      if (user.userType !== "faculty" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only faculty and admins can create courses" });
      }

      const validatedData = insertCourseSchema.parse({
        ...req.body,
        facultyId: user.id,
      });

      const db = await mongoDb.getDb("learning_platform");
      const result = await db.collection("courses").insertOne(validatedData);
      res.status(201).json({ ...validatedData, _id: result.insertedId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Enrollments API
  app.post("/api/enrollments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      const validatedData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const db = await mongoDb.getDb("learning_platform");
      const course = await db.collection("courses")
        .findOne({ id: validatedData.courseId });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const subscription = await db.collection("subscriptions")
        .findOne({ userId: user.id, active: true });

      if (!subscription) {
        return res.status(402).json({ message: "Payment required" });
      }

      const result = await db.collection("enrollments").insertOne({
        ...validatedData,
        enrolledAt: new Date(),
        completed: false,
        progress: 0
      });

      res.status(201).json({ ...validatedData, _id: result.insertedId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.get("/api/user/enrollments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      const db = await mongoDb.getDb("learning_platform");
      const enrollments = await db.collection("enrollments")
        .aggregate([
          { $match: { userId: user.id } },
          { $lookup: {
              from: "courses",
              localField: "courseId",
              foreignField: "id",
              as: "course"
            }
          },
          { $unwind: "$course" }
        ]).toArray();

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Reviews API
  app.get("/api/courses/:id/reviews", async (req, res) => {
    try {
      const { ObjectId } = require('mongodb');
      let courseId;
      try {
        courseId = new ObjectId(req.params.id);
      } catch (error) {
        return res.status(400).json({ message: "Invalid course ID format" });
      }
      const db = await mongoDb.getDb("learning_platform");
      console.log("Looking for reviews for course with ID:", courseId);
      const reviews = await db.collection("reviews")
        .aggregate([
          { $match: { courseId } },
          { $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "id",
              as: "user"
            }
          },
          { $unwind: "$user" },
          { $project: { "user.password": 0 } }
        ]).toArray();

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Payment routes
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { amount } = req.body;
      const order = await createOrder(amount);
      res.json({ 
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { orderId, paymentId, signature } = req.body;
      const isValid = await verifyPayment(orderId, paymentId, signature);
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  app.post("/api/payments/create-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { amount } = req.body;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  app.post("/api/payments/create-subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { priceId } = req.body;
      const user = req.user as Express.User;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Subscriptions API
  app.post("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      const validatedData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const db = await mongoDb.getDb("learning_platform");
      const result = await db.collection("subscriptions").insertOne(validatedData);
      res.status(201).json({ ...validatedData, _id: result.insertedId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.get("/api/user/subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      const db = await mongoDb.getDb("learning_platform");
      const subscription = await db.collection("subscriptions").findOne({ userId: user.id, active: true });
      res.json(subscription || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Faculty Routes
  app.get("/api/faculty/courses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      if (user.userType !== "faculty" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only faculty and admins can access this" });
      }

      const db = await mongoDb.getDb("learning_platform");
      const courses = await db.collection("courses").find({ facultyId: user.id }).toArray();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty courses" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      if (!user || (user.userType !== "admin" && user.userType !== "faculty.admin")) {
        return res.status(403).json({ message: "Only admins can access this" });
      }

      const db = await mongoDb.getDb("learning_platform");
      const users = await db.collection("users").find().toArray();
      // Remove passwords from the response
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/students", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as Express.User;
      if (!user || (user.userType !== "admin" && user.userType !== "faculty.admin")) {
        return res.status(403).json({ message: "Only admins can access this" });
      }

      const db = await mongoDb.getDb("learning_platform");
      const students = await db.collection("users")
        .find({ userType: "student" })
        .project({ password: 0 })
        .toArray();

      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}