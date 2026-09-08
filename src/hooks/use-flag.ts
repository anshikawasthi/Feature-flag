"use client";

import { useEffect, useMemo, useRef } from "react";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { useAnalyticsStore } from "@/store/analytics-store";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

/** Evaluates a boolean flag through OpenFeature and records a `flag_evaluated` event. */
export function useFlag(flagKey: string): boolean {
  const version = useProviderVersion();
  const persona = useSettingsStore((s) => s.persona);
  const environment = useSettingsStore((s) => s.environment);
  const providerId = useSettingsStore((s) => s.provider);
  const overrides = useFlagOverridesStore((s) => s.overrides);
  const trackEvent = useAnalyticsStore((s) => s.trackEvent);

  const value = useMemo(
    () => featureFlagService.getBooleanFlag(flagKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flagKey, persona, environment, overrides, version]
  );

  const lastTracked = useRef<string | null>(null);
  useEffect(() => {
    const trackKey = `${flagKey}:${value}:${persona}:${environment}`;
    if (lastTracked.current === trackKey) return;
    lastTracked.current = trackKey;
    trackEvent({
      type: "flag_evaluated",
      flagKey,
      label: `${FLAG_MAP[flagKey]?.name ?? flagKey} evaluated to ${value}`,
      persona,
      provider: providerId,
      environment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagKey, value, persona, environment, providerId]);

  return value;
}
