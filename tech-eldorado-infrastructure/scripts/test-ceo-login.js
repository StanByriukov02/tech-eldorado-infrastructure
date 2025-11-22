/**
 * CEO Login Test Script
 * 
 * Тестирует вход CEO через Supabase Auth
 * Проверяет что role = 'ceo'
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/test-ceo-login.js
 * 
 * ТРЕБУЕТ:
 * - .env файл с SUPABASE_URL, SUPABASE_ANON_KEY
 * - CEO_EMAIL, CEO_PASSWORD
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCEOLogin() {
  console.log('🧪 CEO Login Test\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const email = process.env.CEO_EMAIL;
  const password = process.env.CEO_PASSWORD;

  if (!email || !password) {
    console.error('❌ CEO_EMAIL and CEO_PASSWORD must be set in .env file');
    process.exit(1);
  }

  console.log(`📧 Email: ${email}\n`);

  // Попытка входа
  console.log('🔐 Attempting login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Login successful!\n');

  // Проверить role
  console.log('🔍 Checking user role...');
  const role = data.user.user_metadata?.role;
  
  if (role !== 'ceo') {
    console.error(`❌ Role is "${role}", expected "ceo"`);
    process.exit(1);
  }

  console.log('✅ Role is "ceo"\n');

  // Вывести информацию о сессии
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 SESSION DETAILS:');
  console.log(`   User ID: ${data.user.id}`);
  console.log(`   Email: ${data.user.email}`);
  console.log(`   Role: ${data.user.user_metadata.role}`);
  console.log(`   Access Token: ${data.session.access_token.substring(0, 20)}...`);
  console.log(`   Expires At: ${new Date(data.session.expires_at * 1000).toISOString()}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('🎉 All tests passed! CEO login working correctly!\n');

  // Тест RLS (если departments таблица существует)
  console.log('🔍 Testing RLS policies...');
  const { data: deptData, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .limit(1);

  if (deptError) {
    if (deptError.code === 'PGRST116') {
      console.log('⚠️  Departments table does not exist yet (will be created in ФАЗА 2.1)');
    } else {
      console.error('❌ RLS test failed:', deptError.message);
    }
  } else {
    console.log(`✅ RLS test successful! Can read ${deptData.length} departments`);
  }

  process.exit(0);
}

testCEOLogin().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

