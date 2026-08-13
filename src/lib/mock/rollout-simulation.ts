import { hashString } from "@/lib/feature-flags/mock-engine";
import type { Environment } from "@/types/environment";
import type { Persona } from "@/types/persona";

export interface RolloutSimulationResult {
  totalUsers: number;
  inRollout: number;
  outOfRollout: number;
  percentage: number;
}

/**
 * Simulates a rollout over N synthetic users using the same consistent-hash
 * bucketing approach real feature flag platforms use, so the reported
 * "in rollout" count converges toward the requested percentage as the user
 * count grows.
 */
export function simulateRollout(
  flagKey: string,
  userCount: number,
  percentage: number,
  environment: Environment,
  persona: Persona
): RolloutSimulationResult {
  let inRollout = 0;
  for (let i = 0; i < userCount; i++) {
    const bucket = hashString(`${flagKey}:${environment}:${persona}:sim-user-${i}`) % 100;
    if (bucket < percentage) inRollout++;
  }
  return {
    totalUsers: userCount,
    inRollout,
    outOfRollout: userCount - inRollout,
    percentage,
  };
}

export const ROLLOUT_PERCENTAGE_PRESETS = [5, 10, 25, 50, 100];
