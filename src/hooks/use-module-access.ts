"use client";

import { useEffect, useRef } from "react";

import { useSettingsStore } from "@/store/settings-store";
import { useAnalyticsStore } from "@/store/analytics-store";

/** Tracks a `feature_accessed` analytics event once per module/persona/environment combination per mount. */
export function useModuleAccessTracking(moduleKey: string, label: string) {
  const persona = useSettingsStore((s) => s.persona);
  const environment = useSettingsStore((s) => s.environment);
  const providerId = useSettingsStore((s) => s.provider);
  const trackEvent = useAnalyticsStore((s) => s.trackEvent);

  const lastTracked = useRef<string | null>(null);
  useEffect(() => {
    const trackKey = `${moduleKey}:${persona}:${environment}`;
    if (lastTracked.current === trackKey) return;
    lastTracked.current = trackKey;
    trackEvent({
      type: "feature_accessed",
      moduleKey,
      label,
      persona,
      provider: providerId,
      environment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, persona, environment, providerId]);
}
