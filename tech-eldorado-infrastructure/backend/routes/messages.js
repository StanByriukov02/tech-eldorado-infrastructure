import { Router } from 'express';
import { db } from '../db/connection.js';
import { messages } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const messageRoutes = Router();

// GET messages by type
messageRoutes.get('/:type', async (req, res) => {
  try {
    const messageList = await db.select()
      .from(messages)
      .where(eq(messages.type, req.params.type))
      .orderBy(messages.createdAt);
    
    res.json(messageList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST send message (Freedom of Voice, Direct CEO, Heads Council)
messageRoutes.post('/', async (req, res) => {
  try {
    const { type, fromAgentId, fromUserId, toUserId, toDepartmentId, subject, content, priority } = req.body;
    
    const [newMessage] = await db.insert(messages).values({
      type,
      fromAgentId,
      fromUserId,
      toUserId,
      toDepartmentId,
      subject,
      content,
      priority: priority || 'normal',
    }).returning();
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

