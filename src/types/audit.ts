import type { Persona } from "./persona";

export type AuditActionType =
  | "provider_change"
  | "persona_change"
  | "environment_change"
  | "feature_access";

export interface AuditEntry {
  id: string;
  type: AuditActionType;
  actor: Persona;
  summary: string;
  details?: string;
  timestamp: string;
}
