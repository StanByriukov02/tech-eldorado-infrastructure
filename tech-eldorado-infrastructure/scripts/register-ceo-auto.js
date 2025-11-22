/**
 * CEO Registration Script (AUTO)
 * 
 * Автоматическая регистрация CEO с указанными данными
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/register-ceo-auto.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

// CEO данные
const CEO_EMAIL = 'dammit885123@gmail.com';
const CEO_PASSWORD = '20989aaecC';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Используем service_role для admin операций!
);

async function registerCEO() {
  console.log('🚀 CEO Registration Script (AUTO)\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Проверить что credentials есть
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    console.error('   Проверь что .env файл заполнен правильно!');
    process.exit(1);
  }

  console.log(`📧 Email: ${CEO_EMAIL}`);
  console.log(`🔐 Password: [hidden]\n`);

  // Проверить что пользователь не существует
  console.log('🔍 Checking if user already exists...');
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Failed to list users:', listError.message);
    process.exit(1);
  }

  const existingUser = existingUsers?.users?.find(u => u.email === CEO_EMAIL);

  if (existingUser) {
    console.log('⚠️  User already exists!');
    console.log('   Updating existing user...\n');
    
    // Обновить существующего пользователя
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        email: CEO_EMAIL,
        password: CEO_PASSWORD,
        user_metadata: {
          role: 'ceo',
          name: 'CEO',
          department: 'EXECUTIVE'
        }
      }
    );

    if (error) {
      console.error('❌ Update failed:', error.message);
      process.exit(1);
    }

    console.log('✅ CEO updated successfully!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 USER DETAILS:');
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Role: ${data.user.user_metadata.role}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    return data.user;
  }

  // Создать нового пользователя
  console.log('📝 Creating new CEO user...\n');
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: CEO_EMAIL,
    password: CEO_PASSWORD,
    email_confirm: true, // Auto confirm (не ждать email)
    user_metadata: {
      role: 'ceo',
      name: 'CEO',
      department: 'EXECUTIVE'
    }
  });

  if (error) {
    console.error('❌ Registration failed:', error.message);
    console.error('   Проверь что:');
    console.error('   1. SUPABASE_SERVICE_ROLE_KEY правильный в .env');
    console.error('   2. Supabase проект активен');
    console.error('   3. Password соответствует требованиям (минимум 6 символов)');
    process.exit(1);
  }

  console.log('✅ CEO registered successfully!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 USER DETAILS:');
  console.log(`   User ID: ${data.user.id}`);
  console.log(`   Email: ${data.user.email}`);
  console.log(`   Role: ${data.user.user_metadata.role}`);
  console.log(`   Created: ${data.user.created_at}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('🎯 NEXT STEPS:');
  console.log('   1. Test login: npm run test:ceo');
  console.log('   2. Create CEO department: Run SQL in Supabase Dashboard');
  console.log('   3. Setup RLS policies: Run SQL in Supabase Dashboard');
  console.log('   4. Continue to ФАЗА 2.1 or ФАЗА 1.3\n');

  return data.user;
}

// Запустить регистрацию
registerCEO().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

