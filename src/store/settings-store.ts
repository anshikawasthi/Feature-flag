import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Persona } from "@/types/persona";
import type { ProviderId } from "@/types/provider";
import type { Environment } from "@/types/environment";
import { useAuditLogStore } from "./audit-log-store";

interface SettingsState {
  persona: Persona;
  provider: ProviderId;
  environment: Environment;
  setPersona: (persona: Persona) => void;
  setProvider: (provider: ProviderId) => void;
  setEnvironment: (environment: Environment) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      persona: "employee",
      provider: "local-mock",
      environment: "development",
      setPersona: (persona) => {
        const prev = get().persona;
        if (prev === persona) return;
        set({ persona });
        useAuditLogStore
          .getState()
          .addEntry("persona_change", persona, `Persona switched from ${prev} to ${persona}`);
      },
      setProvider: (provider) => {
        const prev = get().provider;
        if (prev === provider) return;
        set({ provider });
        useAuditLogStore
          .getState()
          .addEntry(
            "provider_change",
            get().persona,
            `Provider switched from ${prev} to ${provider}`
          );
      },
      setEnvironment: (environment) => {
        const prev = get().environment;
        if (prev === environment) return;
        set({ environment });
        useAuditLogStore
          .getState()
          .addEntry(
            "environment_change",
            get().persona,
            `Environment switched from ${prev} to ${environment}`
          );
      },
    }),
    { name: "nexus-settings" }
  )
);
