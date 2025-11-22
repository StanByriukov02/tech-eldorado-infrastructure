# ФАЗА 1.3.1: CLOUDFLARE SETUP

**ЦЕЛЬ:** Настроить Cloudflare для frontend hosting и edge compute

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ЧТО НУЖНО НАСТРОИТЬ

1. **Cloudflare Pages** - Frontend hosting (React + Vite)
2. **Cloudflare Workers** - Serverless compute (опционально)
3. **Cloudflare Durable Objects** - State management (опционально)

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 1: СОЗДАТЬ CLOUDFLARE ACCOUNT

```
1. Зайти на: https://dash.cloudflare.com/sign-up
2. Зарегистрироваться (или войти если уже есть)
3. Выбрать Free plan (достаточно для начала!)
4. Подтвердить email
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 2: ПОДКЛЮЧИТЬ GITHUB REPO

### 2.1. Создать GitHub репозиторий (если ещё нет)

```
1. Зайти на: https://github.com/new
2. Создать новый репозиторий:
   - Name: tech-eldorado-infrastructure
   - Description: Tech Eldorado - Complete Multi-Agent Infrastructure
   - Public или Private (на выбор)
   - НЕ добавлять README, .gitignore, license (создадим сами)
3. Нажать "Create repository"
```

### 2.2. Подключить к Cloudflare Pages

**ГДЕ НАЙТИ CLOUDFLARE PAGES:**

```
1. В Cloudflare Dashboard (где ты сейчас):
   - Слева в меню найти: "BUILD" секция
   - Найти: "Developer Platform" (или "Pages")
   - Нажать на "Developer Platform"
   
   ИЛИ
   
   - Вверху страницы есть вкладки: "Domains" | "Developer Platform" | "Zero Trust"
   - Нажать на вкладку "Developer Platform"
   
2. В Developer Platform:
   - Найти "Pages" в левом меню (или в списке сервисов)
   - Нажать "Pages"
   
3. На странице Pages:
   - Нажать "Create a project" (большая кнопка)
   
4. Выбрать "Connect to Git"
5. Выбрать GitHub
6. Авторизовать Cloudflare в GitHub (если ещё не авторизован)
7. Выбрать репозиторий: tech-eldorado-infrastructure
8. Нажать "Begin setup"
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 3: НАСТРОИТЬ CLOUDFLARE PAGES

**ГДЕ НАСТРАИВАТЬ:**

После того как выбрал репозиторий и нажал "Begin setup", откроется страница настройки проекта.

### 3.1. Build Settings

**На странице "Set up builds and deployments":**

```
1. Project name:
   Ввести: tech-eldorado
   
2. Production branch:
   Выбрать: main (или master - в зависимости от твоего репозитория)
   
3. Build command:
   Ввести: npm run build
   
4. Build output directory:
   Ввести: dist
   
5. Root directory (опционально):
   Ввести: frontend
   (Если frontend в отдельной папке)
   
   ИЛИ оставить пустым если frontend в корне проекта
```

**⚠️ ВАЖНО:** 
- Если frontend ещё не создан, можно настроить позже
- Или пропустить этот шаг и вернуться когда frontend будет готов

### 3.2. Environment Variables

**ГДЕ ДОБАВИТЬ:**

```
1. На странице настройки проекта прокрутить вниз
2. Найти секцию "Environment variables" (или "Variables")
3. Нажать "Add variable" или "+"
4. Добавить каждую переменную:

   Name: SUPABASE_URL
   Value: https://kgregicsrvqrndublgmp.supabase.co
   
   Name: SUPABASE_ANON_KEY
   Value: [твой_anon_key_из_.env]
   
   Name: VITE_SUPABASE_URL
   Value: https://kgregicsrvqrndublgmp.supabase.co
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: [твой_anon_key_из_.env]
```

**Где взять значения:**
- Открыть файл `.env` в проекте
- Или Supabase Dashboard → Settings → API → Project API keys

**ИЛИ добавить позже:**
- После создания проекта: Pages → tech-eldorado → Settings → Environment variables

### 3.3. Deploy

```
1. После заполнения всех полей нажать "Save and Deploy" (внизу страницы)
2. Дождаться первого deploy (~2-3 минуты)
3. После успешного deploy получить URL: https://tech-eldorado.pages.dev
```

**⚠️ ВАЖНО:** 
- Если frontend ещё не создан, deploy может упасть с ошибкой
- Это нормально! Можно настроить позже когда frontend будет готов
- Главное - проект создан и подключён к GitHub

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 4: НАСТРОИТЬ CUSTOM DOMAIN (опционально)

```
1. Pages → tech-eldorado → Custom domains
2. Добавить домен: tech-eldorado.com (если есть)
3. Настроить DNS записи (Cloudflare автоматически предложит)
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА

После deploy:

```
1. Открыть: https://tech-eldorado.pages.dev
2. Должна открыться frontend страница
3. Проверить что подключение к Supabase работает
```

═══════════════════════════════════════════════════════════════════════════════

## 💰 СТОИМОСТЬ

**Free Plan:**
- Pages: $0/month (unlimited bandwidth!)
- Workers: 100K requests/day FREE
- Durable Objects: $0.15 per million requests

**Для начала достаточно Free Plan!**

═══════════════════════════════════════════════════════════════════════════════

## 🎯 СЛЕДУЮЩИЙ ШАГ

После настройки Cloudflare → **ФАЗА 1.3.2: Hetzner Setup**

═══════════════════════════════════════════════════════════════════════════════

**ВАЖНО:** Cloudflare Pages будет работать только после того как frontend собран!
**Сейчас можно настроить, но deploy будет после создания frontend (ФАЗА 3.1)**

