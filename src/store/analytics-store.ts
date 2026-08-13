import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalyticsEvent, AnalyticsEventType } from "@/types/analytics";
import type { Persona } from "@/types/persona";
import type { ProviderId } from "@/types/provider";
import type { Environment } from "@/types/environment";

interface TrackEventInput {
  type: AnalyticsEventType;
  label: string;
  flagKey?: string;
  variant?: string;
  moduleKey?: string;
  persona: Persona;
  provider: ProviderId;
  environment: Environment;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  trackEvent: (input: TrackEventInput) => void;
  clear: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      events: [],
      trackEvent: (input) =>
        set((state) => ({
          events: [
            {
              id:
                typeof crypto !== "undefined" && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`,
              timestamp: new Date().toISOString(),
              ...input,
            },
            ...state.events,
          ].slice(0, 1000),
        })),
      clear: () => set({ events: [] }),
    }),
    { name: "nexus-analytics-events" }
  )
);
