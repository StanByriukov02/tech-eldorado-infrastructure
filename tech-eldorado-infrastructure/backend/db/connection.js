import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Использовать DATABASE_URL напрямую (уже правильный формат из .env)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set in .env file');
}

// Создать postgres client с правильными настройками для Supabase
const client = postgres(connectionString, {
  ssl: 'require', // Supabase требует SSL
  max: 10, // Connection pool size
});

export const db = drizzle(client, { schema });

/**
 * Initialize database connection
 */
export async function initializeDatabase() {
  try {
    // Test connection
    await client`SELECT 1`;
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

