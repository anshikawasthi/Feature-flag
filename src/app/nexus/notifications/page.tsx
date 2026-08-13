"use client";

import { Bell, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleDisabledNotice } from "@/components/feature-flags/module-disabled-notice";
import { useFlag } from "@/hooks/use-flag";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

const NOTIFICATIONS = [
  { title: "New report ready", detail: "Quarterly Revenue Report has finished generating.", time: "10m ago" },
  { title: "Persona switched", detail: "You are now viewing Nexus Enterprise as Manager.", time: "1h ago" },
  { title: "Maintenance scheduled", detail: "Planned maintenance window this weekend.", time: "1d ago" },
];

export default function NexusNotificationsPage() {
  useModuleAccessTracking("notifications", "Notifications module accessed");
  const enabled = useFlag("enable_notifications");
  if (!enabled) return <ModuleDisabledNotice moduleName="Notifications" />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Nexus Enterprise notification center."
      />
      <Card>
        <CardContent className="flex flex-col divide-y divide-border pt-5">
          {NOTIFICATIONS.map((n) => (
            <div key={n.title} className="flex items-start gap-3 py-3">
              <Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5" /> You&apos;re all caught up.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
