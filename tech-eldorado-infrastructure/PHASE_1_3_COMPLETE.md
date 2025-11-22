# ФАЗА 1.3: CLOUD INFRASTRUCTURE - ИНСТРУКЦИИ

**СТАТУС:** Готово к настройке

═══════════════════════════════════════════════════════════════════════════════

## ✅ ЧТО СОЗДАНО

### Инструкции для каждого компонента:

1. **Cloudflare Setup** - `setup/PHASE_1_3_CLOUDFLARE.md`
   - Cloudflare Pages (Frontend hosting)
   - Cloudflare Workers (Serverless compute)
   - Cloudflare Durable Objects (State management)

2. **Hetzner Setup** - `setup/PHASE_1_3_HETZNER.md`
   - Hetzner CX42 server setup
   - Docker installation
   - Redis setup (NCCL Coordination)
   - Nginx (опционально)

3. **Lambda Labs Setup** - `setup/PHASE_1_3_LAMBDA_LABS.md`
   - Lambda Labs account
   - API key setup
   - GPU instances (on-demand)

═══════════════════════════════════════════════════════════════════════════════

## 🚀 ПОСЛЕДОВАТЕЛЬНОСТЬ НАСТРОЙКИ

### ШАГ 1: Cloudflare (РЕКОМЕНДУЕТСЯ ПЕРВЫМ)

**Почему первым:**
- Бесплатно (Free plan)
- Быстро настроить
- Нужен для frontend (но можно настроить позже)

**Инструкция:** `setup/PHASE_1_3_CLOUDFLARE.md`

**Время:** 10-15 минут

### ШАГ 2: Hetzner (КРИТИЧНО ДЛЯ REDIS)

**Почему вторым:**
- Нужен для Redis (NCCL Coordination)
- Нужен для self-hosted моделей
- Требует оплаты (~€20/month)

**Инструкция:** `setup/PHASE_1_3_HETZNER.md`

**Время:** 30-45 минут

**Требует:**
- Hetzner account
- Payment method
- SSH key (или root password)

### ШАГ 3: Lambda Labs (ОПЦИОНАЛЬНО, МОЖНО ПОЗЖЕ)

**Почему третьим:**
- Нужен только для GPU access
- On-demand использование
- Можно настроить когда понадобится

**Инструкция:** `setup/PHASE_1_3_LAMBDA_LABS.md`

**Время:** 10-15 минут

**Требует:**
- Lambda Labs account
- API key

═══════════════════════════════════════════════════════════════════════════════

## 📋 ЧЕКЛИСТ

### Cloudflare:
- [ ] Account создан
- [ ] GitHub repo подключен
- [ ] Pages настроен (build settings)
- [ ] Environment variables добавлены
- [ ] Deploy выполнен (после создания frontend)

### Hetzner:
- [ ] Account создан
- [ ] CX42 server заказан
- [ ] Docker установлен
- [ ] Redis настроен (docker-compose)
- [ ] Redis password сохранён
- [ ] Firewall настроен
- [ ] SSH доступ работает

### Lambda Labs:
- [ ] Account создан
- [ ] API key получен
- [ ] API key добавлен в .env
- [ ] API connection протестирован

═══════════════════════════════════════════════════════════════════════════════

## 💰 ОБЩАЯ СТОИМОСТЬ

**Monthly:**
- Cloudflare: $0-25/month (Free plan достаточно!)
- Hetzner: €20/month (~$22/month)
- Lambda Labs: $0/month (on-demand, платишь только когда используешь)

**Total:** ~$22-47/month

═══════════════════════════════════════════════════════════════════════════════

## 🎯 СЛЕДУЮЩИЙ ШАГ

**После настройки инфраструктуры:**

**Вариант 1:** Продолжить с Backend
- ФАЗА 2.2: Backend Server (Node.js + Express)

**Вариант 2:** Продолжить с Frontend
- ФАЗА 3.1: Frontend Setup (React + Vite)

**Рекомендация:** Начать с ФАЗЫ 2.2 (Backend), так как он нужен для работы всей системы.

═══════════════════════════════════════════════════════════════════════════════

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Cloudflare Pages:**
   - Deploy будет работать только после создания frontend
   - Можно настроить сейчас, но deploy позже

2. **Hetzner Redis:**
   - НЕ открывать порт 6379 публично!
   - Использовать SSH tunnel или VPN
   - Или Hetzner Private Network

3. **Lambda Labs:**
   - Использовать только on-demand
   - Не запускать 24/7 (дорого!)
   - Только для критичных GPU задач

═══════════════════════════════════════════════════════════════════════════════

**ФАЗА 1.3 готова к настройке!** ✅

**Начни с Cloudflare (бесплатно и быстро), затем Hetzner (критично для Redis)!**

