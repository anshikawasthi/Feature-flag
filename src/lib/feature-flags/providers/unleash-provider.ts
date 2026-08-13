import { LocalMockProvider } from "./local-mock-provider";
import type { ProviderHealth, ProviderId } from "@/types/provider";
import type { ConfigValue } from "@/types/flag";

interface MinimalUnleashClient {
  start: () => Promise<void>;
  isEnabled: (key: string) => boolean;
  getVariant: (key: string) => { name: string; enabled: boolean; payload?: { value?: string } };
}

/**
 * Real Unleash wiring via `unleash-proxy-client`, dynamically imported.
 * Falls back to the shared mock engine when the proxy URL/client key are not
 * configured or the proxy is unreachable.
 */
export class UnleashProvider extends LocalMockProvider {
  readonly id: ProviderId = "unleash";
  private client: MinimalUnleashClient | null = null;
  private configured = false;
  private latencyMs = 0;
  private lastSyncedAt: string | null = null;

  async initialize(): Promise<void> {
    const start = Date.now();
    const url = process.env.NEXT_PUBLIC_UNLEASH_PROXY_URL;
    const clientKey = process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY;

    if (!url || !clientKey) {
      await super.initialize();
      this.configured = false;
      this.latencyMs = Date.now() - start;
      this.lastSyncedAt = new Date().toISOString();
      return;
    }

    try {
      const { UnleashClient } = await import("unleash-proxy-client");
      const client = new UnleashClient({
        url,
        clientKey,
        appName: "nexus-enterprise",
      }) as unknown as MinimalUnleashClient;
      await client.start();
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
        return this.client.isEnabled(flagKey);
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getFlag(flagKey);
  }

  getVariant(flagKey: string): string {
    if (this.client) {
      try {
        const variant = this.client.getVariant(flagKey);
        if (variant?.name && variant.name !== "disabled") return variant.name;
      } catch {
        /* fall through to mock engine */
      }
    }
    return super.getVariant(flagKey);
  }

  getConfig<T = ConfigValue>(flagKey: string): T {
    if (this.client) {
      try {
        const variant = this.client.getVariant(flagKey);
        const raw = variant?.payload?.value;
        if (raw !== undefined) {
          const numeric = Number(raw);
          return (Number.isNaN(numeric) ? raw : numeric) as unknown as T;
        }
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
