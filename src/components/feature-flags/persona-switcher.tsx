"use client";

import { UserCircle2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSettings } from "@/hooks/use-app-settings";
import { PERSONAS } from "@/types/persona";

export function PersonaSwitcher() {
  const { persona, setPersona } = useAppSettings();

  return (
    <Select value={persona} onValueChange={(v) => setPersona(v as typeof persona)}>
      <SelectTrigger size="sm" className="w-[168px]">
        <UserCircle2 className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERSONAS.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
