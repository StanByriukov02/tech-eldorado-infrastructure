# ФАЗА 1.3.2: HETZNER SETUP

**ЦЕЛЬ:** Настроить Hetzner сервер для Redis, Docker, и self-hosted моделей

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ЧТО НУЖНО НАСТРОИТЬ

1. **Hetzner CX42** - VPS сервер (если ещё нет)
2. **Docker** - Containerization
3. **Redis** - NCCL Coordination (90% async communication)
4. **Nginx** - Reverse proxy (опционально)

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 1: ЗАКАЗАТЬ HETZNER SERVER

### 1.1. Создать Hetzner Account

```
1. Зайти на: https://www.hetzner.com/cloud
2. Зарегистрироваться (или войти)
3. Подтвердить email
4. Добавить payment method (если нужно)
```

### 1.2. Создать Cloud Server

```
1. Hetzner Cloud Console → Servers
2. Нажать "Add Server"
3. Выбрать:
   - Location: Nuremberg (или ближайший)
   - Image: Ubuntu 22.04
   - Type: CX42 (4 vCPU, 16 GB RAM, 240 GB SSD)
   - SSH Keys: Добавить свой SSH key (или создать новый)
   - Name: tech-eldorado-server
4. Нажать "Create & Buy Now"
5. Дождаться создания (~1-2 минуты)
```

**Стоимость:** ~€20/month (~$22/month)

### 1.3. Получить IP и доступ

```
1. После создания сервера:
   - IP Address: [записать!]
   - Root password: [сохранить!] (если не использовал SSH key)
2. SSH подключение:
   ssh root@[IP_ADDRESS]
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 2: УСТАНОВИТЬ DOCKER

### 2.1. Подключиться к серверу

```bash
ssh root@[IP_ADDRESS]
```

### 2.2. Установить Docker

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Start Docker
systemctl start docker
systemctl enable docker

# Verify installation
docker --version
```

### 2.3. Установить Docker Compose

```bash
# Install Docker Compose
apt install docker-compose -y

# Verify
docker-compose --version
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 3: НАСТРОИТЬ REDIS

### 3.1. Создать Docker Compose файл

```bash
# Create directory
mkdir -p /opt/tech-eldorado
cd /opt/tech-eldorado

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: tech-eldorado-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - tech-eldorado-network

volumes:
  redis-data:

networks:
  tech-eldorado-network:
    driver: bridge
EOF
```

### 3.2. Создать .env файл для Redis

```bash
# Generate secure password
REDIS_PASSWORD=$(openssl rand -base64 32)

# Save to .env
echo "REDIS_PASSWORD=$REDIS_PASSWORD" > .env
echo "REDIS_HOST=localhost" >> .env
echo "REDIS_PORT=6379" >> .env

# Show password (записать!)
cat .env
```

### 3.3. Запустить Redis

```bash
docker-compose up -d

# Verify
docker ps
docker logs tech-eldorado-redis
```

### 3.4. Проверить Redis

```bash
# Test connection
docker exec -it tech-eldorado-redis redis-cli -a $REDIS_PASSWORD ping
# Должно вернуть: PONG
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 4: НАСТРОИТЬ FIREWALL

```bash
# Install UFW
apt install ufw -y

# Allow SSH
ufw allow 22/tcp

# Allow Redis (только для внутреннего использования!)
# НЕ открывать 6379 публично! Использовать VPN или SSH tunnel!

# Enable firewall
ufw enable

# Check status
ufw status
```

═══════════════════════════════════════════════════════════════════════════════

## 📋 ШАГ 5: НАСТРОИТЬ NGINX (опционально)

### 5.1. Установить Nginx

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 5.2. Настроить SSL (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (если есть домен)
certbot --nginx -d tech-eldorado.com
```

═══════════════════════════════════════════════════════════════════════════════

## ✅ ПРОВЕРКА

### Проверить Redis

```bash
# From server
docker exec -it tech-eldorado-redis redis-cli -a $REDIS_PASSWORD ping

# Should return: PONG
```

### Проверить Docker

```bash
docker ps
# Should show: tech-eldorado-redis
```

═══════════════════════════════════════════════════════════════════════════════

## 🔐 БЕЗОПАСНОСТЬ

**ВАЖНО:**
- Redis НЕ должен быть доступен публично!
- Использовать SSH tunnel для подключения:
  ```bash
  ssh -L 6379:localhost:6379 root@[IP_ADDRESS]
  ```
- Или настроить VPN
- Или использовать Hetzner Private Network

═══════════════════════════════════════════════════════════════════════════════

## 💰 СТОИМОСТЬ

**Hetzner CX42:**
- €20/month (~$22/month)
- 4 vCPU, 16 GB RAM, 240 GB SSD

**Достаточно для:**
- Redis (NCCL Coordination)
- Self-hosted модели (VibeThinker, Qwen3, DeepSeek-V3)
- Docker containers

═══════════════════════════════════════════════════════════════════════════════

## 🎯 СЛЕДУЮЩИЙ ШАГ

После настройки Hetzner → **ФАЗА 1.3.3: Lambda Labs Setup**

═══════════════════════════════════════════════════════════════════════════════

**ВАЖНО:** Сохранить Redis password и IP адрес сервера!

