import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * OpenRouter Orchestration Engine
 * Routes tasks to optimal models based on request type
 * Models work in PARALLEL as a TEAM
 */
class OpenRouterOrchestrator {
  constructor() {
    this.models = {
      // Architect decisions
      'claude-3.7-sonnet': {
        provider: 'anthropic',
        model: 'anthropic/claude-3.7-sonnet',
        useCase: 'architect_decisions',
        cost: { input: 0.003, output: 0.015 },
      },
      // Deep reasoning (200k tokens)
      'kimi-2k': {
        provider: 'moonshot',
        model: 'moonshot/kimi-2k',
        useCase: 'deep_reasoning',
        cost: { input: 0.001, output: 0.002 },
      },
      // Constraint satisfaction
      'o1-mini': {
        provider: 'openai',
        model: 'openai/o1-mini',
        useCase: 'constraint_satisfaction',
        cost: { input: 0.003, output: 0.012 },
      },
      // Code generation
      'deepseek-v3': {
        provider: 'deepseek',
        model: 'deepseek/deepseek-chat',
        useCase: 'code_generation',
        cost: { input: 0.00014, output: 0.00028 },
      },
      // Validation
      'haiku-3.5': {
        provider: 'anthropic',
        model: 'anthropic/claude-3.5-haiku',
        useCase: 'validation',
        cost: { input: 0.00025, output: 0.00125 },
      },
      // UI + fast tasks
      'gemini-2.5-pro': {
        provider: 'google',
        model: 'google/gemini-2.5-pro',
        useCase: 'ui_fast_tasks',
        cost: { input: 0.000125, output: 0.0005 },
      },
    };
  }

  /**
   * Route request to optimal model based on type
   */
  routeRequest(requestType, task) {
    const routing = {
      architecture: 'claude-3.7-sonnet',
      reasoning: 'kimi-2k',
      constraints: 'o1-mini',
      code: 'deepseek-v3',
      validation: 'haiku-3.5',
      ui: 'gemini-2.5-pro',
      fast: 'gemini-2.5-pro',
    };

    const modelKey = routing[requestType] || 'claude-3.7-sonnet';
    return this.models[modelKey];
  }

  /**
   * Execute request via OpenRouter
   */
  async execute(modelKey, messages, options = {}) {
    const model = this.models[modelKey];
    if (!model) {
      throw new Error(`Model ${modelKey} not found`);
    }

    try {
      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: model.model,
          messages,
          ...options,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://tech-eldorado.com',
            'X-Title': 'Tech Eldorado Infrastructure',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: modelKey,
      };
    } catch (error) {
      console.error(`OpenRouter error (${modelKey}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * PARALLEL EXECUTION - Multiple models work simultaneously
   */
  async executeParallel(tasks) {
    const promises = tasks.map(({ modelKey, messages, options }) =>
      this.execute(modelKey, messages, options)
    );

    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
      taskIndex: index,
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }

  /**
   * SUPERVISOR (Claude 3.7) validates and coordinates results
   */
  async supervise(results) {
    const supervisorMessages = [
      {
        role: 'system',
        content: `You are the SUPERVISOR coordinating parallel agent results.
Validate consistency, identify conflicts, and synthesize final output.
Apply Tech Eldorado protocols: Future-Tech Validation, DOUBT Analysis, Asymmetric Risk.`,
      },
      {
        role: 'user',
        content: `Review these parallel execution results:
${JSON.stringify(results, null, 2)}

Validate consistency, identify any conflicts, and provide synthesized recommendation.`,
      },
    ];

    return await this.execute('claude-3.7-sonnet', supervisorMessages);
  }
}

export const orchestrator = new OpenRouterOrchestrator();

