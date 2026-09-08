import type { ConfigValue } from "@/types/flag";

/**
 * A locally-forced value for a single flag (set via the Flag Override Editor or the
 * Kill Switch Control Center). Overrides always win over whatever the active
 * OpenFeature provider resolves — see `OverrideAwareProvider`.
 */
export interface FlagOverride {
  enabled?: boolean;
  variant?: string;
  rolloutPercentage?: number;
  configValue?: ConfigValue;
}

export type FlagOverridesMap = Record<string, FlagOverride>;
