import { describe, expect, it, vi } from 'vitest';
import { calculateExpression, requestAIAssist } from './api.js';

describe('API themed errors', () => {
  it('throws backend themed calculation errors', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, json: async () => ({ detail: { code: 'DIVIDE_BY_ZERO', message: 'Singularity detected' } }) }));
    await expect(calculateExpression('1/0')).rejects.toThrow(/Singularity/);
  });

  it('throws fallback AI not configured themed errors', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, json: async () => ({ detail: { code: 'AI_NOT_CONFIGURED' } }) }));
    await expect(requestAIAssist('two plus two')).rejects.toThrow(/Neural uplink offline/);
  });
});
