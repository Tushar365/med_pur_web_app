import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Configure neon to use websockets for the serverless environment
neonConfig.fetchConnectionCache = true;

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a SQL executor
const sql = neon(connectionString);

// Create a database instance
export const db = drizzle(sql);
