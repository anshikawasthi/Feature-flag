import type { Persona } from "./persona";
import type { ProviderId } from "./provider";
import type { Environment } from "./environment";

export type AnalyticsEventType =
  | "flag_evaluated"
  | "variant_selected"
  | "experiment_viewed"
  | "feature_accessed";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  flagKey?: string;
  variant?: string;
  moduleKey?: string;
  label: string;
  persona: Persona;
  provider: ProviderId;
  environment: Environment;
  timestamp: string;
}
