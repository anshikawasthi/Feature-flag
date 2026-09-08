import { OpenFeature } from "@openfeature/web-sdk";
import { UnleashWebProvider } from "@openfeature/unleash-web-provider";

import type { ConfigValue } from "@/types/flag";
import type { ProviderHealth } from "@/types/provider";
import { useSettingsStore } from "@/store/settings-store";
import { FLAG_CATALOG, FLAG_MAP } from "./catalog";
import { resolveBooleanValue, resolveConfigValue, resolveVariant } from "./mock-engine";
import { getActiveOverrideProvider, getActiveProviderInfo } from "./openfeature/bootstrap";

function currentIdentity() {
  const { persona, environment } = useSettingsStore.getState();
  return { persona, environment };
}

function catalogBooleanDefault(flagKey: string): boolean {
  const def = FLAG_MAP[flagKey];
  if (!def) return false;
  try {
    return resolveBooleanValue(def, undefined, currentIdentity());
  } catch {
    return def.defaultValue ?? false;
  }
}

function catalogVariantDefault(flagKey: string): string {
  const def = FLAG_MAP[flagKey];
  if (!def) return "";
  try {
    return resolveVariant(def, undefined, currentIdentity());
  } catch {
    return def.defaultVariant ?? "";
  }
}

function catalogConfigDefault(flagKey: string): number {
  const def = FLAG_MAP[flagKey];
  if (!def) return 0;
  try {
    const value = Number(resolveConfigValue(def, undefined));
    return Number.isNaN(value) ? 0 : value;
  } catch {
    return Number(def.configValue ?? 0);
  }
}

/**
 * The single entry point application/business code uses to read feature flags.
 * Internally wraps `OpenFeature.getClient()`. Every method is defensive: if
 * OpenFeature itself throws (should not happen in normal operation, but a
 * misbehaving provider could), it falls back to the local catalog's
 * deterministic default rather than letting the error surface to the UI.
 */
export const featureFlagService = {
  getBooleanFlag(flagKey: string): boolean {
    const fallback = catalogBooleanDefault(flagKey);
    try {
      return OpenFeature.getClient().getBooleanValue(flagKey, fallback);
    } catch {
      return fallback;
    }
  },

  getVariant(flagKey: string): string {
    const fallback = catalogVariantDefault(flagKey);
    try {
      return OpenFeature.getClient().getStringValue(flagKey, fallback);
    } catch {
      return fallback;
    }
  },

  getConfigValue<T = ConfigValue>(flagKey: string): T {
    const fallback = catalogConfigDefault(flagKey);
    try {
      return OpenFeature.getClient().getNumberValue(flagKey, fallback) as unknown as T;
    } catch {
      return fallback as unknown as T;
    }
  },

  /** All flag keys known to the local catalog (drives the Feature Flag Dashboard). */
  getAllFlagKeys(): string[] {
    return FLAG_CATALOG.map((f) => f.key);
  },

  /** True when the active provider has real vendor credentials configured (not falling back to the mock engine). */
  isConfigured(): boolean {
    return getActiveProviderInfo()?.configured ?? false;
  },

  /** Current health snapshot for the active provider, used by the Provider Health page. */
  getHealth(): ProviderHealth {
    const info = getActiveProviderInfo();
    if (!info) {
      return {
        providerId: "local-mock",
        status: "healthy",
        latencyMs: 0,
        lastSyncedAt: new Date().toISOString(),
        cacheStatus: "fresh",
        configured: true,
      };
    }
    return {
      providerId: info.providerId,
      status: !info.healthy ? "down" : info.configured || info.providerId === "local-mock" ? "healthy" : "degraded",
      latencyMs: info.latencyMs,
      lastSyncedAt: info.readyAt,
      cacheStatus: info.healthy ? "fresh" : "cold",
      configured: info.configured,
    };
  },

  /**
   * The subset of flag keys the *remote* vendor project actually has defined
   * right now (as opposed to `getAllFlagKeys()`, which always returns the
   * full local catalog). Returns `null` when the active provider doesn't
   * support this introspection (mock provider, LaunchDarkly/Flagsmith, or a
   * real provider not currently connected).
   */
  getRemoteFlagKeys(): string[] | null {
    const inner = getActiveOverrideProvider()?.getInner();
    if (!(inner instanceof UnleashWebProvider) || !getActiveProviderInfo()?.configured) return null;
    try {
      return inner.unleashClient?.getAllToggles().map((t) => t.name) ?? null;
    } catch {
      return null;
    }
  },
};
