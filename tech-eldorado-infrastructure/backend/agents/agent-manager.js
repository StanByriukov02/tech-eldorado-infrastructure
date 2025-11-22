/**
 * Agent Manager - Orchestrates all 22 agents
 */
import { BaseAgent } from './base-agent.js';
import { db } from '../db/connection.js';
import { agents, departments } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Agent configurations from deployment plan
const AGENT_CONFIGS = [
  // TEAM 0: RESEARCH FOUNDATION (3 agents)
  { agentId: 'agent_0_1', name: 'Breakthrough Research', modelKey: 'claude-3.7-sonnet', departmentId: 'team_0' },
  { agentId: 'agent_0_2', name: 'Applied Technology', modelKey: 'kimi-2k', departmentId: 'team_0' },
  { agentId: 'designer_0_d', name: 'Visual Designer', modelKey: 'gemini-2.5-pro', departmentId: 'team_0' },
  
  // TEAM 1: QUANTUM CONSCIOUSNESS (5 agents)
  { agentId: 'agent_1_1', name: 'Quantum Physics Specialist', modelKey: 'gemini-2.5-pro', departmentId: 'team_1' },
  { agentId: 'agent_1_2', name: 'H100 Optimization Expert', modelKey: 'deepseek-v3', departmentId: 'team_1' },
  { agentId: 'agent_1_3', name: 'Mathematical Validator', modelKey: 'vibethinker-1.5b', departmentId: 'team_1' }, // Self-hosted
  { agentId: 'agent_1_4', name: 'Consciousness Emergence', modelKey: 'claude-3.7-sonnet', departmentId: 'team_1' },
  { agentId: 'designer_1_d', name: 'Industrial Designer', modelKey: 'gemini-2.5-pro', departmentId: 'team_1' },
  
  // TEAM 2: ENERGY & PARTNERSHIP (5 agents)
  { agentId: 'agent_2_1', name: 'Thermodynamic Computing', modelKey: 'deepseek-v3', departmentId: 'team_2' },
  { agentId: 'agent_2_2', name: 'USC Memristor Expert', modelKey: 'gemini-2.5-pro', departmentId: 'team_2' },
  { agentId: 'agent_2_3', name: 'Power Architecture', modelKey: 'deepseek-v3', departmentId: 'team_2' },
  { agentId: 'agent_2_4', name: 'Neuromorphic Architecture', modelKey: 'gemini-2.5-pro', departmentId: 'team_2' },
  { agentId: 'designer_2_d', name: 'Visual + Technical', modelKey: 'gemini-2.5-pro', departmentId: 'team_2' },
  
  // TEAM 3: INNOVATION LAB (4 agents)
  { agentId: 'agent_3_1', name: 'Cross-Company Analyst (Hunter)', modelKey: 'kimi-2k', departmentId: 'team_3' },
  { agentId: 'agent_3_2', name: 'Innovation Synthesist', modelKey: 'claude-3.7-sonnet', departmentId: 'team_3' },
  { agentId: 'agent_3_3', name: 'Technical Prototyper', modelKey: 'claude-3.7-sonnet', departmentId: 'team_3' },
  { agentId: 'agent_3_4', name: 'Business Validator', modelKey: 'o1-mini', departmentId: 'team_3' },
  
  // TEAM 4: MARKETING & SALES (3 agents)
  { agentId: 'agent_4_1', name: 'PoC Demo Creator', modelKey: 'claude-3.7-sonnet', departmentId: 'team_4' },
  { agentId: 'agent_4_2', name: 'CEO Presentation Coach', modelKey: 'gemini-2.5-pro', departmentId: 'team_4' },
  { agentId: 'agent_4_3', name: 'Strategic Marketing Coordinator', modelKey: 'kimi-2k', departmentId: 'team_4' },
];

export class AgentManager {
  constructor() {
    this.agents = new Map();
  }

  /**
   * Initialize all agents
   */
  async initialize() {
    for (const config of AGENT_CONFIGS) {
      const agent = new BaseAgent(config);
      this.agents.set(config.agentId, agent);
      
      // Register in database (get department UUID first)
      const [dept] = await db.select()
        .from(departments)
        .where(eq(departments.name, config.departmentId))
        .limit(1);
      
      if (dept) {
        try {
          await db.insert(agents).values({
            agentId: config.agentId,
            name: config.name,
            departmentId: dept.id,
            type: config.type || 'specialist',
            modelProvider: 'openrouter',
            modelName: config.modelKey,
          });
        } catch (error) {
          // Agent already exists, skip
          if (!error.message.includes('unique')) {
            throw error;
          }
        }
      }
    }

    console.log(`✅ Initialized ${this.agents.size} agents`);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by department
   */
  getAgentsByDepartment(departmentId) {
    return Array.from(this.agents.values()).filter(
      agent => agent.departmentId === departmentId
    );
  }

  /**
   * Execute task in parallel across multiple agents
   */
  async executeParallel(tasks) {
    const promises = tasks.map(({ agentId, taskId, description }) => {
      const agent = this.getAgent(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }
      return agent.executeTask(taskId, description);
    });

    return await Promise.allSettled(promises);
  }
}

export const agentManager = new AgentManager();

