import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { mongoDb } from "./mongodb";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || "learning-platform-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const db = await mongoDb.getDb("learning_platform");
      const user = await db.collection("users").findOne({ username });

      if (!user) {
        return done(null, false, { message: "Username not found" });
      }

      if (!(await comparePasswords(password, user.password))) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user._id));

  passport.deserializeUser(async (id: string, done) => {
    try {
      const db = await mongoDb.getDb("learning_platform");
      const user = await db.collection("users").findOne({ _id: id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const db = await mongoDb.getDb("learning_platform");
      const { username, email, password, fullName, userType } = req.body;

      const existingUser = await db.collection("users").findOne({ 
        $or: [{ username }, { email }] 
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.username === username ? 
            "Username already exists" : 
            "Email already in use" 
        });
      }

      const hashedPassword = await hashPassword(password);
      const result = await db.collection("users").insertOne({
        username,
        email,
        password: hashedPassword,
        fullName,
        userType,
        createdAt: new Date()
      });

      const user = { ...req.body, _id: result.insertedId };
      delete user.password;

      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    // Remove password from the response
    const { password, ...userWithoutPassword } = (req.user as any);
    res.json(userWithoutPassword);
  });
}