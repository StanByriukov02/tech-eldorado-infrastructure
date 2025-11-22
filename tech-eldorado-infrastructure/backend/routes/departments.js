import { Router } from 'express';
import { db } from '../db/connection.js';
import { departments, agents } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const departmentRoutes = Router();

// GET all departments
departmentRoutes.get('/', async (req, res) => {
  try {
    const allDepartments = await db.select().from(departments);
    res.json(allDepartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET department with agents
departmentRoutes.get('/:departmentId/agents', async (req, res) => {
  try {
    const departmentAgents = await db.select()
      .from(agents)
      .where(eq(agents.departmentId, req.params.departmentId));
    
    res.json(departmentAgents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

