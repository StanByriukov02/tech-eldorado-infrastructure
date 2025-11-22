# ⚡ QUICK START - 5 Minutes to Running

## Step 1: Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

## Step 2: Configure Environment

Edit `.env`:
```bash
# OpenRouter (already provided)
OPENROUTER_API_KEY=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

# Supabase (GET FROM SUPABASE DASHBOARD)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Server
PORT=3000
```

## Step 3: Setup Database

### Option A: Supabase (Recommended)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Update `.env` with Supabase URL + keys
6. Run: `npm run migrate`

### Option B: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `tech_eldorado`
3. Update `.env` with `DATABASE_URL=postgresql://user:pass@localhost:5432/tech_eldorado`
4. Run: `npm run migrate`

## Step 4: Start Backend

```bash
npm run dev
```

Should see:
```
🚀 Tech Eldorado Backend running on port 3000
⚡ WebSocket server ready
📊 Database connected
🤖 22 agents initialized
```

## Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

## ✅ Verify It Works

1. Backend: http://localhost:3000/api/health → `{"status":"ok"}`
2. Agents: http://localhost:3000/api/agents → List of 22 agents
3. Frontend: Dashboard shows agents + countdown timer

## 🐛 Troubleshooting

**Database connection error?**
→ Check `.env` has correct Supabase URL
→ Verify database is accessible

**Agents not initializing?**
→ Check departments exist in database
→ Run `npm run migrate` first

**Frontend not loading?**
→ Check backend is running on port 3000
→ Check browser console for errors

## 🚀 Next: Test Agent Execution

```bash
# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test agent execution",
    "departmentId": "team_1",
    "assignedAgentId": "agent_1_1"
  }'

# Execute via agent
curl -X POST http://localhost:3000/api/agents/agent_1_1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_id_here",
    "description": "Analyze quantum coherence"
  }'
```

**READY TO GO!** 🔥

