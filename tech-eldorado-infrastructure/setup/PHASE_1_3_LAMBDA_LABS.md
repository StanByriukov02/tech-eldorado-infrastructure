# ФАЗА 1.3.3: LAMBDA LABS SETUP

**ЦЕЛЬ:** Настроить Lambda Labs для GPU access (H100) для self-hosted моделей

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ЧТО НУЖНО НАСТРОИТЬ

1. **Lambda Labs Account** - Регистрация
2. **API Access** - Получить API key
3. **GPU Instances** - Настроить доступ к H100 (on-demand)

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 1: СОЗДАТЬ LAMBDA LABS ACCOUNT

```
1. Зайти на: https://lambdalabs.com/
2. Нажать "Sign Up" или "Get Started"
3. Зарегистрироваться:
   - Email: [твой email]
   - Password: [безопасный пароль]
4. Подтвердить email
5. Войти в аккаунт
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 2: ПОЛУЧИТЬ API KEY

```
1. Lambda Labs Dashboard → API Keys
2. Нажать "Create API Key"
3. Назвать: tech-eldorado-api
4. Скопировать API key (показывается только один раз!)
5. Сохранить в .env файл:
   LAMBDA_LABS_API_KEY=[твой_api_key]
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 3: НАСТРОИТЬ GPU INSTANCES (On-Demand)

### 3.1. Проверить доступность GPU

```
1. Lambda Labs Dashboard → Instances
2. Проверить доступные GPU:
   - H100 (80GB) - для больших моделей
   - A100 (40GB) - для средних моделей
   - A10 (24GB) - для маленьких моделей
```

### 3.2. Создать Instance (когда нужно)

```
1. Instances → Launch Instance
2. Выбрать:
   - GPU: H100 (80GB) - если доступен
   - Region: US East (или ближайший)
   - Instance Type: gpu_1x_h100_pcie
3. Нажать "Launch"
4. Дождаться создания (~2-3 минуты)
5. Получить:
   - IP Address: [записать!]
   - SSH Command: [записать!]
```

### 3.3. Подключиться к Instance

```bash
# Использовать SSH command из dashboard
ssh ubuntu@[IP_ADDRESS]

# Или с ключом
ssh -i ~/.ssh/lambda_key ubuntu@[IP_ADDRESS]
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 4: УСТАНОВИТЬ SELF-HOSTED МОДЕЛИ (позже)

**Это будет в ФАЗЕ 2.4 (Self-Hosted Models Setup)**

Модели для установки:
- VibeThinker-1.5B (Ollama)
- Qwen3-235B (vLLM)
- DeepSeek-V3 (vLLM)

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 5: НАСТРОИТЬ API ACCESS (для Node.js)

### 5.1. Lambda Labs API Endpoints

```
Base URL: https://cloud.lambdalabs.com/api/v1

Endpoints:
- GET /instances - List instances
- POST /instance-operations/launch - Launch instance
- POST /instance-operations/terminate - Terminate instance
- GET /instance-types - Get available instance types
```

### 5.2. Добавить в .env

```env
LAMBDA_LABS_API_KEY=[твой_api_key]
LAMBDA_LABS_API_URL=https://cloud.lambdalabs.com/api/v1
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА

### Проверить API Key

```bash
# Test API connection
curl -H "Authorization: Bearer $LAMBDA_LABS_API_KEY" \
  https://cloud.lambdalabs.com/api/v1/instance-types

# Should return JSON with available instance types
```

═══════════════════════════════════════════════════════════════════════════════

## 💰 СТОИМОСТЬ

**Lambda Labs (On-Demand):**
- H100 (80GB): ~$2.50/hour (~$60/day если 24/7)
- A100 (40GB): ~$1.10/hour (~$26/day если 24/7)
- A10 (24GB): ~$0.50/hour (~$12/day если 24/7)

**ВАЖНО:** Использовать только когда нужно! Не запускать 24/7!

**Для NCCL Coordination:**
- 90% через Redis (бесплатно на Hetzner)
- 10% через Lambda Labs (on-demand, только для критичных sync)

═══════════════════════════════════════════════════════════════════════════════

## 🎯 СЛЕДУЮЩИЙ ШАГ

После настройки Lambda Labs → **ФАЗА 2.2: Backend Server**

═══════════════════════════════════════════════════════════════════════════════

**ВАЖНО:** Lambda Labs нужен только для GPU access. Можно настроить позже когда понадобится!

