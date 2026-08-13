"use client";

import Link from "next/link";
import { ShieldCheck, Power } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleDisabledNotice } from "@/components/feature-flags/module-disabled-notice";
import { AccessRestrictedNotice } from "@/components/feature-flags/access-restricted-notice";
import { useFlag } from "@/hooks/use-flag";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

export default function NexusAdminConsolePage() {
  useModuleAccessTracking("admin", "Admin Console module accessed");
  const consoleEnabled = useFlag("enable_admin_console");
  const hasAdminTools = useFlag("admin_tools");
  const maintenanceMode = useFlag("maintenance_mode");

  if (!consoleEnabled) return <ModuleDisabledNotice moduleName="Admin Console" />;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Admin Console"
        description="Nexus Enterprise operational control center."
        actions={
          maintenanceMode ? <Badge variant="destructive">Maintenance mode engaged</Badge> : undefined
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" /> Administrative tools
          </CardTitle>
          <CardDescription>Requires admin_tools (role: administrator)</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasAdminTools ? (
            <AccessRestrictedNotice flagName="admin_tools" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Tenant configuration, SSO, and low-level system utilities would render here.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="size-4" /> Operational controls
          </CardTitle>
          <CardDescription>
            Kill switches for AI, external APIs, exports, and maintenance mode live in the
            Kill Switch Control Center.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="sm" variant="outline">
            <Link href="/kill-switches">Open Kill Switch Control Center</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
