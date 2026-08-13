import type { ProviderHealth, ProviderId } from "@/types/provider";
import { PROVIDERS } from "@/types/provider";

function isEnvConfigured(providerId: ProviderId): boolean {
  switch (providerId) {
    case "launchdarkly":
      return Boolean(process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID);
    case "unleash":
      return Boolean(
        process.env.NEXT_PUBLIC_UNLEASH_PROXY_URL &&
          process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY
      );
    case "flagsmith":
      return Boolean(process.env.NEXT_PUBLIC_FLAGSMITH_ENV_ID);
    case "local-mock":
    default:
      return true;
  }
}

/** Simulated health snapshot for a provider, used by the Provider Health page for at-a-glance status across all vendors (not just the active one). */
export function getSimulatedHealthSnapshot(providerId: ProviderId): ProviderHealth {
  const configured = isEnvConfigured(providerId);
  const isLocal = providerId === "local-mock";

  const baseLatency = isLocal ? 2 : configured ? 55 : 0;
  const jitter = isLocal ? Math.random() * 3 : configured ? Math.random() * 45 : Math.random() * 4;

  return {
    providerId,
    status: isLocal || configured ? "healthy" : "degraded",
    latencyMs: Math.round(baseLatency + jitter),
    lastSyncedAt: new Date(Date.now() - Math.round(Math.random() * 45_000)).toISOString(),
    cacheStatus: isLocal ? "fresh" : configured ? "fresh" : "cold",
    configured: isLocal || configured,
  };
}

export function getAllSimulatedHealth(): ProviderHealth[] {
  return PROVIDERS.map((p) => getSimulatedHealthSnapshot(p.id));
}
