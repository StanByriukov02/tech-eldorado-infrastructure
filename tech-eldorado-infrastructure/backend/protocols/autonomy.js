/**
 * Agent Autonomy Protocol
 * TIER 1/2/3 decision-making system
 */
import { db } from '../db/connection.js';
import { agentDecisions } from '../db/schema.js';

export class AutonomyProtocol {
  /**
   * Determine tier for decision
   */
  static determineTier(decision) {
    const { cost, reversible, riskLevel } = decision;
    
    // TIER 3: High cost, irreversible, high risk
    if (cost > 200 || !reversible || riskLevel === 'high') {
      return 'TIER_3';
    }
    
    // TIER 2: Medium cost, partially reversible
    if (cost > 50 || riskLevel === 'medium') {
      return 'TIER_2';
    }
    
    // TIER 1: Low cost, reversible, low risk
    return 'TIER_1';
  }

  /**
   * Execute TIER 1 decision (autonomous)
   */
  static async executeTier1(agentId, decision) {
    const decisionRecord = {
      decisionId: `tier1_${Date.now()}_${agentId}`,
      agentId,
      tier: 'TIER_1',
      decision: decision.decision,
      reasoning: decision.reasoning,
      protocolsApplied: decision.protocolsApplied || [],
      confidence: decision.confidence || 0.8,
      costUsd: decision.cost || 0,
      reversible: decision.reversible !== false,
      riskLevel: decision.riskLevel || 'low',
      approvalStatus: 'auto',
      outcome: 'pending',
    };

    await db.insert(agentDecisions).values(decisionRecord);
    
    // Execute immediately
    return {
      status: 'executed',
      decisionId: decisionRecord.decisionId,
      message: 'TIER 1 decision executed autonomously',
    };
  }

  /**
   * Request TIER 2 approval (2h countdown)
   */
  static async requestTier2(agentId, decision) {
    const decisionRecord = {
      decisionId: `tier2_${Date.now()}_${agentId}`,
      agentId,
      tier: 'TIER_2',
      decision: decision.decision,
      reasoning: decision.reasoning,
      protocolsApplied: decision.protocolsApplied || [],
      confidence: decision.confidence || 0.75,
      costUsd: decision.cost || 0,
      reversible: decision.reversible !== false,
      riskLevel: decision.riskLevel || 'medium',
      approvalStatus: 'pending',
      outcome: 'pending',
    };

    await db.insert(agentDecisions).values(decisionRecord);
    
    // TODO: Send notification to CEO
    // Wait 2 hours, then proceed unless vetoed
    
    return {
      status: 'pending_approval',
      decisionId: decisionRecord.decisionId,
      message: 'TIER 2 decision pending CEO approval (2h countdown)',
      countdown: 7200, // 2 hours in seconds
    };
  }

  /**
   * Request TIER 3 approval (must wait)
   */
  static async requestTier3(agentId, decision) {
    const decisionRecord = {
      decisionId: `tier3_${Date.now()}_${agentId}`,
      agentId,
      tier: 'TIER_3',
      decision: decision.decision,
      reasoning: decision.reasoning,
      protocolsApplied: decision.protocolsApplied || [],
      confidence: decision.confidence || 0.7,
      costUsd: decision.cost || 0,
      reversible: decision.reversible !== false,
      riskLevel: decision.riskLevel || 'high',
      approvalStatus: 'pending',
      outcome: 'pending',
    };

    await db.insert(agentDecisions).values(decisionRecord);
    
    // TODO: Send notification to CEO (must wait for response)
    
    return {
      status: 'awaiting_ceo_approval',
      decisionId: decisionRecord.decisionId,
      message: 'TIER 3 decision requires CEO approval',
      blocked: true,
    };
  }
}

