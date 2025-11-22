# ПРАВИЛЬНЫЕ BUILD SETTINGS ДЛЯ CLOUDFLARE PAGES

**ПРОБЛЕМА:** Build failed из-за неправильных build settings

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРАВИЛЬНЫЕ НАСТРОЙКИ

### В Cloudflare Pages → Settings → Builds & deployments:

```
Project name: tech-eldorado-infrastructure
Production branch: main

Root directory:
frontend

Build command:
npm install && npm run build

Build output directory:
dist
```

**ВАЖНО:**
- Root directory = `frontend` (чтобы Cloudflare знал где frontend)
- Build command = `npm install && npm run build` (установить зависимости и собрать)
- Build output directory = `dist` (относительно root directory, т.е. frontend/dist)

═══════════════════════════════════════════════════════════════════════════════

## 🔄 КАК ИСПРАВИТЬ

### В Cloudflare Pages:

```
1. Открыть проект "tech-eldorado-infrastructure"
2. Перейти в "Settings" → "Builds & deployments"
3. Изменить:

   Root directory: frontend
   Build command: npm install && npm run build
   Build output directory: dist
   
4. Нажать "Save"
5. Перейти в "Deployments"
6. Нажать "Retry deployment" (или создать новый deploy)
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА

**После исправления:**
- Build должен пройти успешно
- Deploy должен завершиться
- URL должен работать: https://tech-eldorado-infrastructure.pages.dev

═══════════════════════════════════════════════════════════════════════════════

**ГЛАВНОЕ:** Root directory = frontend, Build command = npm install && npm run build!

