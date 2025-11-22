-- ROW LEVEL SECURITY POLICIES для Tech Eldorado
-- Выполнить в Supabase SQL Editor после создания таблиц

-- =============================================================================
-- ENABLE RLS на всех таблицах
-- =============================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chain_of_thought_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nccl_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixeltable_sync ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CEO POLICIES (CEO видит ВСЁ)
-- =============================================================================

-- Departments
CREATE POLICY "CEO sees all departments" ON departments
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Agents
CREATE POLICY "CEO sees all agents" ON agents
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Tasks
CREATE POLICY "CEO sees all tasks" ON tasks
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Messages
CREATE POLICY "CEO sees all messages" ON messages
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Chain of Thought Logs
CREATE POLICY "CEO sees all chain of thought logs" ON chain_of_thought_logs
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Agent Memory
CREATE POLICY "CEO sees all agent memory" ON agent_memory
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Agent Decisions
CREATE POLICY "CEO sees all agent decisions" ON agent_decisions
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Math Validations
CREATE POLICY "CEO sees all math validations" ON math_validations
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Products
CREATE POLICY "CEO sees all products" ON products
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Partnerships
CREATE POLICY "CEO sees all partnerships" ON partnerships
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Knowledge Items
CREATE POLICY "CEO sees all knowledge items" ON knowledge_items
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- NCCL Events
CREATE POLICY "CEO sees all nccl events" ON nccl_events
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Company Metrics
CREATE POLICY "CEO sees all company metrics" ON company_metrics
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Pixeltable Sync
CREATE POLICY "CEO sees all pixeltable sync" ON pixeltable_sync
  FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- =============================================================================
-- DEPARTMENT HEADS POLICIES (видят свой department)
-- =============================================================================

-- Departments (heads видят свой department)
CREATE POLICY "Department heads see their department" ON departments
  FOR SELECT
  USING (
    head_user_id = auth.uid() OR 
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Agents (heads видят агентов своего department)
CREATE POLICY "Department heads see their agents" ON agents
  FOR SELECT
  USING (
    department_id IN (
      SELECT id FROM departments 
      WHERE head_user_id = auth.uid()
    ) OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Tasks (heads видят задачи своего department)
CREATE POLICY "Department heads see their tasks" ON tasks
  FOR SELECT
  USING (
    department_id IN (
      SELECT id FROM departments 
      WHERE head_user_id = auth.uid()
    ) OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- Messages (heads видят сообщения для них)
CREATE POLICY "Department heads see their messages" ON messages
  FOR SELECT
  USING (
    to_user_id = auth.uid() OR
    to_department_id IN (
      SELECT id FROM departments 
      WHERE head_user_id = auth.uid()
    ) OR
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'ceo'
  );

-- =============================================================================
-- SERVICE ROLE POLICIES (для backend API)
-- =============================================================================

-- Service role (SUPABASE_SERVICE_ROLE_KEY) может всё
-- Это настраивается через Supabase Dashboard → Settings → API
-- Service role key обходит RLS автоматически

-- =============================================================================
-- INDEXES для performance (уже в schema.js, но можно добавить дополнительные)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON tasks(department_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_cot_logs_agent ON chain_of_thought_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_cot_logs_task ON chain_of_thought_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_library ON knowledge_items(library_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_tier ON knowledge_items(tier);
CREATE INDEX IF NOT EXISTS idx_nccl_from_agent ON nccl_events(from_agent_id);
CREATE INDEX IF NOT EXISTS idx_nccl_to_agent ON nccl_events(to_agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent ON agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_agent ON agent_decisions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_tier ON agent_decisions(tier);

