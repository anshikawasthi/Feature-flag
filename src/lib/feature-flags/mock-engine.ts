import type { ConfigValue, FlagDefinition } from "@/types/flag";
import type { Environment } from "@/types/environment";
import type { Persona } from "@/types/persona";
import type { FlagOverride } from "./types";

export interface EvalState {
  persona: Persona;
  environment: Environment;
}

/**
 * Small, fast, deterministic string hash (djb2 variant). Used to bucket a
 * flag+context seed into a stable 0-99 range so rollout percentages and
 * variant selection behave consistently across renders/reloads instead of
 * being randomized on every call.
 */
export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

export function bucketOf(seed: string): number {
  return hashString(seed) % 100;
}

/** Resolves a single flag's raw boolean value (before dependency cascading). */
export function resolveBooleanValue(
  def: FlagDefinition,
  override: FlagOverride | undefined,
  state: EvalState
): boolean {
  if (override?.enabled !== undefined) return override.enabled;

  if (def.category === "kill-switch") {
    return def.defaultValue ?? false;
  }

  if (def.category === "role-targeting") {
    return def.roleTargeting?.includes(state.persona) ?? false;
  }

  if (def.category === "percentage-rollout") {
    const percentage = override?.rolloutPercentage ?? def.rolloutPercentage ?? 0;
    const bucket = bucketOf(`${def.key}:${state.persona}:${state.environment}`);
    return bucket < percentage;
  }

  return def.defaultValue ?? false;
}

/** Deterministically selects a variant for multivariate/experiment flags. */
export function resolveVariant(
  def: FlagDefinition,
  override: FlagOverride | undefined,
  state: EvalState
): string {
  if (override?.variant) return override.variant;
  if (!def.variants || def.variants.length === 0) return def.defaultVariant ?? "";

  const totalWeight = def.variants.reduce((sum, v) => sum + (v.weight ?? 100 / def.variants!.length), 0);
  const bucket = bucketOf(`${def.key}:${state.persona}:${state.environment}:variant`);
  const target = (bucket / 100) * totalWeight;

  let cumulative = 0;
  for (const variant of def.variants) {
    cumulative += variant.weight ?? 100 / def.variants.length;
    if (target < cumulative) return variant.key;
  }
  return def.defaultVariant ?? def.variants[0].key;
}

export function resolveConfigValue(
  def: FlagDefinition,
  override: FlagOverride | undefined
): ConfigValue {
  if (override?.configValue !== undefined) return override.configValue;
  return def.configValue ?? 0;
}
