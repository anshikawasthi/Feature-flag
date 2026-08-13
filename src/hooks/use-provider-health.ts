"use client";

import { useFeatureFlagProvider } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";

/** Exposes the active provider's simulated/real health snapshot, reactive to provider switches. */
export function useProviderHealth() {
  const provider = useFeatureFlagProvider();
  // Re-read whenever the selected provider id changes so consumers re-render.
  useSettingsStore((s) => s.provider);
  return provider.getHealth();
}
