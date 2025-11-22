/**
 * SMART ORCHESTRATOR - Умный роутинг для минимизации токенов
 * 
 * СТРАТЕГИЯ:
 * 1. Простые задачи → делаю сам (0 токенов!)
 * 2. Средние задачи → один дешёвый агент
 * 3. Сложные задачи → оркестрат параллельно
 * 4. Критичные задачи → полный оркестрат + валидация
 */

import { orchestrator } from './openrouter.js';
import { orchestratorTeam } from './orchestrator-team.js';

export class SmartOrchestrator {
  constructor() {
    this.cache = new Map(); // Кэш результатов
    this.stats = {
      totalCalls: 0,
      totalTokens: 0,
      cacheHits: 0,
      parallelExecutions: 0,
    };
  }

  /**
   * Умный роутинг: выбирает оптимальную стратегию
   */
  async smartRoute(task, options = {}) {
    const {
      complexity = 'medium', // 'simple', 'medium', 'complex', 'critical'
      useCache = true,
      parallel = true,
    } = options;

    // Проверить кэш
    if (useCache) {
      const cacheKey = this.getCacheKey(task);
      if (this.cache.has(cacheKey)) {
        this.stats.cacheHits++;
        console.log('💾 Cache hit! Using cached result');
        return this.cache.get(cacheKey);
      }
    }

    // Выбрать стратегию
    let result;
    switch (complexity) {
      case 'simple':
        // Простая задача → делаю сам (0 токенов!)
        result = await this.handleSimple(task);
        break;

      case 'medium':
        // Средняя задача → один дешёвый агент
        result = await this.handleMedium(task);
        break;

      case 'complex':
        // Сложная задача → оркестрат параллельно
        result = await this.handleComplex(task, parallel);
        break;

      case 'critical':
        // Критичная задача → полный оркестрат + валидация
        result = await this.handleCritical(task, parallel);
        break;

      default:
        result = await this.handleMedium(task);
    }

    // Сохранить в кэш
    if (useCache && result) {
      const cacheKey = this.getCacheKey(task);
      this.cache.set(cacheKey, result);
    }

    this.stats.totalCalls++;
    return result;
  }

  /**
   * Простая задача → делаю сам (0 токенов!)
   */
  async handleSimple(task) {
    console.log('⚡ Simple task: handling myself (0 tokens!)');
    // Простые задачи обрабатываю сам, без вызова моделей
    return { handled: 'self', tokens: 0 };
  }

  /**
   * Средняя задача → один дешёвый агент
   */
  async handleMedium(task) {
    console.log('🔍 Medium task: using cheapest agent');

    // Определить тип задачи и выбрать дешёвого агента
    const agent = this.selectCheapestAgent(task);

    const result = await orchestrator.execute(agent.model, [
      {
        role: 'system',
        content: `Ты ${agent.role}. Выполни задачу максимально эффективно.`,
      },
      {
        role: 'user',
        content: task,
      },
    ]);

    return {
      agent: agent.name,
      result: result.content,
      tokens: result.usage?.total_tokens || 0,
      cost: this.estimateCost(agent.model, result.usage),
    };
  }

  /**
   * Сложная задача → оркестрат параллельно
   */
  async handleComplex(task, parallel = true) {
    console.log('🧠 Complex task: using orchestrator team (parallel)');

    if (parallel) {
      // Параллельное выполнение
      this.stats.parallelExecutions++;
      const results = await orchestratorTeam.distributeEcosystemAnalysis();
      const synthesis = await orchestratorTeam.synthesizeAnalysis(results);

      return {
        strategy: 'parallel',
        agents: results.length,
        synthesis: synthesis.content,
        tokens: synthesis.usage?.total_tokens || 0,
      };
    } else {
      // Последовательное выполнение (если параллельность невозможна)
      const results = await orchestratorTeam.distributeEcosystemAnalysis();
      const synthesis = await orchestratorTeam.synthesizeAnalysis(results);

      return {
        strategy: 'sequential',
        agents: results.length,
        synthesis: synthesis.content,
        tokens: synthesis.usage?.total_tokens || 0,
      };
    }
  }

  /**
   * Критичная задача → полный оркестрат + валидация
   */
  async handleCritical(task, parallel = true) {
    console.log('🚨 Critical task: full orchestrator + validation');

    // Полный анализ
    const analysis = await this.handleComplex(task, parallel);

    // Валидация через Validator (дешёвый!)
    const validation = await orchestrator.execute('haiku-3.5', [
      {
        role: 'system',
        content: 'Ты валидатор. Проверь соответствие протоколам и метакогнитивным правилам.',
      },
      {
        role: 'user',
        content: `Проверь это решение:\n${JSON.stringify(analysis, null, 2)}\n\nСоответствует ли протоколам?`,
      },
    ]);

    return {
      ...analysis,
      validation: validation.content,
      validated: true,
    };
  }

  /**
   * Выбрать самый дешёвый агент для задачи
   */
  selectCheapestAgent(task) {
    const taskLower = task.toLowerCase();

    // Быстрая валидация → Validator (Haiku) - $0.00025/M
    if (taskLower.includes('validate') || taskLower.includes('check') || taskLower.includes('verify')) {
      return { name: 'validator', model: 'haiku-3.5', role: 'Validation, quick checks' };
    }

    // Генерация кода → Coder (DeepSeek) - $0.00014/M
    if (taskLower.includes('code') || taskLower.includes('implement') || taskLower.includes('create component')) {
      return { name: 'coder', model: 'deepseek-v3', role: 'Code generation' };
    }

    // Быстрый анализ → Fast (Gemini) - $0.000125/M
    if (taskLower.includes('quick') || taskLower.includes('fast') || taskLower.includes('simple analysis')) {
      return { name: 'fast', model: 'gemini-2.5-pro', role: 'Fast tasks' };
    }

    // Длинный контекст → Reasoner (Kimi) - $0.55/M (дешёво для 200k!)
    if (taskLower.includes('analyze') && taskLower.includes('long') || taskLower.includes('200k')) {
      return { name: 'reasoner', model: 'kimi-2k', role: 'Deep reasoning' };
    }

    // По умолчанию → Fast (Gemini) - самое дешёвое!
    return { name: 'fast', model: 'gemini-2.5-pro', role: 'Fast tasks' };
  }

  /**
   * Оценить стоимость запроса
   */
  estimateCost(model, usage) {
    if (!usage) return 0;

    const costs = {
      'haiku-3.5': { input: 0.00025, output: 0.00125 },
      'deepseek-v3': { input: 0.00014, output: 0.00028 },
      'gemini-2.5-pro': { input: 0.000125, output: 0.0005 },
      'kimi-2k': { input: 0.001, output: 0.002 },
      'claude-3.7-sonnet': { input: 0.003, output: 0.015 },
      'o1-mini': { input: 0.003, output: 0.012 },
    };

    const modelCost = costs[model] || { input: 0.001, output: 0.002 };
    const cost = (usage.prompt_tokens / 1000000) * modelCost.input +
                 (usage.completion_tokens / 1000000) * modelCost.output;

    return cost;
  }

  /**
   * Получить ключ кэша
   */
  getCacheKey(task) {
    // Простой хэш задачи
    return `task_${task.substring(0, 50).replace(/\s/g, '_')}`;
  }

  /**
   * Получить статистику
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      cacheHitRate: this.stats.cacheHits / Math.max(this.stats.totalCalls, 1),
    };
  }

  /**
   * Очистить кэш
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️  Cache cleared');
  }
}

export const smartOrchestrator = new SmartOrchestrator();

