/**
 * Memory Manager - 3-layer Memory Architecture
 * Short-Term, Working, Long-Term memory
 */
import { db } from '../db/connection.js';
import { agentMemory, agents } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class MemoryManager {
  /**
   * Store Short-Term Memory (conversations, recent context)
   */
  async storeShortTerm(agentId, content, metadata = {}) {
    const agent = await this.getAgentById(agentId);
    
    return await db.insert(agentMemory).values({
      agentId: agent.id,
      memoryType: 'short_term',
      content,
      metadata,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }).returning();
  }

  /**
   * Get Short-Term Memory (last N items)
   */
  async getShortTerm(agentId, limit = 10) {
    const agent = await this.getAgentById(agentId);
    
    return await db.select()
      .from(agentMemory)
      .where(
        and(
          eq(agentMemory.agentId, agent.id),
          eq(agentMemory.memoryType, 'short_term')
        )
      )
      .orderBy(desc(agentMemory.createdAt))
      .limit(limit);
  }

  /**
   * Store Working Memory (task-specific scratchpad)
   */
  async storeWorking(agentId, taskId, content, metadata = {}) {
    const agent = await this.getAgentById(agentId);
    
    return await db.insert(agentMemory).values({
      agentId: agent.id,
      memoryType: 'working',
      content,
      metadata: { ...metadata, taskId },
    }).returning();
  }

  /**
   * Store Long-Term Memory (episodic, semantic, procedural)
   */
  async storeSemantic(agentId, content, metadata = {}) {
    const agent = await this.getAgentById(agentId);
    
    return await db.insert(agentMemory).values({
      agentId: agent.id,
      memoryType: 'long_term',
      content,
      metadata: { ...metadata, subtype: 'semantic' },
    }).returning();
  }

  /**
   * Retrieve memories using EmergentActivationControl
   */
  async retrieve(agentId, context, memoryTypes = ['short_term', 'working', 'long_term']) {
    const agent = await this.getAgentById(agentId);
    
    // TODO: Implement EmergentActivationControl algorithm
    // For now, simple retrieval
    
    const memories = await db.select()
      .from(agentMemory)
      .where(
        and(
          eq(agentMemory.agentId, agent.id),
          // memoryTypes.includes(agentMemory.memoryType)
        )
      )
      .orderBy(desc(agentMemory.createdAt))
      .limit(20);
    
    return memories;
  }

  async getAgentById(agentId) {
    const [agent] = await db.select()
      .from(agents)
      .where(eq(agents.agentId, agentId))
      .limit(1);
    
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    return agent;
  }
}

export const memoryManager = new MemoryManager();

