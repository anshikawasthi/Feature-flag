"use client";

import { useAnalyticsStore } from "@/store/analytics-store";

export function useAnalyticsEvents() {
  const events = useAnalyticsStore((s) => s.events);
  const trackEvent = useAnalyticsStore((s) => s.trackEvent);
  const clear = useAnalyticsStore((s) => s.clear);
  return { events, trackEvent, clear };
}
