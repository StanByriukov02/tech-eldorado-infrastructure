/**
 * Check if departments were created
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDepartments() {
  console.log('🔍 Checking departments...\n');
  
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  No departments found!');
    console.log('   Run: npm run seed\n');
    return;
  }
  
  console.log(`✅ Found ${data.length} departments:\n`);
  data.forEach(dept => {
    console.log(`   - ${dept.display_name} (${dept.name})`);
    console.log(`     Status: ${dept.status}`);
    console.log(`     Head User ID: ${dept.head_user_id || 'Not set'}`);
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════════════');
  if (data.length === 5) {
    console.log('✅ All 5 departments created successfully!');
  } else {
    console.log(`⚠️  Expected 5 departments, found ${data.length}`);
    console.log('   Run: npm run seed to create missing departments');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

checkDepartments().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

