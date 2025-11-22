# ИНСТРУКЦИЯ: DATABASE MIGRATION (ФАЗА 2.1)

**ПРОБЛЕМА:** Ошибка подключения к базе данных

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА DATABASE_URL

### ШАГ 1: Проверить .env файл

Убедись что в `.env` файле правильный `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[project-id].supabase.co:5432/postgres
```

**Формат должен быть:**
- `postgresql://` в начале
- `postgres` как пользователь
- `[PASSWORD]` - твой реальный пароль (БЕЗ [YOUR_PASSWORD]!)
- `db.[project-id].supabase.co` - host (с `db.` в начале!)
- `5432` - порт
- `postgres` - имя базы данных

**Пример правильного DATABASE_URL:**
```
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
```

### ШАГ 2: Проверить что пароль заменён

⚠️ **КРИТИЧНО:** В DATABASE_URL НЕ должно быть `[YOUR_PASSWORD]` или `[PASSWORD]`!

❌ Неправильно:
```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
```

✅ Правильно:
```
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
```

═══════════════════════════════════════════════════════════════════════════════

## 🚀 ВЫПОЛНЕНИЕ MIGRATION

### ШАГ 1: Проверить подключение

```bash
cd C:\Users\dammi\tech-eldorado-infrastructure
npm run test:connection
```

**Ожидаемый результат:**
```
✅ Connection successful!
```

### ШАГ 2: Запустить миграцию

```bash
npm run migrate
```

**Ожидаемый результат:**
```
🔄 Running migrations...
✅ Migrations completed
```

### ШАГ 3: Запустить seed (initial data)

```bash
npm run seed
```

**Ожидаемый результат:**
```
🌱 Seeding database...
✅ CEO user found: [user-id]
📝 Creating departments...
   ✅ TEAM 0 - Research Foundation
   ✅ EGER - Engineering Department
   ✅ Innovation Lab
   ✅ Marketing & Sales
   ✅ Executive
✅ Created 5 departments
```

### ШАГ 4: Настроить RLS Policies

1. Открыть Supabase Dashboard
2. SQL Editor (в левом меню)
3. Открыть файл: `backend/db/sql/rls-policies.sql`
4. Скопировать весь SQL код
5. Вставить в SQL Editor
6. Нажать "Run" (или F5)

**Ожидаемый результат:**
```
Success. No rows returned
```

═══════════════════════════════════════════════════════════════════════════════

## 🔍 TROUBLESHOOTING

### Ошибка: "ENOTFOUND db.xxx.supabase.co"

**Причина:** Неправильный DATABASE_URL или пароль не заменён

**Решение:**
1. Проверить .env файл
2. Убедиться что DATABASE_URL правильный формат
3. Убедиться что пароль заменён (не [YOUR_PASSWORD]!)

### Ошибка: "password authentication failed"

**Причина:** Неправильный пароль

**Решение:**
1. Проверить пароль в .env (SUPABASE_DB_PASSWORD)
2. Убедиться что в DATABASE_URL тот же пароль
3. Если забыл пароль → Database Settings → "Reset database password"

### Ошибка: "relation does not exist"

**Причина:** Миграция не выполнена

**Решение:**
1. Запустить `npm run migrate`
2. Проверить что миграция прошла успешно

### Ошибка: "permission denied"

**Причина:** RLS policies не настроены

**Решение:**
1. Выполнить `backend/db/sql/rls-policies.sql` в Supabase SQL Editor
2. Убедиться что CEO user имеет role 'ceo' в auth.users

═══════════════════════════════════════════════════════════════════════════════

## ✅ ЧЕКЛИСТ

- [ ] DATABASE_URL правильный формат в .env
- [ ] Пароль заменён (не [YOUR_PASSWORD]!)
- [ ] Тест подключения прошёл (`npm run test:connection`)
- [ ] Миграция выполнена (`npm run migrate`)
- [ ] Seed выполнен (`npm run seed`)
- [ ] RLS policies выполнены (SQL Editor)
- [ ] Все 14 таблиц созданы (проверить в Supabase Dashboard → Table Editor)

═══════════════════════════════════════════════════════════════════════════════

**После выполнения всех шагов → ФАЗА 2.1 завершена!** ✅

