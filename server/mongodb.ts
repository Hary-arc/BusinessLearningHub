
import { MongoClient, ServerApiVersion } from 'mongodb';

// Note: Use environment variables for sensitive data in production
const uri = "mongodb+srv://guptaharshit279:<h4oA1MEWPJxi7VEt>@cluster0.q2jyy1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient;
  private connected: boolean = false;

  private constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect() {
    if (!this.connected) {
      try {
        await this.client.connect();
        await this.client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
        this.connected = true;
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
      }
    }
    return this.client;
  }

  async getDb(dbName: string) {
    if (!this.connected) {
      await this.connect();
    }
    return this.client.db(dbName);
  }

  async close() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }
}

export const mongoDb = MongoDBConnection.getInstance();
