"use client";

import { useEffect, useMemo, useRef } from "react";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { useAnalyticsStore } from "@/store/analytics-store";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

/** Evaluates a multivariate/experiment flag's active variant and records a `variant_selected` event. */
export function useVariant(flagKey: string): string {
  const version = useProviderVersion();
  const persona = useSettingsStore((s) => s.persona);
  const environment = useSettingsStore((s) => s.environment);
  const providerId = useSettingsStore((s) => s.provider);
  const overrides = useFlagOverridesStore((s) => s.overrides);
  const trackEvent = useAnalyticsStore((s) => s.trackEvent);

  const variant = useMemo(
    () => featureFlagService.getVariant(flagKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flagKey, persona, environment, overrides, version]
  );

  const lastTracked = useRef<string | null>(null);
  useEffect(() => {
    const trackKey = `${flagKey}:${variant}:${persona}:${environment}`;
    if (lastTracked.current === trackKey) return;
    lastTracked.current = trackKey;
    trackEvent({
      type: "variant_selected",
      flagKey,
      variant,
      label: `${FLAG_MAP[flagKey]?.name ?? flagKey} selected variant "${variant}"`,
      persona,
      provider: providerId,
      environment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagKey, variant, persona, environment, providerId]);

  return variant;
}
