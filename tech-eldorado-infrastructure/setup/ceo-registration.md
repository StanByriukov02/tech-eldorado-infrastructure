# CEO REGISTRATION - ФАЗА 1.2

**СТАТУС:** КРИТИЧНО - ТОЧКА ВХОДА В СИСТЕМУ!  
**ЦЕЛЬ:** Зарегистрировать CEO через Supabase Auth, установить role 'ceo'  
**СЛЕДУЕТ:** CORRECT_WORKFLOW.md, ФАЗА 1, ШАГ 1.2  
**ТРЕБУЕТ:** Supabase Setup (ФАЗА 1.1) ✅

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ШАГ 1: РЕГИСТРАЦИЯ CEO

### 1.1. Создать CEO пользователя

**ВАРИАНТ 1: Через Supabase Dashboard (ручной)**

```
1. Authentication → Users → Add User
2. Email: [CEO email]
3. Password: [secure password]
4. Auto Confirm: ENABLED (чтобы не ждать email confirmation)
5. Create User
```

**ВАРИАНТ 2: Через API (программный)**

```javascript
// scripts/register-ceo.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Используем service_role для admin операций!
);

async function registerCEO() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: process.env.CEO_EMAIL || 'ceo@tech-eldorado.com',
    password: process.env.CEO_PASSWORD || 'CHANGE_THIS_PASSWORD',
    email_confirm: true, // Auto confirm
    user_metadata: {
      role: 'ceo',
      name: 'CEO',
      department: 'EXECUTIVE'
    }
  });

  if (error) {
    console.error('❌ CEO registration failed:', error);
    return null;
  }

  console.log('✅ CEO registered successfully!');
  console.log('User ID:', data.user.id);
  console.log('Email:', data.user.email);
  
  return data.user;
}

registerCEO();
```

### 1.2. Установить role 'ceo' в metadata

**Если регистрация через Dashboard:**

```sql
-- SQL Editor в Supabase Dashboard
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'role', 'ceo',
  'name', 'CEO',
  'department', 'EXECUTIVE'
)
WHERE email = '[CEO email]';
```

**Если регистрация через API:**
- Role уже установлен в user_metadata при создании ✅

═══════════════════════════════════════════════════════════════════════════════

## 🔐 ШАГ 2: ВЕРИФИКАЦИЯ РЕГИСТРАЦИИ

### 2.1. Проверить CEO пользователя

```sql
-- SQL Editor
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name,
  created_at
FROM auth.users
WHERE email = '[CEO email]';

-- Должно вернуть:
-- role: 'ceo'
-- name: 'CEO'
```

### 2.2. Тест входа

```javascript
// scripts/test-ceo-login.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCEOLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.CEO_EMAIL,
    password: process.env.CEO_PASSWORD
  });

  if (error) {
    console.error('❌ Login failed:', error);
    return false;
  }

  console.log('✅ CEO login successful!');
  console.log('Session:', data.session);
  console.log('User role:', data.user.user_metadata.role);
  
  // Проверить что role = 'ceo'
  if (data.user.user_metadata.role !== 'ceo') {
    console.error('❌ Role is not "ceo"!');
    return false;
  }

  return true;
}

testCEOLogin();
```

═══════════════════════════════════════════════════════════════════════════════

## 📊 ШАГ 3: СОЗДАНИЕ CEO ЗАПИСИ В DATABASE

### 3.1. Создать departments таблицу (если ещё нет)

```sql
-- SQL Editor
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  description TEXT,
  head_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2. Создать CEO department (если нужно)

```sql
-- Получить CEO user_id
DO $$
DECLARE
  ceo_user_id UUID;
BEGIN
  -- Найти CEO user
  SELECT id INTO ceo_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'ceo'
  LIMIT 1;

  -- Создать EXECUTIVE department
  INSERT INTO departments (name, display_name, description, head_user_id)
  VALUES (
    'EXECUTIVE',
    'Executive',
    'CEO and executive leadership',
    ceo_user_id
  )
  ON CONFLICT (name) DO NOTHING;
END $$;
```

### 3.3. Проверить CEO department

```sql
SELECT 
  d.id,
  d.name,
  d.display_name,
  d.head_user_id,
  u.email as ceo_email
FROM departments d
LEFT JOIN auth.users u ON d.head_user_id = u.id
WHERE d.name = 'EXECUTIVE';
```

═══════════════════════════════════════════════════════════════════════════════

## 🔒 ШАГ 4: НАСТРОЙКА RLS POLICIES (Row-Level Security)

### 4.1. Включить RLS на departments

```sql
-- Включить RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Policy: CEO видит ВСЁ
CREATE POLICY "CEO can see all departments"
ON departments
FOR SELECT
TO authenticated
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
);

-- Policy: CEO может создавать/обновлять/удалять
CREATE POLICY "CEO can manage all departments"
ON departments
FOR ALL
TO authenticated
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
);
```

### 4.2. Тест RLS policies

```javascript
// scripts/test-rls.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testRLS() {
  // Войти как CEO
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.CEO_EMAIL,
    password: process.env.CEO_PASSWORD
  });

  if (authError) {
    console.error('❌ Auth failed:', authError);
    return;
  }

  // Попытаться прочитать departments
  const { data, error } = await supabase
    .from('departments')
    .select('*');

  if (error) {
    console.error('❌ RLS test failed:', error);
    return;
  }

  console.log('✅ RLS test successful!');
  console.log('Departments:', data);
}

testRLS();
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ВАЛИДАЦИЯ CEO REGISTRATION

### Чеклист:

- [ ] CEO пользователь создан (через Dashboard или API)
- [ ] Role 'ceo' установлен в user_metadata
- [ ] CEO может войти (test login successful)
- [ ] CEO department создан (если нужно)
- [ ] RLS policies настроены
- [ ] CEO может читать departments (RLS test successful)

### Финальный тест:

```javascript
// scripts/final-ceo-test.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function finalCEOTest() {
  console.log('🧪 Final CEO Test...\n');

  // 1. Login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.CEO_EMAIL,
    password: process.env.CEO_PASSWORD
  });

  if (authError) {
    console.error('❌ Step 1: Login failed');
    return false;
  }
  console.log('✅ Step 1: Login successful');

  // 2. Check role
  if (authData.user.user_metadata.role !== 'ceo') {
    console.error('❌ Step 2: Role is not "ceo"');
    return false;
  }
  console.log('✅ Step 2: Role is "ceo"');

  // 3. Test RLS (read departments)
  const { data: deptData, error: deptError } = await supabase
    .from('departments')
    .select('*');

  if (deptError) {
    console.error('❌ Step 3: RLS test failed');
    return false;
  }
  console.log('✅ Step 3: RLS test successful');
  console.log(`   Found ${deptData.length} departments`);

  console.log('\n🎉 All tests passed! CEO registration complete!');
  return true;
}

finalCEOTest();
```

═══════════════════════════════════════════════════════════════════════════════

## 🚀 СЛЕДУЮЩИЙ ШАГ

**После успешной регистрации CEO:**
→ Перейти к ФАЗА 1.3: Cloud Infrastructure Setup

**ИЛИ:**
→ Перейти к ФАЗА 2.1: Database Schema (если инфраструктура уже готова)

═══════════════════════════════════════════════════════════════════════════════

**МЕТАКОГНИТИВНАЯ ПРОВЕРКА:**
- ✅ Соответствует TECH_ELDORADO_INFRASTRUCTURE.md (Auth system)
- ✅ Следует CORRECT_WORKFLOW.md (ФАЗА 1.2)
- ✅ Ведёт к partnership letter (CEO = точка входа!)
- ✅ Применён Ruthless Deletion (только необходимое!)
- ✅ Parallel Thinking (можно делать параллельно с инфраструктурой!)

