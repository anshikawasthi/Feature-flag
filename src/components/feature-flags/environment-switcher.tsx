"use client";

import { Globe } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSettings } from "@/hooks/use-app-settings";
import { ENVIRONMENTS } from "@/types/environment";

export function EnvironmentSwitcher() {
  const { environment, setEnvironment } = useAppSettings();

  return (
    <Select
      value={environment}
      onValueChange={(v) => setEnvironment(v as typeof environment)}
    >
      <SelectTrigger size="sm" className="w-[140px]">
        <Globe className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ENVIRONMENTS.map((e) => (
          <SelectItem key={e.id} value={e.id}>
            {e.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
