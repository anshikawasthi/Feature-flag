"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { OpenFeature, ProviderEvents } from "@openfeature/web-sdk";

import { useSettingsStore } from "@/store/settings-store";
import { PROVIDERS } from "@/types/provider";
import { configureFeatureFlagProvider, updateEvaluationContext } from "@/lib/feature-flags/openfeature/bootstrap";

interface FeatureFlagContextValue {
  /** Bumped whenever OpenFeature reports new provider data (ready/config/context change)
   * so flag-reading hooks know to re-evaluate without a page refresh. */
  version: number;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

function InitializingScreen({ providerName }: { providerName: string }) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-background text-foreground">
      <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
      <p className="text-sm text-muted-foreground">
        Connecting to {providerName}…
      </p>
    </div>
  );
}

/**
 * Bootstraps OpenFeature on mount and whenever the selected provider changes,
 * gating rendering behind an "Initializing…" screen until the provider settles
 * (ready or errored — either way `setProviderAndWait` has resolved). This is
 * the ONLY place the OpenFeature bootstrap is invoked; everything downstream
 * (hooks, `FeatureFlagService`) just talks to the global `OpenFeature` client.
 */
export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const providerId = useSettingsStore((s) => s.provider);
  const persona = useSettingsStore((s) => s.persona);
  const environment = useSettingsStore((s) => s.environment);
  const [version, setVersion] = useState(0);
  const [readyProviderId, setReadyProviderId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    configureFeatureFlagProvider(providerId, { persona, environment }).finally(() => {
      if (!cancelled) setReadyProviderId(providerId);
    });
    return () => {
      cancelled = true;
    };
    // Only re-bootstrap when the provider itself changes — persona/environment
    // changes are pushed via `updateEvaluationContext` below instead of a full
    // provider swap. `isReady` below is derived by comparing `readyProviderId` to
    // the current `providerId`, so it already flips to false as soon as
    // `providerId` changes — no separate "reset" state update is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  const isReady = readyProviderId === providerId;

  // Keep the active provider's evaluation context (persona/environment) in sync so
  // role-targeting and rollout strategies configured in the vendor dashboard evaluate
  // correctly — providers that don't implement `onContextChange` simply ignore this.
  useEffect(() => {
    if (isReady) updateEvaluationContext({ persona, environment });
  }, [isReady, persona, environment]);

  // Subscribe to OpenFeature's own event stream (config changes pushed by a real vendor
  // SDK, e.g. Unleash re-polling, or a context reconciliation) and bump `version` so every
  // flag-reading hook re-evaluates.
  useEffect(() => {
    const client = OpenFeature.getClient();
    const bump = () => setVersion((v) => v + 1);
    client.addHandler(ProviderEvents.ConfigurationChanged, bump);
    client.addHandler(ProviderEvents.ContextChanged, bump);
    client.addHandler(ProviderEvents.Ready, bump);
    return () => {
      client.removeHandler(ProviderEvents.ConfigurationChanged, bump);
      client.removeHandler(ProviderEvents.ContextChanged, bump);
      client.removeHandler(ProviderEvents.Ready, bump);
    };
  }, []);

  if (!isReady) {
    const meta = PROVIDERS.find((p) => p.id === providerId);
    return <InitializingScreen providerName={meta?.name ?? providerId} />;
  }

  return (
    <FeatureFlagContext.Provider value={{ version }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

/** Bumps whenever the active provider reports fresh remote data — include it in any
 * flag-evaluation `useMemo` dependency array to re-evaluate on real-time updates. */
export function useProviderVersion(): number {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error("useProviderVersion must be used within <FeatureFlagProvider>");
  }
  return ctx.version;
}
