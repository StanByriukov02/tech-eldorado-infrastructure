import { Router } from 'express';
import { db } from '../db/connection.js';
import { tasks } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const taskRoutes = Router();

// GET all tasks
taskRoutes.get('/', async (req, res) => {
  try {
    const allTasks = await db.select().from(tasks);
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create task
taskRoutes.post('/', async (req, res) => {
  try {
    const { title, description, departmentId, assignedAgentId, priority, deadline } = req.body;
    
    const [newTask] = await db.insert(tasks).values({
      title,
      description,
      departmentId,
      assignedAgentId,
      priority: priority || 'normal',
      deadline,
    }).returning();
    
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET task by ID
taskRoutes.get('/:taskId', async (req, res) => {
  try {
    const [task] = await db.select()
      .from(tasks)
      .where(eq(tasks.id, req.params.taskId))
      .limit(1);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update task
taskRoutes.patch('/:taskId', async (req, res) => {
  try {
    const updates = req.body;
    const [updated] = await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, req.params.taskId))
      .returning();
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

