"use client";

import { Plug2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSettings } from "@/hooks/use-app-settings";
import { PROVIDERS } from "@/types/provider";

export function ProviderSwitcher() {
  const { provider, setProvider } = useAppSettings();

  return (
    <Select value={provider} onValueChange={(v) => setProvider(v as typeof provider)}>
      <SelectTrigger size="sm" className="w-[168px]">
        <Plug2 className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PROVIDERS.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
