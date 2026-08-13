"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFlag } from "@/hooks/use-flag";
import { useVariant } from "@/hooks/use-variant";
import { useConfig } from "@/hooks/use-config";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

export default function NexusDashboardPage() {
  useModuleAccessTracking("dashboard", "Dashboard module accessed");
  const newDashboard = useFlag("new_dashboard");
  const betaDashboard = useFlag("beta_dashboard");
  const navVersion = useVariant("navigation_version");
  const maxWidgets = useConfig<number>("max_dashboard_widgets");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Nexus Enterprise home dashboard — layout and widget count are flag-driven."
        actions={
          <div className="flex gap-2">
            <Badge variant={newDashboard ? "success" : "secondary"}>
              new_dashboard: {newDashboard ? "on" : "off"}
            </Badge>
            <Badge variant={betaDashboard ? "success" : "secondary"}>
              beta_dashboard: {betaDashboard ? "on" : "off"}
            </Badge>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{newDashboard ? "Redesigned dashboard shell" : "Classic dashboard shell"}</CardTitle>
          <CardDescription>
            Navigation experience: <span className="font-mono">{navVersion}</span> · Up to{" "}
            {maxWidgets} widgets allowed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`grid gap-3 ${newDashboard ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
          >
            {Array.from({ length: Math.min(maxWidgets, 9) }).map((_, i) => (
              <div
                key={i}
                className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground"
              >
                Widget {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {betaDashboard && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="py-4 text-sm">
            You are in the <strong>beta_dashboard</strong> rollout cohort — you&apos;re seeing
            an early-access layout ahead of general availability.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
