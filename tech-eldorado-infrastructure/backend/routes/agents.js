import { Router } from 'express';
import { agentManager } from '../agents/agent-manager.js';
import { db } from '../db/connection.js';
import { agents } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const agentRoutes = Router();

// GET all agents
agentRoutes.get('/', async (req, res) => {
  try {
    const allAgents = await db.select().from(agents);
    res.json(allAgents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET agent by ID
agentRoutes.get('/:agentId', async (req, res) => {
  try {
    const agent = await db.select()
      .from(agents)
      .where(eq(agents.agentId, req.params.agentId))
      .limit(1);
    
    if (agent.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST execute task
agentRoutes.post('/:agentId/execute', async (req, res) => {
  try {
    const { taskId, description } = req.body;
    const agent = agentManager.getAgent(req.params.agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const result = await agent.executeTask(taskId, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET agent status
agentRoutes.get('/:agentId/status', async (req, res) => {
  try {
    const agent = agentManager.getAgent(req.params.agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({
      agentId: agent.agentId,
      name: agent.name,
      status: agent.status,
      currentTask: agent.currentTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

