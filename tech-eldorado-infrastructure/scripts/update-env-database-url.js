/**
 * Update DATABASE_URL in .env file
 * 
 * ВАЖНО: Этот скрипт создаст правильный DATABASE_URL
 * Но .env файл может быть в globalIgnore, поэтому нужно обновить вручную
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PASSWORDS = ['20989aaecC', '20989aaecC-'];
const PROJECT_ID = 'kgregicsrvqrndublgmp';

function updateEnvFile(password) {
  const envPath = join(process.cwd(), '.env');
  
  try {
    let envContent = readFileSync(envPath, 'utf-8');
    
    // Обновить или добавить DATABASE_URL
    const newDatabaseUrl = `postgresql://postgres:${password}@db.${PROJECT_ID}.supabase.co:5432/postgres`;
    
    if (envContent.includes('DATABASE_URL=')) {
      // Заменить существующий DATABASE_URL
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${newDatabaseUrl}`
      );
    } else {
      // Добавить DATABASE_URL если его нет
      envContent += `\nDATABASE_URL=${newDatabaseUrl}\n`;
    }
    
    writeFileSync(envPath, envContent, 'utf-8');
    console.log(`✅ Updated .env file with password: ${password.substring(0, 3)}...`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update .env: ${error.message}`);
    return false;
  }
}

// Попробовать оба пароля
console.log('📝 Updating DATABASE_URL in .env file...\n');

for (const password of PASSWORDS) {
  if (updateEnvFile(password)) {
    console.log(`\n✅ DATABASE_URL updated with password: ${password}`);
    console.log(`   Connection String: postgresql://postgres:${password}@db.${PROJECT_ID}.supabase.co:5432/postgres\n`);
    console.log('🧪 Now test connection: npm run test:connection\n');
    break;
  }
}

