# ИНСТРУКЦИЯ: СОЗДАНИЕ И ЗАПОЛНЕНИЕ .env ФАЙЛА

**ЦЕЛЬ:** Создать .env файл и заполнить его credentials из Supabase

═══════════════════════════════════════════════════════════════════════════════

## 📝 ШАГ 1: СОЗДАТЬ .env ФАЙЛ

### Способ 1: Через VS Code (РЕКОМЕНДУЕТСЯ)

```
1. Открыть VS Code
2. Открыть папку: C:\Users\dammi\tech-eldorado-infrastructure
3. В левой панели: правый клик → New File
4. Назвать файл: .env
5. Открыть файл
```

### Способ 2: Через Проводник

```
1. Открыть папку: C:\Users\dammi\tech-eldorado-infrastructure
2. Создать новый текстовый файл
3. Переименовать в: .env
   ⚠️ ВАЖНО: Убрать расширение .txt!
   ⚠️ Если не видно расширений: View → Show file extensions
```

### Способ 3: Через PowerShell

```powershell
cd C:\Users\dammi\tech-eldorado-infrastructure
New-Item -Path .env -ItemType File
notepad .env
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 2: ЗАПОЛНИТЬ .env ФАЙЛ

### Скопировать этот шаблон в .env файл:

```env
# =============================================================================
# SUPABASE (ФАЗА 1.1 - ПЕРВЫЙ ШАГ!)
# =============================================================================
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
SUPABASE_DB_PASSWORD=[database_password]

# Database Connection (для Drizzle ORM)
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# =============================================================================
# CEO REGISTRATION (ФАЗА 1.2)
# =============================================================================
CEO_EMAIL=твой_email@example.com
CEO_PASSWORD=твой_пароль

# =============================================================================
# OPENROUTER API (уже есть)
# =============================================================================
OPENROUTER_API_KEY=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

# =============================================================================
# SERVER CONFIG
# =============================================================================
PORT=3000
NODE_ENV=development
```

═══════════════════════════════════════════════════════════════════════════════

## 🔑 ШАГ 3: ЗАПОЛНИТЬ ЗНАЧЕНИЯ ИЗ SUPABASE

### 3.1. SUPABASE_URL

```
Где взять:
1. Settings → API
2. Найти "Project URL": https://[project-id].supabase.co
3. Скопировать полностью

Пример:
SUPABASE_URL=https://kgregicsrvqrndublgmp.supabase.co
```

### 3.2. SUPABASE_ANON_KEY

```
Где взять:
1. Settings → API
2. Найти секцию "Project API keys"
3. Найти "anon public" key
4. Скопировать (длинная строка)

Пример:
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncmVnaWNzcnZxcm5kdWJsZ21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNzY4MDAsImV4cCI6MjA0Nzg1MjgwMH0.xxxxx
```

### 3.3. SUPABASE_SERVICE_ROLE_KEY

```
Где взять:
1. Settings → API
2. Найти секцию "Project API keys"
3. Найти "service_role" key (⚠️ SECRET!)
4. Скопировать (длинная строка)
5. ⚠️ НЕ ПОКАЗЫВАТЬ НИКОМУ! Это секретный ключ!

Пример:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncmVnaWNzcnZxcm5kdWJsZ21wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjI3NjgwMCwiZXhwIjoyMDQ3ODUyODAwfQ.xxxxx
```

### 3.4. SUPABASE_DB_PASSWORD

```
Где взять:
Это пароль который ты вводил при создании проекта (ШАГ 1.2)

Если забыл:
1. Database Settings → "Database password"
2. "Reset database password"
3. Создать новый пароль
4. Сохранить!

Пример:
SUPABASE_DB_PASSWORD=MySecurePassword123
```

### 3.5. DATABASE_URL

```
Где взять:
1. Модальное окно "Connect to your project" (которое ты нашёл!)
2. Скопировать Connection String
3. ⚠️ ВАЖНО: Заменить [YOUR_PASSWORD] на реальный пароль!

Пример:
Было:  postgresql://postgres:[YOUR_PASSWORD]@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
Стало: postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres

Или собрать вручную:
postgresql://postgres:[PASSWORD]@db.[project-id].supabase.co:5432/postgres
```

### 3.6. CEO_EMAIL и CEO_PASSWORD

```
CEO_EMAIL=твой_реальный_email@example.com
CEO_PASSWORD=твой_безопасный_пароль

Это для регистрации CEO (ШАГ 5)
Можно заполнить позже, но лучше сейчас
```

### 3.7. OPENROUTER_API_KEY

```
Уже есть в шаблоне:
OPENROUTER_API_KEY=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

✅ НЕ МЕНЯТЬ! Уже правильный!
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРИМЕР ЗАПОЛНЕННОГО .env ФАЙЛА

```env
# =============================================================================
# SUPABASE
# =============================================================================
SUPABASE_URL=https://kgregicsrvqrndublgmp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncmVnaWNzcnZxcm5kdWJsZ21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNzY4MDAsImV4cCI6MjA0Nzg1MjgwMH0.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncmVnaWNzcnZxcm5kdWJsZ21wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjI3NjgwMCwiZXhwIjoyMDQ3ODUyODAwfQ.xxxxx
SUPABASE_DB_PASSWORD=MySecurePassword123

# Database Connection
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres

# =============================================================================
# CEO REGISTRATION
# =============================================================================
CEO_EMAIL=ceo@tech-eldorado.com
CEO_PASSWORD=MyCEOPassword123

# =============================================================================
# OPENROUTER API
# =============================================================================
OPENROUTER_API_KEY=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

# =============================================================================
# SERVER CONFIG
# =============================================================================
PORT=3000
NODE_ENV=development
```

═══════════════════════════════════════════════════════════════════════════════

## ⚠️ ВАЖНЫЕ ПРАВИЛА

### 1. НЕ ДОБАВЛЯТЬ ПРОБЕЛЫ

```
❌ Неправильно:
SUPABASE_URL = https://xxx.supabase.co

✅ Правильно:
SUPABASE_URL=https://xxx.supabase.co
```

### 2. НЕ ИСПОЛЬЗОВАТЬ КАВЫЧКИ

```
❌ Неправильно:
SUPABASE_URL="https://xxx.supabase.co"

✅ Правильно:
SUPABASE_URL=https://xxx.supabase.co
```

### 3. НЕ ДОБАВЛЯТЬ ПУСТЫЕ СТРОКИ В КОНЦЕ ЗНАЧЕНИЙ

```
❌ Неправильно:
SUPABASE_URL=https://xxx.supabase.co[пробел]

✅ Правильно:
SUPABASE_URL=https://xxx.supabase.co
```

### 4. ЗАМЕНИТЬ [YOUR_PASSWORD] В DATABASE_URL

```
❌ Неправильно:
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.xxx.supabase.co:5432/postgres

✅ Правильно:
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.xxx.supabase.co:5432/postgres
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ЧЕКЛИСТ ПОСЛЕ ЗАПОЛНЕНИЯ

- [ ] .env файл создан
- [ ] SUPABASE_URL заполнен (из Settings → API)
- [ ] SUPABASE_ANON_KEY заполнен (из Settings → API)
- [ ] SUPABASE_SERVICE_ROLE_KEY заполнен (из Settings → API)
- [ ] SUPABASE_DB_PASSWORD заполнен (из ШАГ 1.2)
- [ ] DATABASE_URL заполнен (из "Connect to your project", пароль заменён!)
- [ ] CEO_EMAIL заполнен (твой email)
- [ ] CEO_PASSWORD заполнен (твой пароль)
- [ ] OPENROUTER_API_KEY не изменён (уже правильный)
- [ ] .env файл сохранён
- [ ] Тест подключения запущен (npm run test:connection)
- [ ] Тест прошёл успешно ✅

═══════════════════════════════════════════════════════════════════════════════

## 🚀 СЛЕДУЮЩИЙ ШАГ

**После заполнения .env файла:**
1. Проверить подключение: `npm run test:connection`
2. Если успешно → перейти к ШАГ 3: Настроить Auth
3. Или сразу к ШАГ 5: Зарегистрировать CEO (`npm run register:ceo`)

═══════════════════════════════════════════════════════════════════════════════

**ГЛАВНОЕ:** 
- Заменить все [placeholder] на реальные значения!
- Особенно [YOUR_PASSWORD] в DATABASE_URL!
- Сохранить файл!

