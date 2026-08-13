import type { Persona } from "./persona";

export type FlagCategory =
  | "boolean"
  | "role-targeting"
  | "percentage-rollout"
  | "multivariate"
  | "dynamic-config"
  | "experimentation"
  | "kill-switch";

export type FlagType =
  | "boolean"
  | "multivariate"
  | "rollout"
  | "config"
  | "experiment"
  | "killswitch";

export interface VariantDefinition {
  key: string;
  label: string;
  weight?: number;
}

export type ConfigValue = string | number;

export interface FlagDefinition {
  key: string;
  name: string;
  description: string;
  category: FlagCategory;
  type: FlagType;
  /** Default boolean value used by boolean/role-targeting/kill-switch flags */
  defaultValue?: boolean;
  /** Variant keys available for multivariate/experiment flags */
  variants?: VariantDefinition[];
  /** Default active variant */
  defaultVariant?: string;
  /** Default rollout percentage for percentage-rollout flags */
  rolloutPercentage?: number;
  /** Personas that gain access via role targeting */
  roleTargeting?: Persona[];
  /** Key of another flag this flag depends on being enabled */
  dependsOn?: string;
  /** Default config value for dynamic-config flags */
  configValue?: ConfigValue;
  /** Unit label for dynamic-config flags, e.g. "ms", "items", "sec" */
  unit?: string;
  /** Min/max bounds for dynamic-config flags (used by Dynamic Configuration Lab sliders) */
  configRange?: { min: number; max: number; step?: number };
}
