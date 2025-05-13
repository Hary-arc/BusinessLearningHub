import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { createOrder, verifyPayment } from "./razorpay";
import { mongoDb } from "./mongodb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  insertCourseSchema, 
  insertEnrollmentSchema, 
  insertReviewSchema, 
  insertSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
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
      
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
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

      // Verify course payment status before enrollment
      const course = await storage.getCourse(validatedData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check for active subscription or course payment
      const subscription = await storage.getActiveSubscriptionByUser(user.id);
      if (!subscription) {
        return res.status(402).json({ message: "Payment required. Please purchase the course or subscribe." });
      }
      
      const enrollment = await storage.createEnrollment(validatedData);
      res.status(201).json(enrollment);
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
      const enrollments = await storage.getEnrollmentsByUser(user.id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
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
      
      const subscription = await storage.createSubscription(validatedData);
      res.status(201).json(subscription);
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
      const subscription = await storage.getActiveSubscriptionByUser(user.id);
      res.json(subscription || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Reviews API
  app.post("/api/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = req.user as Express.User;
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
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

app.get("/api/courses/:id/reviews", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByCourse(courseId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
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
      
      const courses = await storage.getCoursesByFaculty(user.id);
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
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only admins can access this" });
      }
      
      const users = await storage.getAllUsers();
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
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only admins can access this" });
      }
      
      const db = await mongoDb.getDb("learning_platform");
      const students = await db.collection("users")
        .find({ userType: "student" })
        .project({ password: 0, _id: 0 })
        .toArray() || [];
      
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
