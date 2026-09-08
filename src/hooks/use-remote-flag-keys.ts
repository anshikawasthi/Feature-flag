"use client";

import { useMemo } from "react";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

/**
 * The set of flag keys actually defined in the active provider's remote
 * project (e.g. via Unleash's `getAllToggles()`). Returns `null` when the
 * active provider doesn't support this introspection or isn't connected to a
 * real backend right now (mock provider, or real provider unconfigured).
 */
export function useRemoteFlagKeys(): string[] | null {
  const providerId = useSettingsStore((s) => s.provider);
  const version = useProviderVersion();

  return useMemo(
    () => featureFlagService.getRemoteFlagKeys(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providerId, version]
  );
}
