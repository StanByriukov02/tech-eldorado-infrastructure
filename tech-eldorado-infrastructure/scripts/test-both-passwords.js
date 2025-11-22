/**
 * Test both passwords with different connection formats
 */

import postgres from 'postgres';
import { config } from 'dotenv';

config();

const PASSWORDS = ['20989aaecC', '20989aaecC-'];
const PROJECT_ID = 'kgregicsrvqrndublgmp';

// Different connection string formats
const formats = [
  // Direct connection
  (pwd) => `postgresql://postgres:${pwd}@db.${PROJECT_ID}.supabase.co:5432/postgres`,
  // Connection pooling (Session mode)
  (pwd) => `postgresql://postgres.${PROJECT_ID}:${pwd}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  // Alternative format
  (pwd) => `postgresql://postgres:${pwd}@${PROJECT_ID}.supabase.co:5432/postgres`,
];

async function testConnection(password, formatName, connectionString) {
  console.log(`\n🔍 Testing: ${formatName} with password ${password.substring(0, 3)}...`);
  
  try {
    const client = postgres(connectionString, { 
      max: 1,
      ssl: 'require',
      connect_timeout: 10,
    });
    
    const result = await client`SELECT 1 as test`;
    await client.end();
    
    console.log(`✅ SUCCESS! ${formatName} works with password: ${password}`);
    return { success: true, password, formatName, connectionString };
  } catch (error) {
    const errorMsg = error.message.substring(0, 100);
    console.log(`❌ Failed: ${errorMsg}...`);
    return { success: false, password, formatName, error: error.message };
  }
}

async function main() {
  console.log('🧪 Testing all password and connection format combinations...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  for (const password of PASSWORDS) {
    for (let i = 0; i < formats.length; i++) {
      const formatName = ['Direct', 'Pooler', 'Alternative'][i];
      const connectionString = formats[i](password);
      
      const result = await testConnection(password, formatName, connectionString);
      
      if (result.success) {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('✅ WORKING CONNECTION FOUND!');
        console.log(`   Password: ${result.password}`);
        console.log(`   Format: ${result.formatName}`);
        console.log(`   Connection String: ${result.connectionString}`);
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        // Update .env
        const fs = await import('fs');
        const path = await import('path');
        const envPath = path.join(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf-8');
        envContent = envContent.replace(
          /DATABASE_URL=.*/,
          `DATABASE_URL=${result.connectionString}`
        );
        fs.writeFileSync(envPath, envContent, 'utf-8');
        console.log('✅ Updated .env file!\n');
        
        process.exit(0);
      }
    }
  }
  
  console.log('\n❌ None of the combinations worked!');
  console.log('   Please check:');
  console.log('   1. Password in Supabase Dashboard → Database Settings');
  console.log('   2. Connection string format in "Connect to your project" modal');
  console.log('   3. Network connectivity\n');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

