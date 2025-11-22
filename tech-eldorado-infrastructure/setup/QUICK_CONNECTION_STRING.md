# БЫСТРАЯ ИНСТРУКЦИЯ: CONNECTION STRING

**ТЫ НАШЁЛ:** Модальное окно "Connect to your project" с Connection String!

═══════════════════════════════════════════════════════════════════════════════

## ✅ ЧТО ДЕЛАТЬ СЕЙЧАС

### ШАГ 1: Скопировать Connection String

```
В модальном окне "Connect to your project":
1. Убедиться что выбрано:
   - Type: URI ✅
   - Source: Primary Database ✅
   - Method: Direct connection ✅

2. Скопировать Connection String:
   postgresql://postgres:[YOUR_PASSWORD]@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
   
   (У тебя будет свой project-id вместо kgregicsrvqrndublgmp)
```

### ШАГ 2: Заменить [YOUR_PASSWORD]

```
⚠️ КРИТИЧНО: Заменить [YOUR_PASSWORD] на реальный пароль!

Это пароль который ты вводил при создании проекта (ШАГ 1.2)

Пример:
Было:  postgresql://postgres:[YOUR_PASSWORD]@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
Стало: postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
```

### ШАГ 3: Сохранить в .env файл

```
1. Открыть файл .env в папке tech-eldorado-infrastructure/
2. Найти строку DATABASE_URL
3. Вставить connection string (с реальным паролем!):

DATABASE_URL=postgresql://postgres:MySecurePassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres

4. Сохранить файл
```

### ШАГ 4: Проверить подключение

```bash
# В терминале (PowerShell)
cd C:\Users\dammi\tech-eldorado-infrastructure
npm run test:connection
```

**Ожидаемый результат:**
```
✅ Connection successful!
   Supabase URL: https://kgregicsrvqrndublgmp.supabase.co
```

═══════════════════════════════════════════════════════════════════════════════

## ⚠️ ВАЖНЫЕ МОМЕНТЫ

### 1. IPv4 Warning (можно игнорировать сейчас)

```
Видишь предупреждение "Not IPv4 compatible"?
→ МОЖНО ИГНОРИРОВАТЬ для начала!
→ Это не критично для локальной разработки
→ Если понадобится позже - купим IPv4 add-on
```

### 2. Пароль должен быть реальным!

```
❌ НЕ ОСТАВЛЯЙ [YOUR_PASSWORD] в connection string!
✅ ЗАМЕНИ на реальный пароль из ШАГ 1.2!
```

### 3. Формат должен быть правильным

```
✅ Правильно:
postgresql://postgres:MyPassword123@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres

❌ Неправильно:
postgresql://postgres:[YOUR_PASSWORD]@db.kgregicsrvqrndublgmp.supabase.co:5432/postgres
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ЧЕКЛИСТ

- [ ] Connection String скопирован из модального окна
- [ ] [YOUR_PASSWORD] заменён на реальный пароль
- [ ] Connection String сохранён в .env файл (DATABASE_URL=...)
- [ ] .env файл сохранён
- [ ] Тест подключения запущен (npm run test:connection)
- [ ] Тест прошёл успешно ✅

═══════════════════════════════════════════════════════════════════════════════

## 🚀 СЛЕДУЮЩИЙ ШАГ

**После успешного теста подключения:**
→ Перейти к ШАГ 3: Настроить Auth (в STEP_BY_STEP_SUPABASE.md)

**ИЛИ:**
→ Перейти к ШАГ 5: Зарегистрировать CEO (npm run register:ceo)

═══════════════════════════════════════════════════════════════════════════════

**ГЛАВНОЕ:** Замени [YOUR_PASSWORD] на реальный пароль! ✅

