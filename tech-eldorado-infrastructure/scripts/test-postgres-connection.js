/**
 * Test direct PostgreSQL connection
 */

import postgres from 'postgres';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set in .env');
  process.exit(1);
}

console.log('🧪 Testing PostgreSQL connection...\n');
console.log(`📡 Connection String: ${connectionString.replace(/:[^:@]+@/, ':****@')}\n`);

async function test() {
  try {
    const client = postgres(connectionString, { max: 1 });
    
    // Test connection
    const result = await client`SELECT version()`;
    console.log('✅ PostgreSQL connection successful!');
    console.log(`   PostgreSQL version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}\n`);
    
    // Check if tables exist
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log(`📊 Found ${tables.length} tables in database:`);
    if (tables.length > 0) {
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('   (No tables yet - will create with migration)');
    }
    
    await client.end();
    console.log('\n✅ Ready for migration!\n');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('password authentication')) {
      console.error('\n💡 Password might be wrong. Try the other password: 20989aaecC-');
    }
    return false;
  }
}

test().then(success => {
  process.exit(success ? 0 : 1);
});

