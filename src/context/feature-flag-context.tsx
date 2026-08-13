"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { FeatureProvider } from "@/lib/feature-flags/types";
import { createProvider } from "@/lib/feature-flags/provider-factory";
import { useSettingsStore } from "@/store/settings-store";
import { PROVIDERS } from "@/types/provider";

interface FeatureFlagContextValue {
  provider: FeatureProvider;
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

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const providerId = useSettingsStore((s) => s.provider);
  const [provider, setProvider] = useState<FeatureProvider | null>(null);

  useEffect(() => {
    let cancelled = false;
    const instance = createProvider(providerId);
    instance.initialize().finally(() => {
      if (!cancelled) setProvider(instance);
    });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  // While switching providers, `provider` still holds the previous instance for one tick —
  // only treat it as ready once its id matches the currently selected providerId.
  const isReady = provider != null && provider.id === providerId;

  if (!isReady) {
    const meta = PROVIDERS.find((p) => p.id === providerId);
    return <InitializingScreen providerName={meta?.name ?? providerId} />;
  }

  return (
    <FeatureFlagContext.Provider value={{ provider: provider! }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagProvider(): FeatureProvider {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error(
      "useFeatureFlagProvider must be used within <FeatureFlagProvider>"
    );
  }
  return ctx.provider;
}
