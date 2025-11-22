# TECH ELDORADO - Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Environment Setup

```bash
# Copy example env
cp .env.example .env

# Edit .env with your credentials:
# - OpenRouter API key (already provided)
# - Supabase URL + keys
# - Redis URL (if using Hetzner)
# - Lambda Labs API key
```

### 3. Database Setup

```bash
# Run migrations (creates 12 tables)
npm run migrate

# Or manually via Supabase dashboard:
# - Create project
# - Enable pgvector extension
# - Run SQL from backend/db/schema.js
```

### 4. Start Backend

```bash
npm run dev
# Backend runs on http://localhost:3000
```

### 5. Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📋 Infrastructure Checklist

- [ ] Supabase project created
- [ ] Database schema migrated (12 tables)
- [ ] OpenRouter API key configured
- [ ] Redis setup (Hetzner or local)
- [ ] Lambda Labs account (for GPU)
- [ ] Backend running
- [ ] Frontend running
- [ ] WebSocket connection working

## 🔥 Next Steps

1. Initialize all 22 agents
2. Test agent orchestration
3. Setup memory system (Pixeltable)
4. Test WebSocket coordination
5. Deploy to production

## ⚠️ Critical Notes

- **Deadline:** 41 days to Dec 31, 2025
- **Budget:** ~$1,000 total
- **Speed > Perfection**
- **Partnership Letter = BOSS**

