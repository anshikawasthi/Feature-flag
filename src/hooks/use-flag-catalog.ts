"use client";

import { useMemo } from "react";

import { useProviderVersion } from "@/context/feature-flag-context";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { FLAG_CATALOG } from "@/lib/feature-flags/catalog";
import type { FlagDefinition } from "@/types/flag";
import { featureFlagService } from "@/lib/feature-flags/feature-flag-service";

export interface EvaluatedFlag {
  definition: FlagDefinition;
  enabled: boolean;
  variant: string | null;
  configValue: string | number | null;
  overridden: boolean;
}

/** Evaluates the entire flag catalog through OpenFeature for table/dashboard views. */
export function useFlagCatalog(): EvaluatedFlag[] {
  const version = useProviderVersion();
  const persona = useSettingsStore((s) => s.persona);
  const environment = useSettingsStore((s) => s.environment);
  const overrides = useFlagOverridesStore((s) => s.overrides);

  return useMemo(
    () =>
      FLAG_CATALOG.map((definition) => {
        const isMultivariate =
          definition.type === "multivariate" || definition.type === "experiment";
        const isConfig = definition.type === "config";
        return {
          definition,
          enabled: isConfig ? true : featureFlagService.getBooleanFlag(definition.key),
          variant: isMultivariate ? featureFlagService.getVariant(definition.key) : null,
          configValue: isConfig ? featureFlagService.getConfigValue(definition.key) : null,
          overridden: Boolean(overrides[definition.key]),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [persona, environment, overrides, version]
  );
}
