import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FlagOverride, FlagOverridesMap } from "@/lib/feature-flags/types";

interface FlagOverridesState {
  overrides: FlagOverridesMap;
  setOverride: (flagKey: string, override: Partial<FlagOverride>) => void;
  clearOverride: (flagKey: string) => void;
  clearAll: () => void;
}

export const useFlagOverridesStore = create<FlagOverridesState>()(
  persist(
    (set) => ({
      overrides: {},
      setOverride: (flagKey, override) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [flagKey]: { ...state.overrides[flagKey], ...override },
          },
        })),
      clearOverride: (flagKey) =>
        set((state) => {
          const next = { ...state.overrides };
          delete next[flagKey];
          return { overrides: next };
        }),
      clearAll: () => set({ overrides: {} }),
    }),
    { name: "nexus-flag-overrides" }
  )
);
