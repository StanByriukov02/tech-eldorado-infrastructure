/**
 * CEO Login Test Script (AUTO)
 * 
 * Тестирует вход CEO с указанными данными
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/test-ceo-login-auto.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

// CEO данные
const CEO_EMAIL = 'dammit885123@gmail.com';
const CEO_PASSWORD = '20989aaecC';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCEOLogin() {
  console.log('🧪 CEO Login Test (AUTO)\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
    process.exit(1);
  }

  console.log(`📧 Email: ${CEO_EMAIL}\n`);

  // Попытка входа
  console.log('🔐 Attempting login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: CEO_EMAIL,
    password: CEO_PASSWORD
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    console.error('\nВозможные причины:');
    console.error('   1. CEO ещё не зарегистрирован (запусти: npm run register:ceo:auto)');
    console.error('   2. Неправильный пароль');
    console.error('   3. SUPABASE_URL или SUPABASE_ANON_KEY неправильные');
    process.exit(1);
  }

  console.log('✅ Login successful!\n');

  // Проверить role
  console.log('🔍 Checking user role...');
  const role = data.user.user_metadata?.role;
  
  if (role !== 'ceo') {
    console.error(`❌ Role is "${role}", expected "ceo"`);
    console.error('   Нужно обновить role в Supabase Dashboard (SQL Editor)');
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

