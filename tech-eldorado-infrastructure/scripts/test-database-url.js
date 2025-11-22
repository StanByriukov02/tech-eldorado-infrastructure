/**
 * Test DATABASE_URL with different passwords
 */

import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

const PASSWORDS = ['20989aaecC', '20989aaecC-'];
const PROJECT_ID = 'kgregicsrvqrndublgmp';

async function testConnection(password) {
  const connectionString = `postgresql://postgres:${password}@db.${PROJECT_ID}.supabase.co:5432/postgres`;
  
  console.log(`\n🔍 Testing password: ${password.substring(0, 3)}...`);
  
  try {
    // Test direct PostgreSQL connection
    const client = postgres(connectionString, { max: 1 });
    await client`SELECT 1`;
    await client.end();
    
    console.log(`✅ Password "${password}" works!`);
    return { success: true, password, connectionString };
  } catch (error) {
    console.log(`❌ Password "${password}" failed: ${error.message}`);
    return { success: false, password, error: error.message };
  }
}

async function main() {
  console.log('🧪 Testing DATABASE_URL passwords...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  for (const password of PASSWORDS) {
    const result = await testConnection(password);
    if (result.success) {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('✅ CORRECT PASSWORD FOUND!');
      console.log(`   Password: ${result.password}`);
      console.log(`   Connection String: ${result.connectionString}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('📝 Update your .env file:');
      console.log(`   DATABASE_URL=${result.connectionString}\n`);
      process.exit(0);
    }
  }
  
  console.log('\n❌ None of the passwords worked!');
  console.log('   Check the password in Supabase Dashboard → Database Settings\n');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

