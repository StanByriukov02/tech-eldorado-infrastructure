# ПОШАГОВАЯ ИНСТРУКЦИЯ: SUPABASE SETUP

**ДЛЯ:** CEO (Manus)  
**ВРЕМЯ:** 10-15 минут  
**РЕЗУЛЬТАТ:** Supabase проект готов, CEO зарегистрирован

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ШАГ 1: СОЗДАТЬ SUPABASE ПРОЕКТ

### 1.1. Зайти на Supabase

```
1. Открыть: https://supabase.com
2. Нажать "Start your project" или "Sign In"
3. Войти (или зарегистрироваться если первый раз)
```

### 1.2. Создать новый проект

```
1. Нажать "New Project"
2. Заполнить:
   - Organization: [выбрать или создать]
     * Если первый раз: создать новую Organization
     * Type: COMPANY (выбрать "Company"!) ✅
       → Tech Eldorado это компания, не personal проект
       → Company даёт больше возможностей для команды
     * Name: Tech Eldorado (или любое имя)
   
   - Project details:
     * Name: tech-eldorado
     * Database Password: [ПРИДУМАТЬ СИЛЬНЫЙ ПАРОЛЬ! СОХРАНИТЬ!]
     * Region: us-east-1 (или ближайший к вам)
     * Plan: Pro ($25/month) - выбрать Pro Plan!
     * Compute Size: Micro (минимальный) ✅
       → Начать с минимального (экономия бюджета!)
       → Можно upgrade позже если нужно
       → См. setup/SUPABASE_COMPUTE_SIZE.md для деталей
   
3. Нажать "Create new project"
4. ЖДАТЬ 2-3 минуты пока проект создаётся
```

**⚠️ ВАЖНО: Type = COMPANY!**
- Personal → для личных проектов
- Business → для малого бизнеса
- Agency → для агентств
- **Company → для компаний (Tech Eldorado!)** ✅

**⚠️ ВАЖНО:** Сохранить Database Password! Он понадобится!

### 1.3. Дождаться создания проекта

```
Проект создаётся ~2-3 минуты.
Когда увидишь dashboard - готово! ✅
```

═══════════════════════════════════════════════════════════════════════════════

## 🔑 ШАГ 2: СОХРАНИТЬ CREDENTIALS

### 2.1. Получить API Keys

```
1. В Supabase Dashboard: Settings → API
2. Найти секцию "Project API keys"
3. Скопировать:
   - Project URL: https://[project-id].supabase.co
   - anon public key: [длинная строка]
   - service_role key: [длинная строка] ⚠️ SECRET!
```

### 2.2. Получить Database Connection String

**⚠️ ВАЖНО:** В новом интерфейсе Supabase Connection string НЕ в Database Settings!  
**Нужно собрать вручную или найти в Settings → API!**

**СПОСОБ 1: Собрать вручную (РЕКОМЕНДУЕТСЯ - самый надёжный!)**

```
1. Settings → API (в левом меню)
2. Найти "Project URL": https://[project-id].supabase.co
3. Записать project-id (например: abcdefghijklmnop)
4. Использовать Database password (из ШАГ 1.2)
5. Собрать connection string:
   
   Формат:
   postgresql://postgres:[PASSWORD]@db.[project-id].supabase.co:5432/postgres
   
   Пример:
   postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
   
   Где:
   - postgres = пользователь (всегда postgres)
   - [PASSWORD] = пароль из ШАГ 1.2 (который вводил при создании проекта)
   - [project-id] = твой project ID из Project URL (без https:// и .supabase.co)
   - 5432 = порт (всегда 5432)
   - postgres = имя базы данных (всегда postgres)
```

**СПОСОБ 2: Найти в Settings → API**

```
1. Settings → API
2. Прокрутить вниз до секции "Database" или "Connection string"
3. Если есть - скопировать
4. Если нет - использовать СПОСОБ 1 (собрать вручную)
```

**⚠️ ВАЖНО:** 
- Database password уже есть (видишь в Database Settings → "Database password")
- Если забыл пароль → Database Settings → "Reset database password"
- Connection string НЕ показывается в Database Settings в новом интерфейсе!

**📋 ДЕТАЛЬНАЯ ИНСТРУКЦИЯ:** См. `setup/CONNECTION_STRING_NEW_INTERFACE.md`

### 2.3. Создать .env файл

**⚠️ ВАЖНО:** Файл .env нужно создать вручную!

**СПОСОБ 1: Через VS Code (РЕКОМЕНДУЕТСЯ)**
```
1. Открыть VS Code
2. Открыть папку: C:\Users\dammi\tech-eldorado-infrastructure
3. В левой панели: правый клик → New File
4. Назвать файл: .env
5. Открыть файл
```

**СПОСОБ 2: Через Проводник**
```
1. Открыть папку: C:\Users\dammi\tech-eldorado-infrastructure
2. Создать новый текстовый файл
3. Переименовать в: .env
   ⚠️ ВАЖНО: Убрать расширение .txt!
```

**СПОСОБ 3: Через PowerShell**
```powershell
cd C:\Users\dammi\tech-eldorado-infrastructure
New-Item -Path .env -ItemType File
notepad .env
```

**После создания файла:**
```
1. Скопировать шаблон из .env.example (если есть)
2. ИЛИ использовать инструкцию ниже
3. Заполнить значения:

SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon_key_из_шага_2.1]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key_из_шага_2.1]
SUPABASE_DB_PASSWORD=[пароль_из_шага_1.2]

DATABASE_URL=postgresql://postgres:[пароль]@[host]:5432/postgres

# CEO Registration (заполнить позже)
CEO_EMAIL=твой_email@example.com
CEO_PASSWORD=твой_пароль

# OpenRouter (уже есть)
OPENROUTER_API_KEY=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

PORT=3000
NODE_ENV=development
```

**⚠️ ВАЖНО:** 
- `.env` файл НЕ должен попасть в git!
- Он уже в .gitignore ✅

═══════════════════════════════════════════════════════════════════════════════

## 🔐 ШАГ 3: НАСТРОИТЬ AUTH

### 3.1. Включить Email Provider

```
1. Authentication → Providers
2. Найти "Email" provider
3. Убедиться что он ENABLED ✅
4. (Опционально) Отключить "Confirm email" для быстрой регистрации
```

**⚠️ ВАЖНО: SMTP настраивать НЕ нужно!**
- Supabase использует default SMTP (работает без настройки!)
- Auto Confirm включён (email confirmation не нужен)
- SMTP можно настроить позже если понадобится
- См. `setup/SMTP_CONFIGURATION.md` для деталей

### 3.2. Настроить URL Configuration

```
1. Authentication → URL Configuration
2. Site URL: 
   - Для разработки: http://localhost:5173
   - Для production: https://tech-eldorado.com (позже)
3. Redirect URLs добавить:
   - http://localhost:5173/auth/callback
   - https://tech-eldorado.com/auth/callback (позже)
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ШАГ 4: ПРОВЕРИТЬ ПОДКЛЮЧЕНИЕ

### 4.1. Установить зависимости (если ещё не установлены)

```bash
cd C:\Users\dammi\tech-eldorado-infrastructure
npm install
```

### 4.2. Создать тестовый скрипт

```bash
# Создать файл test-connection.js в корне проекта
```

**Содержимое test-connection.js:**
```javascript
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  console.log('🧪 Testing Supabase connection...\n');
  
  // Простой тест - проверить что можем подключиться
  const { data, error } = await supabase
    .from('_test')
    .select('*')
    .limit(1);
  
  // Ожидаем ошибку "table does not exist" - это нормально!
  if (error && error.code === 'PGRST116') {
    console.log('✅ Connection successful! (table does not exist yet - это нормально)');
    console.log('   Supabase URL:', process.env.SUPABASE_URL);
    return true;
  }
  
  if (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
  
  console.log('✅ Connection successful!');
  return true;
}

test();
```

### 4.3. Запустить тест

```bash
node test-connection.js
```

**Ожидаемый результат:**
```
✅ Connection successful! (table does not exist yet - это нормально)
   Supabase URL: https://[project-id].supabase.co
```

═══════════════════════════════════════════════════════════════════════════════

## 👤 ШАГ 5: ЗАРЕГИСТРИРОВАТЬ CEO

### 5.1. Заполнить CEO credentials в .env

```
В .env файле:
CEO_EMAIL=твой_реальный_email@example.com
CEO_PASSWORD=твой_безопасный_пароль
```

### 5.2. Запустить скрипт регистрации

```bash
npm run register:ceo
```

**Или вручную через Supabase Dashboard:**

```
1. Authentication → Users → Add User
2. Email: [твой email]
3. Password: [твой пароль]
4. Auto Confirm: ENABLED ✅
5. Create User

6. Затем в SQL Editor выполнить:
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('role', 'ceo', 'name', 'CEO', 'department', 'EXECUTIVE')
WHERE email = '[твой email]';
```

### 5.3. Проверить регистрацию

```bash
npm run test:ceo
```

**Ожидаемый результат:**
```
✅ Login successful!
✅ Role is "ceo"
🎉 All tests passed! CEO login working correctly!
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ

После выполнения всех шагов проверить:

- [ ] Supabase проект создан
- [ ] Pro Plan активирован ($25/month)
- [ ] .env файл создан и заполнен
- [ ] SUPABASE_URL указан
- [ ] SUPABASE_ANON_KEY указан
- [ ] SUPABASE_SERVICE_ROLE_KEY указан
- [ ] SUPABASE_DB_PASSWORD указан
- [ ] DATABASE_URL указан (с реальным паролем!)
- [ ] Auth включен (Email provider)
- [ ] Тест подключения успешен (test-connection.js)
- [ ] CEO зарегистрирован
- [ ] CEO role установлен ('ceo')
- [ ] Тест входа CEO успешен (npm run test:ceo)

═══════════════════════════════════════════════════════════════════════════════

## 🚀 ЧТО ДАЛЬШЕ?

**После успешного выполнения всех шагов:**

1. **Сообщить мне результат:**
   - ✅ "Supabase настроен, CEO зарегистрирован, тесты прошли"
   - ИЛИ ❌ "Ошибка на шаге X: [описание ошибки]"

2. **Я продолжу с:**
   - ФАЗА 2.1: Database Schema (создам все таблицы)
   - ИЛИ ФАЗА 1.3: Cloud Infrastructure (если нужно)

**Мне НЕ нужны твои реальные credentials!**  
Они остаются в твоём .env файле.  
Мне нужно только знать что всё работает! ✅

═══════════════════════════════════════════════════════════════════════════════

## ❓ ВОПРОСЫ?

**Если что-то не работает:**
1. Проверить что .env файл заполнен правильно
2. Проверить что все ключи скопированы полностью (без пробелов!)
3. Проверить что Database Password правильный в DATABASE_URL
4. Сообщить мне ошибку - помогу исправить!

**ВРЕМЯ ДВИЖЕТСЯ! НАЧИНАЕМ!** 🔥⚡

