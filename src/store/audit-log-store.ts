import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditActionType, AuditEntry } from "@/types/audit";
import type { Persona } from "@/types/persona";

interface AuditLogState {
  entries: AuditEntry[];
  addEntry: (
    type: AuditActionType,
    actor: Persona,
    summary: string,
    details?: string
  ) => void;
  clear: () => void;
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (type, actor, summary, details) =>
        set((state) => ({
          entries: [
            {
              id:
                typeof crypto !== "undefined" && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`,
              type,
              actor,
              summary,
              details,
              timestamp: new Date().toISOString(),
            },
            ...state.entries,
          ].slice(0, 500),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: "nexus-audit-log" }
  )
);
