"use client";

import { useAuditLogStore } from "@/store/audit-log-store";

export function useAuditLog() {
  const entries = useAuditLogStore((s) => s.entries);
  const addEntry = useAuditLogStore((s) => s.addEntry);
  const clear = useAuditLogStore((s) => s.clear);
  return { entries, addEntry, clear };
}
