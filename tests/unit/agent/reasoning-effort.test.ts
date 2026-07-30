import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REASONING_EFFORT,
  normalizeReasoningEffortSelection,
  reasoningEffortLabel,
  reasoningEffortOptions,
  resolveReasoningEffortArg,
} from '../../../src/agent/reasoning-effort';

describe('Codex reasoning effort', () => {
  it('offers the full interactive effort catalog led by the default sentinel', () => {
    const values = reasoningEffortOptions().map((option) => option.value);
    expect(values[0]).toBe(DEFAULT_REASONING_EFFORT);
    expect(values).toEqual([
      'default',
      'low',
      'medium',
      'high',
      'xhigh',
      'max',
      'ultra',
    ]);
  });

  it('normalizes invalid persisted values to the default selection', () => {
    expect(normalizeReasoningEffortSelection(undefined)).toBe(DEFAULT_REASONING_EFFORT);
    expect(normalizeReasoningEffortSelection('turbo')).toBe(DEFAULT_REASONING_EFFORT);
    expect(normalizeReasoningEffortSelection('high')).toBe('high');
  });

  it('only forwards an explicit effort for Codex', () => {
    expect(resolveReasoningEffortArg('codex', 'high')).toBe('high');
    expect(resolveReasoningEffortArg('codex', DEFAULT_REASONING_EFFORT)).toBeUndefined();
    expect(resolveReasoningEffortArg('claude', 'high')).toBeUndefined();
  });

  it('renders human-facing labels for saved cards', () => {
    expect(reasoningEffortLabel('high')).toBe('High');
    expect(reasoningEffortLabel(undefined)).toContain('跟随默认');
  });
});
