"use client";

import { useMemo } from "react";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import type { ConfigValue } from "@/types/flag";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

/** Reads a dynamic configuration value through OpenFeature. */
export function useConfig<T = ConfigValue>(flagKey: string): T {
  const version = useProviderVersion();
  const environment = useSettingsStore((s) => s.environment);
  const overrides = useFlagOverridesStore((s) => s.overrides);

  return useMemo(
    () => featureFlagService.getConfigValue<T>(flagKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flagKey, environment, overrides, version]
  );
}
