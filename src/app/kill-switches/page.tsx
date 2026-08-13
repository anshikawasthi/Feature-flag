"use client";

import { AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFlag } from "@/hooks/use-flag";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";
import { cn } from "@/lib/utils";

function KillSwitchCard({ flagKey, effectLabel }: { flagKey: string; effectLabel: string }) {
  const engaged = useFlag(flagKey);
  const setOverride = useFlagOverridesStore((s) => s.setOverride);
  const definition = FLAG_MAP[flagKey];

  return (
    <Card className={cn(engaged && "border-destructive/50")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{definition.name}</CardTitle>
          <Switch
            checked={engaged}
            onCheckedChange={(v) => setOverride(flagKey, { enabled: v })}
          />
        </div>
        <CardDescription>{definition.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {engaged ? (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="size-3" /> {effectLabel}
          </Badge>
        ) : (
          <Badge variant="success">Systems normal</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default function KillSwitchesPage() {
  const maintenanceMode = useFlag("maintenance_mode");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Kill Switch Control Center"
        description="Operational shutdown controls — flip a switch and watch the application react immediately."
      />
      {maintenanceMode && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Maintenance mode is engaged — Nexus Enterprise is in read-only mode for every
          persona until this is disengaged.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KillSwitchCard
          flagKey="disable_ai_system"
          effectLabel="AI Assistant module disabled app-wide"
        />
        <KillSwitchCard
          flagKey="disable_external_api"
          effectLabel="Outbound external API calls blocked"
        />
        <KillSwitchCard
          flagKey="disable_exports"
          effectLabel="Report & dashboard exports blocked"
        />
        <KillSwitchCard
          flagKey="maintenance_mode"
          effectLabel="Entire application in maintenance mode"
        />
      </div>
    </div>
  );
}
