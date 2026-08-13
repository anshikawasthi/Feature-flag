import { FLAG_CATALOG, FLAG_MAP } from "../catalog";
import {
  resolveBooleanValue,
  resolveConfigValue,
  resolveVariant,
  type EvalState,
} from "../mock-engine";
import type { FeatureProvider } from "../types";
import type { ConfigValue } from "@/types/flag";
import type { ProviderHealth, ProviderId } from "@/types/provider";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";

/**
 * Fully-featured provider backed entirely by the local deterministic mock
 * engine + Zustand override store. This is the default provider and lets
 * the whole application run with zero external accounts.
 */
export class LocalMockProvider implements FeatureProvider {
  readonly id: ProviderId = "local-mock";
  private initializedAt: string | null = null;

  async initialize(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    this.initializedAt = new Date().toISOString();
  }

  protected state(): EvalState {
    const { persona, environment } = useSettingsStore.getState();
    return { persona, environment };
  }

  protected resolveBoolean(flagKey: string): boolean {
    const def = FLAG_MAP[flagKey];
    if (!def) return false;
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    let value = resolveBooleanValue(def, override, this.state());
    if (def.dependsOn) {
      value = value && this.resolveBoolean(def.dependsOn);
    }
    return value;
  }

  getFlag(flagKey: string): boolean {
    return this.resolveBoolean(flagKey);
  }

  getVariant(flagKey: string): string {
    const def = FLAG_MAP[flagKey];
    if (!def) return "";
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    return resolveVariant(def, override, this.state());
  }

  getConfig<T = ConfigValue>(flagKey: string): T {
    const def = FLAG_MAP[flagKey];
    if (!def) return undefined as unknown as T;
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    return resolveConfigValue(def, override) as unknown as T;
  }

  getAllFlagKeys(): string[] {
    return FLAG_CATALOG.map((f) => f.key);
  }

  getHealth(): ProviderHealth {
    return {
      providerId: this.id,
      status: "healthy",
      latencyMs: 4,
      lastSyncedAt: this.initializedAt ?? new Date().toISOString(),
      cacheStatus: "fresh",
      configured: true,
    };
  }

  isConfigured(): boolean {
    return true;
  }
}
