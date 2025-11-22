import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './backend/db/schema.js',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL, // Использовать DATABASE_URL напрямую
  },
};

