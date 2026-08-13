import { LocalMockProvider } from "./local-mock-provider";
import type { ProviderHealth, ProviderId } from "@/types/provider";
import type { ConfigValue } from "@/types/flag";

interface MinimalFlagsmithClient {
  init: (config: { environmentID: string }) => Promise<void>;
  hasFeature: (key: string) => boolean;
  getValue: (key: string) => string | number | boolean | null;
}

/**
 * Real Flagsmith wiring via the `flagsmith` package, dynamically imported.
 * Falls back to the shared mock engine when no environment ID is configured
 * or initialization fails.
 */
export class FlagsmithProvider extends LocalMockProvider {
  readonly id: ProviderId = "flagsmith";
  private client: MinimalFlagsmithClient | null = null;
  private configured = false;
  private latencyMs = 0;
  private lastSyncedAt: string | null = null;

  async initialize(): Promise<void> {
    const start = Date.now();
    const environmentID = process.env.NEXT_PUBLIC_FLAGSMITH_ENV_ID;

    if (!environmentID) {
      await super.initialize();
      this.configured = false;
      this.latencyMs = Date.now() - start;
      this.lastSyncedAt = new Date().toISOString();
      return;
    }

    try {
      const mod = await import("flagsmith");
      const flagsmith = mod.default as unknown as MinimalFlagsmithClient;
      await flagsmith.init({ environmentID });
      this.client = flagsmith;
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
        return this.client.hasFeature(flagKey);
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getFlag(flagKey);
  }

  getVariant(flagKey: string): string {
    if (this.client) {
      try {
        const value = this.client.getValue(flagKey);
        if (value !== null && value !== undefined) return String(value);
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getVariant(flagKey);
  }

  getConfig<T = ConfigValue>(flagKey: string): T {
    if (this.client) {
      try {
        const value = this.client.getValue(flagKey);
        if (value !== null && value !== undefined) return value as unknown as T;
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
