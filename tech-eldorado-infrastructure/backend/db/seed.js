/**
 * Seed initial data (departments, CEO department)
 * 
 * ВАЖНО: CEO уже зарегистрирован в auth.users!
 * Этот скрипт создаёт departments и связывает их с CEO
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

// Использовать Supabase REST API вместо прямого PostgreSQL
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CEO_EMAIL = 'dammit885123@gmail.com';

export async function seedDatabase() {
  console.log('🌱 Seeding database...\n');

  try {
    // Получить CEO user из auth.users
    console.log('🔍 Finding CEO user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Failed to list users: ${usersError.message}`);
    }

    const ceoUser = users?.users?.find(u => u.email === CEO_EMAIL);
    
    if (!ceoUser) {
      throw new Error(`CEO user not found: ${CEO_EMAIL}. Run: npm run register:ceo:auto`);
    }

    console.log(`✅ CEO user found: ${ceoUser.id}\n`);

    // Создать departments через Supabase REST API
    console.log('📝 Creating departments...');
    
    const departmentsData = [
      {
        name: 'TEAM_0_RESEARCH',
        display_name: 'TEAM 0 - Research Foundation',
        description: 'Research foundation team - breakthrough research and applied technology',
        head_user_id: ceoUser.id,
        status: 'active',
      },
      {
        name: 'EGER',
        display_name: 'EGER - Engineering Department',
        description: 'Engineering department - Team 1 (Quantum Consciousness), Team 2 (Energy & Partnership)',
        head_user_id: ceoUser.id,
        status: 'active',
      },
      {
        name: 'INNOVATION',
        display_name: 'Innovation Lab',
        description: 'Innovation Lab - Team 3 (Cross-Company Analyst, Innovation Synthesist, Technical Prototyper, Business Validator)',
        head_user_id: ceoUser.id,
        status: 'active',
      },
      {
        name: 'MARKETING',
        display_name: 'Marketing & Sales',
        description: 'Marketing & Sales - Team 4 (PoC Demo Creator, CEO Presentation Coach, Strategic Marketing Coordinator)',
        head_user_id: ceoUser.id,
        status: 'active',
      },
      {
        name: 'EXECUTIVE',
        display_name: 'Executive',
        description: 'CEO and executive leadership',
        head_user_id: ceoUser.id,
        status: 'active',
      },
    ];

    const createdDepartments = [];
    for (const dept of departmentsData) {
      try {
        // Использовать Supabase REST API (работает без прямого PostgreSQL)
        const { data, error } = await supabase
          .from('departments')
          .upsert(dept, { onConflict: 'name' })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        createdDepartments.push(data);
        console.log(`   ✅ ${dept.display_name}`);
      } catch (error) {
        console.error(`   ❌ Failed to create ${dept.name}:`, error.message);
      }
    }

    console.log(`\n✅ Created ${createdDepartments.length} departments\n`);

    // Вывести итоговую информацию
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 SEEDED DATA:');
    console.log(`   CEO User ID: ${ceoUser.id}`);
    console.log(`   CEO Email: ${ceoUser.email}`);
    console.log(`   Departments: ${createdDepartments.length}`);
    createdDepartments.forEach(dept => {
      console.log(`     - ${dept.displayName} (${dept.name})`);
    });
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('🎯 NEXT STEPS:');
    console.log('   1. Run RLS policies: Execute backend/db/sql/rls-policies.sql in Supabase SQL Editor');
    console.log('   2. Continue to ФАЗА 2.2: Backend Server\n');

    return {
      ceoUserId: ceoUser.id,
      departments: createdDepartments,
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Запустить seed если вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
