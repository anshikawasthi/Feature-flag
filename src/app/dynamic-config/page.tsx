"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlagOverrideEditor } from "@/components/feature-flags/flag-override-editor";
import { useConfig } from "@/hooks/use-config";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";

const CONFIG_KEYS = [
  "search_result_limit",
  "max_dashboard_widgets",
  "refresh_interval",
  "api_timeout",
];

export default function DynamicConfigPage() {
  const searchLimit = useConfig<number>("search_result_limit");
  const widgetCount = useConfig<number>("max_dashboard_widgets");
  const refreshInterval = useConfig<number>("refresh_interval");
  const apiTimeout = useConfig<number>("api_timeout");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Dynamic Configuration Lab"
        description="Runtime configuration values sourced from the active provider — adjust and watch the preview react immediately."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CONFIG_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{FLAG_MAP[key].name}</CardTitle>
              <CardDescription>{FLAG_MAP[key].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <FlagOverrideEditor definition={FLAG_MAP[key]} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live preview</CardTitle>
          <CardDescription>These panels reflect the config values above immediately.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Search results shown</p>
            <p className="text-2xl font-semibold">{searchLimit}</p>
            <div className="mt-2 flex flex-col gap-1">
              {Array.from({ length: Math.min(searchLimit, 6) }).map((_, i) => (
                <div key={i} className="h-2 rounded bg-muted" />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Dashboard widgets allowed</p>
            <p className="text-2xl font-semibold">{widgetCount}</p>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {Array.from({ length: Math.min(widgetCount, 16) }).map((_, i) => (
                <div key={i} className="aspect-square rounded bg-primary/20" />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Refresh interval</p>
            <p className="text-2xl font-semibold">{refreshInterval}s</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">API timeout</p>
            <p className="text-2xl font-semibold">{apiTimeout}ms</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
