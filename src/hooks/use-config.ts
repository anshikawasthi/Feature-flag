"use client";

import { useMemo } from "react";

import { useFeatureFlagProvider } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import type { ConfigValue } from "@/types/flag";

/** Reads a dynamic configuration value through the active provider. */
export function useConfig<T = ConfigValue>(flagKey: string): T {
  const provider = useFeatureFlagProvider();
  const environment = useSettingsStore((s) => s.environment);
  const overrides = useFlagOverridesStore((s) => s.overrides);

  return useMemo(
    () => provider.getConfig<T>(flagKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, flagKey, environment, overrides]
  );
}
