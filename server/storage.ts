import { mongoDb } from './mongodb';
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

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCoursesByFaculty(facultyId: number): Promise<Course[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByUser(userId: number): Promise<(Enrollment & { course: Course })[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getActiveSubscriptionByUser(userId: number): Promise<Subscription | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByCourse(courseId: number): Promise<(Review & { user: Omit<User, "password"> })[]>;
  sessionStore: session.SessionStore;
}

export class MongoStorage implements IStorage {
  sessionStore: session.SessionStore;
  private db;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await mongoDb.getDb('learning_platform');
    // Create indexes
    const users = this.db.collection('users');
    await users.createIndex({ username: 1 }, { unique: true });
    await users.createIndex({ email: 1 }, { unique: true });
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await this.getNextId('users');
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    await this.db.collection('users').insertOne(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.collection('users').find().toArray();
  }

  async getAllCourses(): Promise<Course[]> {
    return await this.db.collection('courses')
      .find({ published: true })
      .toArray();
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const course = await this.db.collection('courses').findOne({ id });
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = await this.getNextId('courses');
    const now = new Date();
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: now,
      rating: 0,
      reviewCount: 0
    };
    await this.db.collection('courses').insertOne(course);
    return course;
  }

  async getCoursesByFaculty(facultyId: number): Promise<Course[]> {
    return await this.db.collection('courses')
      .find({ facultyId })
      .toArray();
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = await this.getNextId('enrollments');
    const now = new Date();
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id,
      enrolledAt: now,
      completed: false,
      progress: 0
    };
    await this.db.collection('enrollments').insertOne(enrollment);
    return enrollment;
  }

  async getEnrollmentsByUser(userId: number): Promise<(Enrollment & { course: Course })[]> {
    const enrollments = await this.db.collection('enrollments')
      .find({ userId })
      .toArray();

    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await this.getCourse(enrollment.courseId);
        if (!course) throw new Error(`Course ${enrollment.courseId} not found`);
        return { ...enrollment, course };
      })
    );

    return enrichedEnrollments;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = await this.getNextId('subscriptions');

    // Deactivate existing active subscriptions
    await this.db.collection('subscriptions').updateMany(
      { userId: insertSubscription.userId, active: true },
      { $set: { active: false } }
    );

    const subscription: Subscription = {
      ...insertSubscription,
      id,
      active: true
    };
    await this.db.collection('subscriptions').insertOne(subscription);
    return subscription;
  }

  async getActiveSubscriptionByUser(userId: number): Promise<Subscription | undefined> {
    const subscription = await this.db.collection('subscriptions').findOne({
      userId,
      active: true
    });
    return subscription || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = await this.getNextId('reviews');
    const now = new Date();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: now
    };
    await this.db.collection('reviews').insertOne(review);

    // Update course rating
    const courseReviews = await this.db.collection('reviews')
      .find({ courseId: insertReview.courseId })
      .toArray();

    const totalRating = courseReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / courseReviews.length) * 10) / 10;

    await this.db.collection('courses').updateOne(
      { id: insertReview.courseId },
      { 
        $set: { 
          rating: avgRating,
          reviewCount: courseReviews.length
        }
      }
    );

    return review;
  }

  async getReviewsByCourse(courseId: number): Promise<(Review & { user: Omit<User, "password"> })[]> {
    const reviews = await this.db.collection('reviews')
      .find({ courseId })
      .toArray();

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.getUser(review.userId);
        if (!user) throw new Error(`User ${review.userId} not found`);
        const { password, ...userWithoutPassword } = user;
        return { ...review, user: userWithoutPassword };
      })
    );

    return enrichedReviews;
  }

  private async getNextId(collectionName: string): Promise<number> {
    const counter = await this.db.collection('counters').findOneAndUpdate(
      { _id: collectionName },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    return counter.value.seq;
  }
}

export const storage = new MongoStorage();

// Add test user if it doesn't exist
async function ensureTestUser() {
  const testUser = await storage.getUserByUsername("testuser");
  if (!testUser) {
    await storage.createUser({
      username: "testuser",
      password: await hashPassword("Test123"),
      email: "test@example.com",
      fullName: "Test User",
      userType: "student"
    });
  }
}

// Initialize test user
ensureTestUser().catch(console.error);