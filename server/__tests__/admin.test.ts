
import { MongoClient } from 'mongodb';
import { mongoDb } from '../mongodb';
import { z } from 'zod';
import { User, Course, Subscription } from '@shared/schema';

describe('Admin MongoDB Data Tests', () => {
  let client: MongoClient;
  
  beforeAll(async () => {
    client = await mongoDb.connect();
  });

  afterAll(async () => {
    await mongoDb.close();
  });

  describe('User Data Tests', () => {
    it('should validate all users against schema', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const users = await db.collection('users').find().toArray();

      const userSchema = z.object({
        id: z.number(),
        username: z.string(),
        fullName: z.string(),
        email: z.string().email(),
        userType: z.enum(['student', 'faculty', 'admin']),
        createdAt: z.date(),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional()
      });

      users.forEach(user => {
        try {
          userSchema.parse(user);
        } catch (error) {
          fail(`Invalid user data for user ${user.id}: ${error}`);
        }
      });
    });

    it('should have at least one admin user', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const adminCount = await db.collection('users')
        .countDocuments({ userType: 'admin' });
      
      expect(adminCount).toBeGreaterThan(0);
    });
  });

  describe('Course Data Tests', () => {
    it('should validate all courses against schema', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const courses = await db.collection('courses').find().toArray();

      const courseSchema = z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        imageUrl: z.string().url(),
        price: z.number(),
        facultyId: z.number(),
        category: z.string(),
        rating: z.number(),
        reviewCount: z.number(),
        createdAt: z.date(),
        published: z.boolean(),
        duration: z.number(),
        level: z.string(),
        featured: z.boolean()
      });

      courses.forEach(course => {
        try {
          courseSchema.parse(course);
        } catch (error) {
          fail(`Invalid course data for course ${course.id}: ${error}`);
        }
      });
    });
  });

  describe('Subscription Data Tests', () => {
    it('should validate all subscriptions against schema', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const subscriptions = await db.collection('subscriptions').find().toArray();

      const subscriptionSchema = z.object({
        id: z.number(),
        userId: z.number(),
        planType: z.string(),
        price: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        active: z.boolean()
      });

      subscriptions.forEach(subscription => {
        try {
          subscriptionSchema.parse(subscription);
        } catch (error) {
          fail(`Invalid subscription data for subscription ${subscription.id}: ${error}`);
        }
      });
    });

    it('should have valid user references in subscriptions', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const subscriptions = await db.collection('subscriptions').find().toArray();
      
      for (const subscription of subscriptions) {
        const user = await db.collection('users')
          .findOne({ id: subscription.userId });
        expect(user).toBeTruthy();
      }
    });
  });

  describe('Data Integrity Tests', () => {
    it('should have matching faculty IDs between users and courses', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const courses = await db.collection('courses').find().toArray();
      
      for (const course of courses) {
        const faculty = await db.collection('users')
          .findOne({ id: course.facultyId, userType: 'faculty' });
        expect(faculty).toBeTruthy();
      }
    });

    it('should have valid price ranges', async () => {
      const db = await mongoDb.getDb('learning_platform');
      const courses = await db.collection('courses').find().toArray();
      
      courses.forEach(course => {
        expect(course.price).toBeGreaterThanOrEqual(0);
        expect(course.price).toBeLessThan(1000000); // Max price 10,000 USD
      });
    });
  });
});
