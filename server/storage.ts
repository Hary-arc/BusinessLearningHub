import { users, courses, enrollments, subscriptions, reviews } from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  Course, 
  InsertCourse,
  Enrollment,
  InsertEnrollment,
  Subscription,
  InsertSubscription,
  Review,
  InsertReview
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { hashPassword } from './passwordHasher.js';


export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCoursesByFaculty(facultyId: number): Promise<Course[]>;

  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByUser(userId: number): Promise<(Enrollment & { course: Course })[]>;

  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getActiveSubscriptionByUser(userId: number): Promise<Subscription | undefined>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByCourse(courseId: number): Promise<(Review & { user: Omit<User, "password"> })[]>;

  // Session store
  sessionStore: session.SessionStore;
}

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private subscriptions: Map<number, Subscription>;
  private reviews: Map<number, Review>;

  sessionStore: session.SessionStore;
  currentUserId: number;
  currentCourseId: number;
  currentEnrollmentId: number;
  currentSubscriptionId: number;
  currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.subscriptions = new Map();
    this.reviews = new Map();

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });

    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentEnrollmentId = 1;
    this.currentSubscriptionId = 1;
    this.currentReviewId = 1;

    // Seed some initial data
    this.seedData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.published);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const now = new Date();
    const course: Course = { 
      ...insertCourse, 
      id, 
      createdAt: now,
      rating: 0,
      reviewCount: 0
    };
    this.courses.set(id, course);
    return course;
  }

  async getCoursesByFaculty(facultyId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.facultyId === facultyId
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id,
      enrolledAt: now,
      completed: false,
      progress: 0
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async getEnrollmentsByUser(userId: number): Promise<(Enrollment & { course: Course })[]> {
    const userEnrollments = Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );

    return userEnrollments.map(enrollment => {
      const course = this.courses.get(enrollment.courseId);
      if (!course) {
        throw new Error(`Course with id ${enrollment.courseId} not found`);
      }
      return { ...enrollment, course };
    });
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      active: true
    };

    // Deactivate any existing active subscriptions for this user
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === insertSubscription.userId && sub.active) {
        sub.active = false;
        this.subscriptions.set(sub.id, sub);
      }
    }

    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getActiveSubscriptionByUser(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.userId === userId && subscription.active
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const now = new Date();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: now
    };
    this.reviews.set(id, review);

    // Update course rating
    const course = this.courses.get(insertReview.courseId);
    if (course) {
      const courseReviews = Array.from(this.reviews.values()).filter(
        (r) => r.courseId === insertReview.courseId
      );

      const totalRating = courseReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = Math.round((totalRating / courseReviews.length) * 10) / 10;

      course.rating = avgRating;
      course.reviewCount = courseReviews.length;
      this.courses.set(course.id, course);
    }

    return review;
  }

  async getReviewsByCourse(courseId: number): Promise<(Review & { user: Omit<User, "password"> })[]> {
    const courseReviews = Array.from(this.reviews.values()).filter(
      (review) => review.courseId === courseId
    );

    return courseReviews.map(review => {
      const user = this.users.get(review.userId);
      if (!user) {
        throw new Error(`User with id ${review.userId} not found`);
      }

      const { password, ...userWithoutPassword } = user;
      return { ...review, user: userWithoutPassword };
    });
  }

  // Seed some initial data for demo purposes
  private seedData() {
    // Create faculty users
    const faculty1 = this.createUser({
      username: "robertsmith",
      password: "password123", // In real app this would be hashed
      fullName: "Robert Smith",
      email: "robert.smith@example.com",
      userType: "faculty"
    });

    const faculty2 = this.createUser({
      username: "sarahjohnson",
      password: "password123",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      userType: "faculty"
    });

    const faculty3 = this.createUser({
      username: "michaelchen",
      password: "password123",
      fullName: "Michael Chen",
      email: "michael.chen@example.com",
      userType: "faculty"
    });

    // Create courses
    const course1 = this.createCourse({
      title: "Marketing Strategies for Small Businesses",
      description: "Learn cost-effective marketing techniques tailored for local businesses to attract and retain customers.",
      imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      price: 7900, // in cents
      facultyId: 1,
      category: "Business",
      published: true
    });

    const course2 = this.createCourse({
      title: "Machine Learning Fundamentals",
      description: "Learn the core concepts of ML, including supervised and unsupervised learning, neural networks, and practical applications.",
      imageUrl: "https://images.unsplash.com/photo-1527430253228-e93688616381?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      price: 14900,
      facultyId: 2,
      category: "AI & ML",
      published: true
    });

    const course3 = this.createCourse({
      title: "Cybersecurity Essentials",
      description: "Master fundamental security concepts, threat detection, and protection strategies for modern digital systems.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      price: 12900,
      facultyId: 3,
      category: "Security",
      published: true
    });

    const course4 = this.createCourse({
      title: "Cloud Computing with AWS",
      description: "Comprehensive guide to cloud architecture, deployment, and management using Amazon Web Services.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      price: 13900,
      facultyId: 1,
      category: "Cloud",
      published: true
    });

    const course5 = this.createCourse({
      title: "Digital Marketing Mastery",
      description: "Learn effective digital marketing strategies, SEO, social media marketing, and analytics.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      price: 9900,
      facultyId: 2,
      category: "Marketing",
      published: true
    });

    const course6 = this.createCourse({
      title: "AI for Business Innovation",
      description: "Explore how AI can transform business operations, customer experience, and decision-making processes.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21efb252c118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      price: 15900,
      facultyId: 3,
      category: "AI & ML",
      published: true
    });
  }
}

// Add test user if it doesn't exist
async function ensureTestUser() {
  const testUser = await (new MemStorage()).getUserByUsername("testuser");
  if (!testUser) {
    await (new MemStorage()).createUser({
      username: "testuser",
      password: await hashPassword("Test123"), // Secure test password
      email: "test@example.com",
      fullName: "Test User",
      userType: "student"
    });
  }
}

// Call this when initializing storage
ensureTestUser().catch(console.error);

export const storage = new MemStorage();