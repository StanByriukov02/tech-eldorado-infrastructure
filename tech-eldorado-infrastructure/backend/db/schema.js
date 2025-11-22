import { pgTable, uuid, text, timestamp, jsonb, integer, boolean, real, date } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * DATABASE SCHEMA - Tech Eldorado
 * 
 * ВАЖНО: 
 * - head_user_id, from_user_id, to_user_id ссылаются на auth.users (Supabase Auth)
 * - auth.users создаётся автоматически Supabase
 * - НЕ создаём users таблицу, используем auth.users!
 */

// DEPARTMENTS TABLE
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // 'TEAM_0_RESEARCH', 'EGER', 'INNOVATION', 'MARKETING'
  displayName: text('display_name').notNull(), // 'TEAM 0 - Research', 'EGER - Engineering'
  status: text('status').notNull().default('active'), // 'active', 'working', 'blocked', 'idle'
  description: text('description'),
  headUserId: uuid('head_user_id'), // REFERENCES auth.users(id) - устанавливается через SQL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// AGENTS TABLE
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: text('agent_id').notNull().unique(),
  name: text('name').notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  type: text('type').notNull(),
  status: text('status').notNull().default('idle'),
  currentTask: text('current_task'),
  expertise: text('expertise').array(),
  computeType: text('compute_type').default('cpu'),
  modelProvider: text('model_provider'),
  modelName: text('model_name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// TASKS TABLE
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id),
  assignedAgentId: uuid('assigned_agent_id').references(() => agents.id),
  status: text('status').notNull().default('pending'),
  priority: text('priority').default('normal'),
  deadline: timestamp('deadline'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// CHAIN OF THOUGHT LOGS
export const chainOfThoughtLogs = pgTable('chain_of_thought_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => agents.id),
  taskId: uuid('task_id').references(() => tasks.id),
  stepNumber: integer('step_number').notNull(),
  stepType: text('step_type').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// MESSAGES (Freedom of Voice, Direct CEO, Heads Council)
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(), // 'direct_ceo', 'freedom_of_voice', 'heads_council', 'department_internal'
  fromAgentId: uuid('from_agent_id').references(() => agents.id),
  fromUserId: uuid('from_user_id'), // REFERENCES auth.users(id) - устанавливается через SQL
  toUserId: uuid('to_user_id'), // REFERENCES auth.users(id) - CEO or Department Head
  toDepartmentId: uuid('to_department_id').references(() => departments.id),
  subject: text('subject'),
  content: text('content').notNull(),
  priority: text('priority').default('normal'), // 'urgent', 'high', 'normal'
  status: text('status').default('unread'), // 'unread', 'read', 'responded', 'resolved'
  parentMessageId: uuid('parent_message_id').references(() => messages.id), // For threading
  createdAt: timestamp('created_at').defaultNow(),
  readAt: timestamp('read_at'),
  respondedAt: timestamp('responded_at'),
});

// PRODUCTS TABLE
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  tier: text('tier').notNull(),
  status: text('status').notNull(),
  description: text('description'),
  timelineDays: integer('timeline_days'),
  progressNotes: text('progress_notes'),
  departmentIds: uuid('department_ids').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// PARTNERSHIPS TABLE
export const partnerships = pgTable('partnerships', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull(),
  status: text('status').notNull(),
  type: text('type'),
  description: text('description'),
  contactInfo: jsonb('contact_info'),
  nextAction: text('next_action'),
  nextActionDate: timestamp('next_action_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// KNOWLEDGE ITEMS
export const knowledgeItems = pgTable('knowledge_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  libraryType: text('library_type').notNull(),
  tier: text('tier'),
  title: text('title').notNull(),
  authors: text('authors').array(),
  year: integer('year'),
  fileUrl: text('file_url'),
  summary: text('summary'),
  keyInsights: text('key_insights').array(),
  referencedByAgentIds: uuid('referenced_by_agent_ids').array(),
  referenceCount: integer('reference_count').default(0),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// NCCL EVENTS (Agent communication via Redis/NCCL)
export const ncclEvents = pgTable('nccl_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(), // 'broadcast', 'request', 'response', 'sync', 'barrier', 'allreduce', 'allgather'
  fromAgentId: uuid('from_agent_id').references(() => agents.id),
  toAgentId: uuid('to_agent_id').references(() => agents.id), // NULL for broadcast
  message: jsonb('message').notNull(), // Tensor data, parameters, results
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// COMPANY METRICS (для dashboard)
export const companyMetrics = pgTable('company_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  metricType: text('metric_type').notNull(), // 'deadline_countdown', 'tasks_completed', 'agents_active', etc
  value: real('value').notNull(),
  metadata: jsonb('metadata'),
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// PIXELTABLE SYNC (unified data + lineage tracking)
export const pixeltableSync = pgTable('pixeltable_sync', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => agents.id),
  tableName: text('table_name').notNull(), // 'agent_conversations', 'working_memory', 'reasoning_trajectories'
  recordId: text('record_id'), // ID в Pixeltable
  data: jsonb('data').notNull(), // Synced data
  reasoningTrajectory: jsonb('reasoning_trajectory'), // Think-Speak-Decide trajectory
  syncedAt: timestamp('synced_at').defaultNow(),
});

// AGENT MEMORY (3-layer)
export const agentMemory = pgTable('agent_memory', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => agents.id),
  memoryType: text('memory_type').notNull(), // 'short_term', 'working', 'long_term'
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});

// MATH VALIDATIONS (Agent 1.3)
export const mathValidations = pgTable('math_validations', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestAgentId: uuid('request_agent_id').references(() => agents.id),
  validatorAgentId: uuid('validator_agent_id').references(() => agents.id),
  claim: text('claim').notNull(),
  derivation: text('derivation'),
  status: text('status').notNull(), // 'validated', 'conditional', 'error', 'needs_clarification'
  confidence: real('confidence'),
  reasoning: text('reasoning'),
  concerns: text('concerns').array(),
  suggestions: text('suggestions').array(),
  createdAt: timestamp('created_at').defaultNow(),
});

// AGENT DECISIONS (Autonomy Protocol)
export const agentDecisions = pgTable('agent_decisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  decisionId: text('decision_id').notNull().unique(),
  agentId: uuid('agent_id').references(() => agents.id),
  tier: text('tier').notNull(), // 'TIER_1', 'TIER_2', 'TIER_3'
  decision: text('decision').notNull(),
  reasoning: text('reasoning').notNull(),
  protocolsApplied: text('protocols_applied').array(),
  confidence: real('confidence'),
  costUsd: real('cost_usd'),
  reversible: boolean('reversible'),
  riskLevel: text('risk_level'),
  approvalStatus: text('approval_status'),
  outcome: text('outcome'),
  outcomeNotes: text('outcome_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});


