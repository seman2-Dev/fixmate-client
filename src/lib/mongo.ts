import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set. Copy .env.example to .env and add your Atlas connection string.");
}

const globalForMongo = globalThis as unknown as { __fixmateMongo?: MongoClient };

// Reuse one client across hot reloads in development.
export const mongoClient = globalForMongo.__fixmateMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.__fixmateMongo = mongoClient;
}

/**
 * The database name comes from the URI path (must end in /fixmatedb).
 * The driver falls back to "test" when the path is empty.
 */
export const db = mongoClient.db();
