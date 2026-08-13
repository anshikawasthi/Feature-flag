"use client";

import { Download } from "lucide-react";

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
import { AccessRestrictedNotice } from "@/components/feature-flags/access-restricted-notice";
import { useFlag } from "@/hooks/use-flag";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

const REPORTS = [
  { name: "Quarterly Revenue Report", updated: "2 hours ago" },
  { name: "Team Utilization Report", updated: "Yesterday" },
  { name: "Customer Health Report", updated: "3 days ago" },
];

export default function NexusReportsPage() {
  useModuleAccessTracking("reports", "Reports module accessed");
  const hasManagerReports = useFlag("manager_reports");
  const newReportEngine = useFlag("new_report_engine");
  const exportsDisabled = useFlag("disable_exports");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Nexus Enterprise reporting module."
        actions={
          newReportEngine ? (
            <Badge variant="success">New report engine (rollout)</Badge>
          ) : undefined
        }
      />
      {!hasManagerReports ? (
        <AccessRestrictedNotice flagName="manager_reports" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Available reports</CardTitle>
            <CardDescription>
              Rendered by the {newReportEngine ? "next-gen" : "legacy"} report engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {REPORTS.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">Updated {r.updated}</p>
                </div>
                <Button size="sm" variant="outline" disabled={exportsDisabled}>
                  <Download className="size-3.5" /> {exportsDisabled ? "Export disabled" : "Export"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
