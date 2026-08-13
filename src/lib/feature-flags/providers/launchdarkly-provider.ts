import { LocalMockProvider } from "./local-mock-provider";
import type { ProviderHealth, ProviderId } from "@/types/provider";
import type { ConfigValue } from "@/types/flag";
import { useSettingsStore } from "@/store/settings-store";

interface MinimalLDClient {
  variation: (key: string, defaultValue: unknown) => unknown;
  waitForInitialization: (timeoutSeconds?: number) => Promise<void>;
}

/**
 * Real LaunchDarkly wiring via `launchdarkly-js-client-sdk`, dynamically
 * imported so it never affects bundle size / behavior unless a client ID is
 * configured. Falls back to the shared mock engine (inherited from
 * LocalMockProvider) whenever no client ID is present or initialization
 * fails, so the app behaves identically to Local Mock out of the box.
 */
export class LaunchDarklyProvider extends LocalMockProvider {
  readonly id: ProviderId = "launchdarkly";
  private client: MinimalLDClient | null = null;
  private configured = false;
  private latencyMs = 0;
  private lastSyncedAt: string | null = null;

  async initialize(): Promise<void> {
    const start = Date.now();
    const clientId = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;

    if (!clientId) {
      await super.initialize();
      this.configured = false;
      this.latencyMs = Date.now() - start;
      this.lastSyncedAt = new Date().toISOString();
      return;
    }

    try {
      const ld = await import("launchdarkly-js-client-sdk");
      const { persona } = useSettingsStore.getState();
      const client = ld.initialize(clientId, {
        kind: "user",
        key: persona,
      }) as unknown as MinimalLDClient;
      await client.waitForInitialization(5);
      this.client = client;
      this.configured = true;
    } catch {
      this.client = null;
      this.configured = false;
      await super.initialize();
    }

    this.latencyMs = Date.now() - start;
    this.lastSyncedAt = new Date().toISOString();
  }

  getFlag(flagKey: string): boolean {
    if (this.client) {
      try {
        return Boolean(this.client.variation(flagKey, super.getFlag(flagKey)));
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getFlag(flagKey);
  }

  getVariant(flagKey: string): string {
    if (this.client) {
      try {
        return String(this.client.variation(flagKey, super.getVariant(flagKey)));
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getVariant(flagKey);
  }

  getConfig<T = ConfigValue>(flagKey: string): T {
    if (this.client) {
      try {
        return this.client.variation(flagKey, super.getConfig<T>(flagKey)) as T;
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getConfig<T>(flagKey);
  }

  getHealth(): ProviderHealth {
    return {
      providerId: this.id,
      status: this.configured ? "healthy" : "degraded",
      latencyMs: this.latencyMs,
      lastSyncedAt: this.lastSyncedAt ?? new Date().toISOString(),
      cacheStatus: this.configured ? "fresh" : "cold",
      configured: this.configured,
    };
  }

  isConfigured(): boolean {
    return this.configured;
  }
}
