/**
 * Base Agent Class
 * All 22 agents inherit from this
 */
import { orchestrator } from '../orchestration/openrouter.js';
import { db } from '../db/connection.js';
import { agents, tasks, chainOfThoughtLogs } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class BaseAgent {
  constructor(config) {
    this.agentId = config.agentId;
    this.name = config.name;
    this.departmentId = config.departmentId;
    this.modelKey = config.modelKey;
    this.expertise = config.expertise || [];
    this.status = 'idle';
    this.currentTask = null;
  }

  /**
   * Execute task using OpenRouter
   */
  async executeTask(taskId, taskDescription) {
    this.status = 'working';
    this.currentTask = taskId;

    try {
      // Get task context
      const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
      
      // Determine request type
      const requestType = this.determineRequestType(taskDescription);
      
      // Route to optimal model
      const model = orchestrator.routeRequest(requestType, taskDescription);
      
      // Execute via OpenRouter
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt(),
        },
        {
          role: 'user',
          content: taskDescription,
        },
      ];

      const result = await orchestrator.execute(this.modelKey, messages);

      // Log chain-of-thought
      await this.logChainOfThought(taskId, result.content);

      // Update status
      this.status = 'idle';
      this.currentTask = null;

      return result;
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  /**
   * Determine request type for routing
   */
  determineRequestType(description) {
    if (description.includes('code') || description.includes('implement')) {
      return 'code';
    }
    if (description.includes('validate') || description.includes('check')) {
      return 'validation';
    }
    if (description.includes('reason') || description.includes('analyze')) {
      return 'reasoning';
    }
    if (description.includes('architecture') || description.includes('design')) {
      return 'architecture';
    }
    return 'fast';
  }

  /**
   * Get system prompt for this agent
   */
  getSystemPrompt() {
    return `You are ${this.name} (${this.agentId}).
Your expertise: ${this.expertise.join(', ')}.
Apply Tech Eldorado protocols: Future-Tech Validation, DOUBT Analysis, Elon's Algorithm.
Mission: Partnership letter by Dec 31, 2025.`;
  }

  /**
   * Log chain-of-thought reasoning
   */
  async logChainOfThought(taskId, content) {
    // Get agent UUID from database
    const [agent] = await db.select()
      .from(agents)
      .where(eq(agents.agentId, this.agentId))
      .limit(1);
    
    if (agent) {
      await db.insert(chainOfThoughtLogs).values({
        agentId: agent.id,
        taskId,
        stepNumber: 1,
        stepType: 'reasoning',
        content,
        metadata: { model: this.modelKey },
      });
    }
  }

  /**
   * Communicate with other agents
   */
  async sendMessage(toAgentId, message, messageType = 'freedom_of_voice') {
    // Implementation via Redis pub/sub or database
    console.log(`${this.name} → Agent ${toAgentId}: ${message}`);
  }
}

