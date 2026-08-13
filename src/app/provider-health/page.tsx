"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

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
import { getAllSimulatedHealth } from "@/lib/mock/provider-health";
import { useAppSettings } from "@/hooks/use-app-settings";

export default function ProviderHealthPage() {
  const [, forceRefresh] = useState(0);
  const { provider: activeProvider } = useAppSettings();
  const health = getAllSimulatedHealth();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Provider Health"
        description="Status, latency, last sync time, and cache state across all providers."
        actions={
          <Button size="sm" variant="outline" onClick={() => forceRefresh((t) => t + 1)}>
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {health.map((h) => (
          <Card
            key={h.providerId}
            className={h.providerId === activeProvider ? "ring-1 ring-primary" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">
                  {h.providerId.replace("-", " ")}
                </CardTitle>
                <Badge
                  variant={
                    h.status === "healthy"
                      ? "success"
                      : h.status === "degraded"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {h.status}
                </Badge>
              </div>
              {h.providerId === activeProvider && <CardDescription>Active provider</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency</span>
                <span className="tabular-nums">{h.latencyMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last sync</span>
                <span>{new Date(h.lastSyncedAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache</span>
                <span className="capitalize">{h.cacheStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connection</span>
                <span>{h.configured ? "Live" : "Simulated"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
