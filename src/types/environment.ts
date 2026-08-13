export type Environment = "development" | "qa" | "staging" | "production";

export interface EnvironmentMeta {
  id: Environment;
  label: string;
}

export const ENVIRONMENTS: EnvironmentMeta[] = [
  { id: "development", label: "Development" },
  { id: "qa", label: "QA" },
  { id: "staging", label: "Staging" },
  { id: "production", label: "Production" },
];
