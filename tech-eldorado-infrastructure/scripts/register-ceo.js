/**
 * CEO Registration Script
 * 
 * Регистрирует CEO через Supabase Auth API
 * Устанавливает role 'ceo' в user_metadata
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node scripts/register-ceo.js
 * 
 * ТРЕБУЕТ:
 * - .env файл с SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - CEO_EMAIL, CEO_PASSWORD (опционально, можно ввести интерактивно)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import readline from 'readline';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Используем service_role для admin операций!
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function registerCEO() {
  console.log('🚀 CEO Registration Script\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Получить email
  let email = process.env.CEO_EMAIL;
  if (!email) {
    email = await question('Enter CEO email: ');
  }
  console.log(`📧 Email: ${email}\n`);

  // Получить password
  let password = process.env.CEO_PASSWORD;
  if (!password) {
    password = await question('Enter CEO password: ');
  }
  console.log('🔐 Password: [hidden]\n');

  // Проверить что пользователь не существует
  console.log('🔍 Checking if user already exists...');
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);

  if (existingUser) {
    console.log('⚠️  User already exists!');
    const update = await question('Update existing user? (y/n): ');
    
    if (update.toLowerCase() === 'y') {
      // Обновить существующего пользователя
      const { data, error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          email: email,
          password: password,
          user_metadata: {
            role: 'ceo',
            name: 'CEO',
            department: 'EXECUTIVE'
          }
        }
      );

      if (error) {
        console.error('❌ Update failed:', error.message);
        rl.close();
        process.exit(1);
      }

      console.log('✅ CEO updated successfully!');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Role: ${data.user.user_metadata.role}`);
      rl.close();
      return data.user;
    } else {
      console.log('❌ Registration cancelled');
      rl.close();
      process.exit(0);
    }
  }

  // Создать нового пользователя
  console.log('📝 Creating new CEO user...\n');
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto confirm (не ждать email)
    user_metadata: {
      role: 'ceo',
      name: 'CEO',
      department: 'EXECUTIVE'
    }
  });

  if (error) {
    console.error('❌ Registration failed:', error.message);
    rl.close();
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
  console.log('   1. Test login: node scripts/test-ceo-login.js');
  console.log('   2. Create CEO department: Run SQL in Supabase Dashboard');
  console.log('   3. Setup RLS policies: Run SQL in Supabase Dashboard');
  console.log('   4. Continue to ФАЗА 1.3 or ФАЗА 2.1\n');

  rl.close();
  return data.user;
}

// Запустить регистрацию
registerCEO().catch(error => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});

