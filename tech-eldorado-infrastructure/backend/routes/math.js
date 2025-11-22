import { Router } from 'express';
import { db } from '../db/connection.js';
import { mathValidations, agents } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const mathRoutes = Router();

// POST request math validation (Agent 1.3)
mathRoutes.post('/validate', async (req, res) => {
  try {
    const { requestAgentId, claim, derivation, context } = req.body;
    
    // Get Agent 1.3 (Mathematical Validator)
    const validator = await db.select()
      .from(agents)
      .where(eq(agents.agentId, 'agent_1_3'))
      .limit(1);
    
    if (validator.length === 0) {
      return res.status(404).json({ error: 'Agent 1.3 (Mathematical Validator) not found' });
    }
    
    // Get requesting agent
    const requester = await db.select()
      .from(agents)
      .where(eq(agents.agentId, requestAgentId))
      .limit(1);
    
    if (requester.length === 0) {
      return res.status(404).json({ error: 'Requesting agent not found' });
    }
    
    // TODO: Call Agent 1.3 validation logic (VibeThinker-1.5B)
    // For now, create validation record
    const [validation] = await db.insert(mathValidations).values({
      requestAgentId: requester[0].id,
      validatorAgentId: validator[0].id,
      claim,
      derivation,
      status: 'pending',
    }).returning();
    
    res.json({
      validationId: validation.id,
      status: 'pending',
      message: 'Validation queued for Agent 1.3',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET validation result
mathRoutes.get('/validate/:validationId', async (req, res) => {
  try {
    const [validation] = await db.select()
      .from(mathValidations)
      .where(eq(mathValidations.id, req.params.validationId))
      .limit(1);
    
    if (!validation) {
      return res.status(404).json({ error: 'Validation not found' });
    }
    
    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

