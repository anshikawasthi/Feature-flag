"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessRestrictedNotice } from "@/components/feature-flags/access-restricted-notice";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { useFlag } from "@/hooks/use-flag";
import { useConfig } from "@/hooks/use-config";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

const SAMPLE_DATA = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 180 },
  { label: "Wed", value: 150 },
  { label: "Thu", value: 210 },
  { label: "Fri", value: 260 },
];

export default function NexusAnalyticsPage() {
  const hasPremiumAnalytics = useFlag("premium_analytics");
  const refreshInterval = useConfig<number>("refresh_interval");
  useModuleAccessTracking("analytics", "Analytics module accessed");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Nexus Enterprise analytics module — premium widgets gated by role targeting."
      />
      {!hasPremiumAnalytics ? (
        <AccessRestrictedNotice flagName="premium_analytics" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Weekly active usage</CardTitle>
            <CardDescription>Auto-refreshing every {refreshInterval}s (refresh_interval)</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={SAMPLE_DATA} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
