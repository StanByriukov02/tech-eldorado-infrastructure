# SUPABASE SETUP - ФАЗА 1.1

**СТАТУС:** КРИТИЧНО - ПЕРВЫЙ ШАГ!  
**ЦЕЛЬ:** Создать Supabase проект, настроить Auth, подготовить к CEO регистрации  
**СЛЕДУЕТ:** CORRECT_WORKFLOW.md, ФАЗА 1, ШАГ 1.1  
**СООТВЕТСТВУЕТ:** TECH_ELDORADO_INFRASTRUCTURE.md, Layer 4 (Database & Storage)

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ШАГ 1: СОЗДАНИЕ SUPABASE ПРОЕКТА

### 1.1. Регистрация/Вход

```
1. Перейти: https://supabase.com
2. Sign Up / Sign In
3. Создать новый проект (если нет)
```

### 1.2. Создание проекта

```
Project Name: tech-eldorado
Database Password: [secure password - СОХРАНИТЬ!]
Region: us-east-1 (близко к другим сервисам)
Plan: Pro Plan ($25/month) - готов платить сразу!

ПОЧЕМУ PRO PLAN:
- 8 GB database storage
- 100 GB bandwidth
- 50 GB file storage
- Automatic backups (7 days)
- Point-in-time recovery
- No pausing (always on!)
- Dedicated resources
```

### 1.3. Сохранение credentials

```
После создания проекта:
1. Settings → API
2. Сохранить:
   - Project URL: https://[project-id].supabase.co
   - anon/public key: [anon_key]
   - service_role key: [service_role_key] (SECRET!)

3. Settings → Database
   - Сохранить: Database password (уже введён при создании)
   - Connection string: postgresql://postgres:[password]@[host]:5432/postgres
```

═══════════════════════════════════════════════════════════════════════════════

## 🔐 ШАГ 2: НАСТРОЙКА AUTH (GoTrue Engine)

### 2.1. Включить Auth

```
1. Authentication → Providers
2. Email provider: ENABLED
3. Confirm email: DISABLED (для быстрой регистрации CEO)
4. Secure email change: ENABLED
```

### 2.2. Настроить Email Templates (опционально)

```
1. Authentication → Email Templates
2. Customize templates (если нужно)
3. Или использовать default templates
```

### 2.3. Настроить URL Configuration

```
1. Authentication → URL Configuration
2. Site URL: https://tech-eldorado.com (или localhost для dev)
3. Redirect URLs: 
   - https://tech-eldorado.com/auth/callback
   - http://localhost:5173/auth/callback (для dev)
```

═══════════════════════════════════════════════════════════════════════════════

## 📊 ШАГ 3: ПОДГОТОВКА DATABASE

### 3.1. Проверить PostgreSQL версию

```
1. SQL Editor → New Query
2. Выполнить: SELECT version();
3. Должна быть: PostgreSQL 15+ ✅
```

### 3.2. Включить расширения (если нужно)

```sql
-- Для vector embeddings (если нужно позже)
CREATE EXTENSION IF NOT EXISTS vector;

-- Для UUID generation (уже включено по умолчанию)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3.3. Проверить auth.users таблицу

```sql
-- Таблица auth.users создаётся автоматически
-- Проверить что она существует:
SELECT * FROM auth.users LIMIT 1;
```

═══════════════════════════════════════════════════════════════════════════════

## 🔑 ШАГ 4: СОЗДАНИЕ ENVIRONMENT VARIABLES

### 4.1. Создать .env файл

```bash
# В корне проекта: tech-eldorado-infrastructure/.env

# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
SUPABASE_DB_PASSWORD=[database_password]

# Database Connection (для Drizzle ORM)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# OpenRouter (уже есть)
OPENROUTER_API_KEY=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
```

### 4.2. Добавить в .gitignore

```
# .env файл НЕ должен быть в git!
.env
.env.local
.env.production
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ВАЛИДАЦИЯ SETUP

### Чеклист:

- [ ] Supabase проект создан
- [ ] Pro Plan активирован ($25/month)
- [ ] Auth включен (Email provider)
- [ ] Credentials сохранены (.env файл)
- [ ] Database доступна (SQL Editor работает)
- [ ] auth.users таблица существует
- [ ] Environment variables настроены

### Тест подключения:

```javascript
// test-connection.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Тест подключения
async function testConnection() {
  const { data, error } = await supabase.from('_test').select('*').limit(1);
  
  if (error && error.code !== 'PGRST116') {
    console.error('❌ Connection failed:', error);
    return false;
  }
  
  console.log('✅ Supabase connection successful!');
  return true;
}

testConnection();
```

═══════════════════════════════════════════════════════════════════════════════

## 🚀 СЛЕДУЮЩИЙ ШАГ

**После успешного setup:**
→ Перейти к ФАЗА 1.2: CEO Registration

**Файлы для следующего шага:**
- `setup/ceo-registration.md` - Инструкции по регистрации CEO
- `backend/db/schema.js` - Database schema (будет создан в ФАЗЕ 2.1)

═══════════════════════════════════════════════════════════════════════════════

**МЕТАКОГНИТИВНАЯ ПРОВЕРКА:**
- ✅ Соответствует TECH_ELDORADO_INFRASTRUCTURE.md (Layer 4)
- ✅ Следует CORRECT_WORKFLOW.md (ФАЗА 1.1)
- ✅ Ведёт к partnership letter (CEO регистрация = первый шаг!)
- ✅ Применён Ruthless Deletion (только необходимое!)
- ✅ Parallel Thinking (можно делать параллельно с другими шагами!)

