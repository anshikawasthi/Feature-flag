import type { ConfigValue } from "@/types/flag";
import type { ProviderHealth, ProviderId } from "@/types/provider";

/**
 * Core abstraction every feature flag vendor integration must implement.
 * UI code must only ever depend on this interface (via the FeatureFlagContext
 * and its hooks), never on a concrete vendor SDK.
 */
export interface FeatureProvider {
  readonly id: ProviderId;
  initialize(): Promise<void>;
  getFlag(flagKey: string): boolean;
  getVariant(flagKey: string): string;
  getConfig<T = ConfigValue>(flagKey: string): T;
  /** All flag keys known to this provider (drives the Feature Flag Dashboard). */
  getAllFlagKeys(): string[];
  /** Current mock/real health snapshot, used by the Provider Health page. */
  getHealth(): ProviderHealth;
  /** True when real vendor credentials were detected in the environment. */
  isConfigured(): boolean;
}

export interface FlagOverride {
  enabled?: boolean;
  variant?: string;
  rolloutPercentage?: number;
  configValue?: ConfigValue;
}

export type FlagOverridesMap = Record<string, FlagOverride>;
