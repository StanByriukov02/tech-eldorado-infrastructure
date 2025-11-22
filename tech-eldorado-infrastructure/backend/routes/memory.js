import { Router } from 'express';
import { db } from '../db/connection.js';
import { agentMemory, agents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const memoryRoutes = Router();

// GET agent memory by type
memoryRoutes.get('/:agentId/:memoryType', async (req, res) => {
  try {
    const { agentId, memoryType } = req.params;
    
    // Get agent ID from agentId string
    const agent = await db.select().from(agents).where(eq(agents.agentId, agentId)).limit(1);
    if (agent.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const memories = await db.select()
      .from(agentMemory)
      .where(
        and(
          eq(agentMemory.agentId, agent[0].id),
          eq(agentMemory.memoryType, memoryType)
        )
      )
      .orderBy(agentMemory.createdAt);
    
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST store memory
memoryRoutes.post('/', async (req, res) => {
  try {
    const { agentId, memoryType, content, metadata, expiresAt } = req.body;
    
    // Get agent ID
    const agent = await db.select().from(agents).where(eq(agents.agentId, agentId)).limit(1);
    if (agent.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const [newMemory] = await db.insert(agentMemory).values({
      agentId: agent[0].id,
      memoryType,
      content,
      metadata,
      expiresAt,
    }).returning();
    
    res.json(newMemory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

