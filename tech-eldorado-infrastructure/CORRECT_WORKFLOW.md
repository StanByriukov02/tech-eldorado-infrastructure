# ПРАВИЛЬНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ РАБОТЫ

**СОЗДАНО:** После глубокого анализа экосистемы с оркестратом  
**СТАТУС:** Master Plan - единственный источник истины  
**ЦЕЛЬ:** Правильная последовательность от регистрации CEO до полной инфраструктуры

═══════════════════════════════════════════════════════════════════════════════

## 🎯 ФАЗА 0: ПОДГОТОВКА И АНАЛИЗ (СЕЙЧАС!)

### ШАГ 0.1: Глубокое изучение экосистемы с оркестратом ✅

**ЧТО ДЕЛАЕМ:**
1. Оркестрат параллельно изучает:
   - Architect → TECH_ELDORADO_INFRASTRUCTURE.md
   - Reasoner → Все протоколы из PROTOCOLS/
   - Constraint → Все департаменты из DEPARTMENTS/
   - Coder → Deployment plan + текущий код
   - Validator → Соответствие rules.mdc
   - Fast → MANUS_PRIORITY_FILES.md

2. Синтез результатов:
   - Единая картина экосистемы
   - Критичные пробелы
   - Правильная последовательность
   - Вопросы к CEO

**РЕЗУЛЬТАТ:**
- Полное понимание экосистемы
- Выявлены все пробелы
- Создан этот документ

═══════════════════════════════════════════════════════════════════════════════

## 🚀 ФАЗА 1: ИНФРАСТРУКТУРА (ПЕРВЫЕ ШАГИ)

### ШАГ 1.1: Регистрация CEO в инфраструктуре

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Supabase Setup (ПЕРВЫЙ ШАГ!):**
   ```
   - Создать Supabase проект
   - Настроить PostgreSQL database
   - Включить Auth (GoTrue engine)
   - Настроить email/password provider
   - Создать таблицу auth.users (автоматически)
   ```

2. **CEO Registration:**
   ```
   - CEO регистрируется через Supabase Auth
   - Email: [CEO email]
   - Password: [secure password]
   - Role: 'ceo' (устанавливается в auth.users.metadata)
   ```

3. **Database Schema (после Auth):**
   ```
   - Создать таблицы (departments, agents, tasks, etc.)
   - Настроить RLS policies:
     * CEO видит ВСЁ
     * Department Heads видят свои отделы
     * Agents видят свои задачи
   ```

4. **Initial Data:**
   ```
   - Создать CEO запись в departments (если нужно)
   - Создать CEO user_id связь
   - Настроить permissions
   ```

**КРИТИЧНО:**
- Supabase Auth ДОЛЖЕН быть первым (всё остальное зависит от него!)
- CEO регистрация = точка входа в систему
- После регистрации CEO может создавать департаменты и агентов

### ШАГ 1.2: Cloud Infrastructure Setup

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Cloudflare (Layer 1 - Frontend):**
   ```
   - Создать Cloudflare account
   - Подключить GitHub repo
   - Настроить Cloudflare Pages:
     * Build command: npm run build
     * Output directory: dist
     * Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
   - Настроить Workers (если нужно):
     * Light coordination
     * API endpoints
   - Настроить Durable Objects (если нужно):
     * Multi-agent coordination state
   ```

2. **Hetzner (Layer 2 - Backend + Redis):**
   ```
   - Заказать Hetzner CX42 (если ещё нет)
   - Установить Docker
   - Настроить Redis:
     * Docker container
     * Persistence volume
     * Password protection
   - Настроить Nginx (reverse proxy):
     * SSL certificates
     * Domain routing
   ```

3. **Supabase (Layer 3 - Database):**
   ```
   - Уже настроен в ШАГ 1.1
   - Проверить connection
   - Настроить backups
   ```

4. **Lambda Labs (Layer 4 - GPU, если нужно):**
   ```
   - Зарегистрироваться (если ещё нет)
   - Настроить API access
   - Подготовить для self-hosted моделей (позже)
   ```

**КРИТИЧНО:**
- Cloudflare → Hetzner → Supabase → Lambda Labs (по порядку!)
- Каждый слой зависит от предыдущего
- CEO должен иметь доступ ко всем слоям

═══════════════════════════════════════════════════════════════════════════════

## 🏗️ ФАЗА 2: BACKEND CORE

### ШАГ 2.1: Database Schema (Drizzle ORM)

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Создать schema.js:**
   ```
   - departments (id, name, head_user_id → auth.users)
   - agents (id, agent_id, name, department_id, model_provider, model_name)
   - tasks (id, name, assigned_agent_id, priority, status)
   - decisions (id, decision_text, tier, confidence, protocols_applied)
   - agent_messages (from_agent_id, to_agent_id, message, timestamp)
   - validation_results (task_id, validator_id, status, notes)
   - chain_of_thought_logs (agent_id, task_id, step_type, content)
   - agent_memory (agent_id, memory_type, content, metadata)
   - pixeltable_sync (synced_data, reasoning_trajectories)
   - users (id → auth.users, role, department_id)
   ```

2. **Настроить RLS Policies:**
   ```
   - CEO: SELECT, INSERT, UPDATE, DELETE на ВСЁ
   - Department Heads: SELECT, INSERT, UPDATE на свои отделы
   - Agents: SELECT, INSERT на свои задачи
   ```

3. **Migrations:**
   ```
   - Drizzle migrations
   - Seed initial data (departments, CEO user)
   ```

### ШАГ 2.2: Backend Server (Node.js + Express)

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Core Server:**
   ```
   - Express setup
   - CORS configuration
   - Environment variables (.env)
   - Error handling middleware
   ```

2. **Database Connection:**
   ```
   - Drizzle ORM connection (Supabase PostgreSQL)
   - Connection pooling
   - Health check endpoint
   ```

3. **Authentication Middleware:**
   ```
   - Supabase Auth verification
   - JWT token validation
   - Role-based access control (RBAC)
   - CEO/Department Head/Agent roles
   ```

4. **API Routes:**
   ```
   - /api/auth (login, register, verify)
   - /api/departments (CRUD)
   - /api/agents (CRUD)
   - /api/tasks (CRUD)
   - /api/messages (agent communication)
   - /api/memory (agent memory access)
   - /api/decisions (autonomy protocol logging)
   ```

### ШАГ 2.3: OpenRouter Orchestration

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **OpenRouter Client:**
   ```
   - API key configuration
   - Model routing logic
   - Parallel execution support
   - Error handling + retry
   ```

2. **Intelligent Routing:**
   ```
   - Request type → optimal model
   - Cost optimization
   - Latency optimization
   - Fallback strategies
   ```

3. **Orchestrator Team:**
   ```
   - 6 агентов оркестрата (Architect, Reasoner, Constraint, Coder, Validator, Fast)
   - Параллельный анализ
   - Синтез результатов
   ```

### ШАЗ 2.4: NCCL Coordination (ГИБРИДНАЯ АРХИТЕКТУРА!)

**КРИТИЧНО: NCCL в Node.js НЕ РАБОТАЕТ напрямую (это CUDA библиотека)!**

**РЕШЕНИЕ (из EGER_COMMUNICATION_ARCHITECTURE.md):**

1. **Layer 1: Redis Queue (90% коммуникации):**
   ```
   - Redis pub/sub для async коммуникации
   - Agent messages
   - Status updates
   - Progress sharing
   - Cost: $5-15/мес (Hetzner)
   ```

2. **Layer 2: NCCL 2.28 (10% критичных syncs, on-demand):**
   ```
   - Python microservice на Lambda Labs GPU
   - Спин-up ТОЛЬКО для:
     * Cross-department AllReduce
     * Major result Broadcast
     * Knowledge synthesis AllGather
   - Spun down after sync
   - Cost: $2-5 per sync (vs $300/мес постоянно!)
   ```

3. **Layer 3: Claude API (Semantic Reasoning):**
   ```
   - Natural language reasoning sharing
   - Complex insights, hypotheses
   - Chain-of-Thought explanations
   ```

4. **Layer 4: Knowledge Graphs (Persistent):**
   ```
   - Long-term knowledge storage
   - Cross-reference discoveries
   - Query historical insights
   ```

**ИМПЛЕМЕНТАЦИЯ:**
```
- Redis client в Node.js (ioredis)
- Python NCCL service (отдельный microservice)
- API endpoint для NCCL triggers
- Intelligent routing (Redis default, NCCL on-demand)
```

═══════════════════════════════════════════════════════════════════════════════

## 🤖 ФАЗА 3: AGENT SYSTEM

### ШАГ 3.1: Base Agent Class

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **BaseAgent:**
   ```
   - Agent ID, name, department
   - Model provider (OpenRouter)
   - Memory manager (3-layer)
   - Task execution logic
   - Communication protocols
   ```

2. **Memory Manager:**
   ```
   - Short-term (context window)
   - Working (Redis + Pixeltable)
   - Long-term (Knowledge Graphs)
   - Pixeltable integration (Python service)
   ```

3. **Autonomy Protocol:**
   ```
   - TIER 1: Full autonomy (execute → log)
   - TIER 2: Async approval (notify → wait 2h → proceed)
   - TIER 3: CEO approval (blocking)
   - Decision logging (Pixeltable)
   ```

### ШАГ 3.2: Agent Manager

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Initialize All 22 Agents:**
   ```
   - Team 0: 3 agents
   - Team 1: 5 agents
   - Team 2: 5 agents
   - Team 3: 4 agents
   - Team 4: 3 agents
   - Operations: 2 agents (implicit)
   ```

2. **Department Heads:**
   ```
   - CTO 1 (Vacancy Hunting) → Claude 3.7 Sonnet
   - CTO 2 (Partnership Tech) → Claude 3.7 Sonnet
   - Innovation Lead → GPT-5
   - CEO (Marketing) → Direct
   ```

3. **Parallel Execution:**
   ```
   - Task queue management
   - Agent assignment
   - Parallel task execution
   - Result aggregation
   ```

### ШАГ 3.3: Communication Protocols

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Freedom of Voice:**
   ```
   - Agent → Department Head messages
   - Redis pub/sub channel
   - Real-time notifications
   ```

2. **Direct CEO:**
   ```
   - Agent → CEO messages (breakthroughs!)
   - Priority queue
   - Real-time notifications
   - 24/7 приват чат
   ```

3. **Heads Council:**
   ```
   - Public accountability
   - Department Head discussions
   - Decision transparency
   ```

4. **NCCL Coordination:**
   ```
   - Redis для async (default)
   - NCCL Python service для критичных syncs
   - Intelligent routing
   ```

═══════════════════════════════════════════════════════════════════════════════

## 🎨 ФАЗА 4: FRONTEND

### ШАГ 4.1: React + Vite Setup

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **Project Setup:**
   ```
   - Vite + React
   - TypeScript (опционально)
   - Tailwind CSS
   - shadcn/ui components
   ```

2. **Supabase Client:**
   ```
   - @supabase/supabase-js
   - Auth integration
   - Real-time subscriptions
   - Row-level security
   ```

3. **WebSocket Client:**
   ```
   - Real-time updates
   - Agent status
   - Task progress
   - Message notifications
   ```

### ШАГ 4.2: Dashboard Components

**ПОСЛЕДОВАТЕЛЬНОСТЬ:**

1. **CEO Dashboard:**
   ```
   - Overview всех агентов
   - Current tasks
   - Department tabs
   - Real-time status
   - Countdown timer (41 days!)
   - Direct messages inbox
   ```

2. **Agent Coordination UI:**
   ```
   - Team chat interface
   - Agent communication
   - Task assignment
   - Validation workflow
   ```

3. **Task Management:**
   ```
   - Create tasks
   - Assign to agents
   - Track progress
   - View results
   ```

4. **Results Visualization:**
   ```
   - Agent discoveries
   - Built prototypes
   - Partnership progress
   - Metrics dashboard
   ```

═══════════════════════════════════════════════════════════════════════════════

## 📋 КРИТИЧНЫЕ ИСПРАВЛЕНИЯ (ПЕРЕРАБОТКА)

### ПРОБЕЛ 1: NCCL Coordination

**ЧТО БЫЛО:**
- Попытка использовать NCCL напрямую в Node.js (невозможно!)

**ЧТО НУЖНО:**
- Redis pub/sub для 90% коммуникации (Node.js)
- Python NCCL microservice для 10% критичных syncs (Lambda Labs GPU)
- Intelligent routing между слоями

### ПРОБЕЛ 2: Pixeltable Integration

**ЧТО БЫЛО:**
- Placeholder в memory-manager.js

**ЧТО НУЖНО:**
- Python Pixeltable service (отдельный microservice)
- API endpoints для Node.js backend
- Unified data + lineage tracking

### ПРОБЕЛ 3: Self-hosted Models

**ЧТО БЫЛО:**
- Указано в agent-manager.js, но нет логики

**ЧТО НУЖНО:**
- Hetzner CX42 setup (позже, не приоритет сейчас)
- Ollama installation
- Model routing (local → HuggingFace → OpenRouter fallback)

### ПРОБЕЛ 4: Метакогнитивность

**ЧТО БЫЛО:**
- Не применялась при принятии решений

**ЧТО НУЖНО:**
- Ruthless Deletion в каждом решении
- Parallel Thinking в архитектуре
- Protocol Validation в каждом компоненте
- Decision Confidence logging

### ПРОБЕЛ 5: Протоколы

**ЧТО БЫЛО:**
- Частично реализованы

**ЧТО НУЖНО:**
- Полная реализация всех протоколов:
  * Autonomy Protocol (TIER 1/2/3)
  * Communication Protocols (Freedom of Voice, Direct CEO, Heads Council)
  * Workflow Protocols (Hunter → EGER, Conservative Verification, DOUBT)
  * Memory Protocols (3-layer + Pixeltable)
  * Optimization Protocols (Elon's Algorithm, AlphaEvolve)

═══════════════════════════════════════════════════════════════════════════════

## ✅ ЧЕКЛИСТ ПОСЛЕ КАЖДОЙ ФАЗЫ

**ФАЗА 1 COMPLETED:**
- [ ] Supabase Auth работает
- [ ] CEO зарегистрирован
- [ ] Cloudflare настроен
- [ ] Hetzner настроен (Redis)
- [ ] Все слои инфраструктуры доступны

**ФАЗА 2 COMPLETED:**
- [ ] Database schema создан
- [ ] RLS policies настроены
- [ ] Backend server работает
- [ ] OpenRouter orchestration работает
- [ ] NCCL coordination (Redis + Python service) работает

**ФАЗА 3 COMPLETED:**
- [ ] Все 22 агента инициализированы
- [ ] Department Heads назначены
- [ ] Communication protocols работают
- [ ] Autonomy Protocol реализован
- [ ] Memory system работает

**ФАЗА 4 COMPLETED:**
- [ ] Frontend dashboard работает
- [ ] CEO может видеть всю компанию
- [ ] Real-time updates работают
- [ ] Task management работает
- [ ] Все протоколы реализованы

═══════════════════════════════════════════════════════════════════════════════

**СЛЕДУЮЩИЙ ШАГ:** Начать с ФАЗЫ 1, ШАГ 1.1 (Supabase Setup + CEO Registration)

