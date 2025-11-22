import { Router } from 'express';
import { agentRoutes } from './agents.js';
import { taskRoutes } from './tasks.js';
import { departmentRoutes } from './departments.js';
import { messageRoutes } from './messages.js';
import { memoryRoutes } from './memory.js';
import { mathRoutes } from './math.js';

const router = Router();

export function setupRoutes(app) {
  app.use('/api/agents', agentRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/memory', memoryRoutes);
  app.use('/api/math', mathRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}

