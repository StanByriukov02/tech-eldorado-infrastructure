# КАК НАЙТИ CONNECTION STRING В SUPABASE

**ПРОБЛЕМА:** Не могу найти Connection string в Supabase Dashboard

═══════════════════════════════════════════════════════════════════════════════

## 🔍 ГДЕ ИСКАТЬ (ВСЕ ВАРИАНТЫ)

### ВАРИАНТ 1: Settings → Database (самый частый)

```
1. В левом меню: Settings (иконка шестерёнки)
2. Database (в списке настроек)
3. Прокрутить вниз до секции "Connection string"
4. Найти вкладку "URI" или кнопку "Show connection string"
5. Нажать "Reveal" или "Show" (может быть скрыт)
6. Скопировать строку
```

### ВАРИАНТ 2: Project Settings → Database

```
1. Вверху справа: Project Settings (иконка шестерёнки)
2. В меню слева: Database
3. Connection string → URI
4. Скопировать
```

### ВАРИАНТ 3: Database → Connection Pooling

```
1. Settings → Database
2. Найти "Connection pooling" (может быть отдельная секция)
3. "Session mode" → URI
4. Скопировать
```

### ВАРИАНТ 4: SQL Editor → Connection Info

```
1. SQL Editor (в левом меню)
2. Найти "Connection info" или "Database URL"
3. Скопировать
```

═══════════════════════════════════════════════════════════════════════════════

## 🛠️ ЕСЛИ ВСЁ ЕЩЁ НЕ МОЖЕШЬ НАЙТИ

### АЛЬТЕРНАТИВА: Собрать Connection String вручную

**Шаг 1: Получить Project URL**
```
1. Settings → API
2. Найти "Project URL": https://[project-id].supabase.co
3. Записать project-id (например: abcdefghijklmnop)
```

**Шаг 2: Получить Database Password**
```
Это пароль который ты вводил при создании проекта (ШАГ 1.2)
Если забыл → нужно сбросить в Settings → Database → Reset database password
```

**Шаг 3: Собрать Connection String**
```
Формат:
postgresql://postgres:[PASSWORD]@db.[project-id].supabase.co:5432/postgres

Пример:
postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres

Где:
- [PASSWORD] = твой database password
- [project-id] = твой project ID из Project URL
```

═══════════════════════════════════════════════════════════════════════════════

## 📸 ВИЗУАЛЬНЫЕ ПОДСКАЗКИ

### Где искать в интерфейсе:

```
Supabase Dashboard
├── Project (слева вверху)
├── Table Editor
├── SQL Editor
├── Authentication
├── Storage
├── Edge Functions
└── Settings ⚙️
    ├── General
    ├── API
    ├── Database ← ВОТ ЗДЕСЬ!
    │   ├── Connection string ← ИЩИ ЗДЕСЬ!
    │   │   └── URI ← ИЛИ ЗДЕСЬ!
    │   ├── Connection pooling
    │   └── ...
    ├── Auth
    └── ...
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА CONNECTION STRING

### Формат должен быть:

```
postgresql://postgres:[password]@[host]:5432/postgres
```

**Где:**
- `postgresql://` - протокол
- `postgres` - пользователь (обычно postgres)
- `[password]` - твой database password
- `[host]` - db.[project-id].supabase.co
- `5432` - порт (обычно 5432)
- `postgres` - имя базы данных

### Пример правильного Connection String:

```
postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

═══════════════════════════════════════════════════════════════════════════════

## 🚨 ЕСЛИ ВСЁ ЕЩЁ НЕ РАБОТАЕТ

### Вариант 1: Использовать Connection Pooling

```
1. Settings → Database
2. Connection pooling → Session mode
3. Скопировать URI оттуда
```

### Вариант 2: Использовать только для Drizzle ORM

```
Для Drizzle ORM можно использовать просто:
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

Или через Supabase connection string (если найдёшь)
```

### Вариант 3: Связаться со мной

```
Сообщи:
- Что видишь в Settings → Database
- Есть ли секция "Connection string"?
- Есть ли "Connection pooling"?
- Какой интерфейс Supabase (новая или старая версия)?

Я помогу найти!
```

═══════════════════════════════════════════════════════════════════════════════

**ГЛАВНОЕ:** Если не можешь найти - собери вручную по инструкции выше! ✅

