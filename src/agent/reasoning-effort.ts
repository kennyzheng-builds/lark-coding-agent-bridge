import type { AgentKind } from '../config/profile-schema';

/** Picker sentinel meaning "let Codex use its own configured default". */
export const DEFAULT_REASONING_EFFORT = 'default';

export const MODEL_REASONING_EFFORTS = [
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
  'ultra',
] as const;

export type ModelReasoningEffort = (typeof MODEL_REASONING_EFFORTS)[number];
export type ReasoningEffortSelection =
  | typeof DEFAULT_REASONING_EFFORT
  | ModelReasoningEffort;

export interface ReasoningEffortOption {
  value: ReasoningEffortSelection;
  label: string;
}

const REASONING_EFFORT_OPTIONS: ReasoningEffortOption[] = [
  { value: DEFAULT_REASONING_EFFORT, label: '跟随默认（不指定）' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'xhigh', label: 'XHigh' },
  { value: 'max', label: 'Max' },
  { value: 'ultra', label: 'Ultra' },
];

export function reasoningEffortOptions(): ReasoningEffortOption[] {
  return REASONING_EFFORT_OPTIONS;
}

export function isModelReasoningEffort(value: unknown): value is ModelReasoningEffort {
  return MODEL_REASONING_EFFORTS.includes(value as ModelReasoningEffort);
}

export function isReasoningEffortSelection(
  value: unknown,
): value is ReasoningEffortSelection {
  return value === DEFAULT_REASONING_EFFORT || isModelReasoningEffort(value);
}

export function normalizeReasoningEffortSelection(
  value: unknown,
): ReasoningEffortSelection {
  return isReasoningEffortSelection(value) ? value : DEFAULT_REASONING_EFFORT;
}

/** Claude has no bridge-level effort override; only Codex receives this value. */
export function resolveReasoningEffortArg(
  agentKind: AgentKind,
  value: unknown,
): ModelReasoningEffort | undefined {
  if (agentKind !== 'codex') return undefined;
  const normalized = normalizeReasoningEffortSelection(value);
  return normalized === DEFAULT_REASONING_EFFORT ? undefined : normalized;
}

export function reasoningEffortLabel(value: unknown): string {
  const normalized = normalizeReasoningEffortSelection(value);
  return (
    REASONING_EFFORT_OPTIONS.find((option) => option.value === normalized)?.label ??
    normalized
  );
}
