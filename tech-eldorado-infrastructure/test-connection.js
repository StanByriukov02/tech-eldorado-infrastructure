/**
 * Simple Supabase Connection Test
 * 
 * Проверяет что Supabase credentials правильные
 * и подключение работает
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * node test-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

// Проверить что переменные установлены
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  console.error('   См. setup/STEP_BY_STEP_SUPABASE.md для инструкций');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('🧪 Testing Supabase connection...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log(`📡 Supabase URL: ${process.env.SUPABASE_URL}\n`);

  // Простой тест - попытаться выполнить запрос
  // Ожидаем ошибку "table does not exist" - это нормально!
  const { data, error } = await supabase
    .from('_test')
    .select('*')
    .limit(1);
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Таблица не существует - это нормально! Подключение работает!
      console.log('✅ Connection successful!');
      console.log('   (Table does not exist yet - это нормально, создадим в ФАЗЕ 2.1)\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('🎉 Supabase is ready!');
      console.log('   Next step: Register CEO (npm run register:ceo)');
      console.log('═══════════════════════════════════════════════════════════════\n');
      return true;
    } else if (error.code === 'PGRST301' || error.message.includes('Invalid API key')) {
      console.error('❌ Invalid API key!');
      console.error('   Проверь SUPABASE_ANON_KEY в .env файле');
      return false;
    } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
      console.error('❌ Network error!');
      console.error('   Проверь SUPABASE_URL в .env файле');
      console.error('   URL должен быть: https://[project-id].supabase.co');
      return false;
    } else {
      console.error('❌ Connection failed:', error.message);
      console.error('   Error code:', error.code);
      return false;
    }
  }
  
  // Если нет ошибки - тоже хорошо!
  console.log('✅ Connection successful!');
  console.log('   Data:', data);
  return true;
}

testConnection().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

