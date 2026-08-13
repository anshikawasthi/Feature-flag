"use client";

import { useSettingsStore } from "@/store/settings-store";

/** Convenience hook exposing persona/provider/environment plus their setters. */
export function useAppSettings() {
  const persona = useSettingsStore((s) => s.persona);
  const provider = useSettingsStore((s) => s.provider);
  const environment = useSettingsStore((s) => s.environment);
  const setPersona = useSettingsStore((s) => s.setPersona);
  const setProvider = useSettingsStore((s) => s.setProvider);
  const setEnvironment = useSettingsStore((s) => s.setEnvironment);

  return {
    persona,
    provider,
    environment,
    setPersona,
    setProvider,
    setEnvironment,
  };
}
