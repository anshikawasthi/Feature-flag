export type ProviderId =
  | "local-mock"
  | "launchdarkly"
  | "unleash"
  | "flagsmith";

export interface ProviderMeta {
  id: ProviderId;
  name: string;
  vendor: string;
  requiresEnvVar?: string;
}

export const PROVIDERS: ProviderMeta[] = [
  { id: "local-mock", name: "Local Mock", vendor: "Local" },
  {
    id: "launchdarkly",
    name: "LaunchDarkly",
    vendor: "LaunchDarkly",
    requiresEnvVar: "NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID",
  },
  {
    id: "unleash",
    name: "Unleash",
    vendor: "Unleash",
    requiresEnvVar: "NEXT_PUBLIC_UNLEASH_PROXY_URL",
  },
  {
    id: "flagsmith",
    name: "Flagsmith",
    vendor: "Flagsmith",
    requiresEnvVar: "NEXT_PUBLIC_FLAGSMITH_ENV_ID",
  },
];

export type ProviderStatusLevel = "healthy" | "degraded" | "down";
export type CacheStatus = "fresh" | "stale" | "cold";

export interface ProviderHealth {
  providerId: ProviderId;
  status: ProviderStatusLevel;
  latencyMs: number;
  lastSyncedAt: string;
  cacheStatus: CacheStatus;
  configured: boolean;
}
