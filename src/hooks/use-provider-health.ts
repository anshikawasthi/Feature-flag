"use client";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

/** Exposes the active provider's simulated/real health snapshot, reactive to provider switches. */
export function useProviderHealth() {
  // Re-read whenever the selected provider id or OpenFeature's status changes so consumers re-render.
  useSettingsStore((s) => s.provider);
  useProviderVersion();
  return featureFlagService.getHealth();
}
