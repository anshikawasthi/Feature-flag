"use client";

import { useMemo } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimeSeriesAreaChart } from "@/components/charts/time-series-area-chart";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { useAnalyticsEvents } from "@/hooks/use-analytics-events";
import { useFlagCatalog } from "@/hooks/use-flag-catalog";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";

export default function AnalyticsPage() {
  const { events } = useAnalyticsEvents();
  const flags = useFlagCatalog();

  const evaluationsOverTime = useMemo(() => {
    const buckets = new Map<string, number>();
    events
      .filter((e) => e.type === "flag_evaluated")
      .forEach((e) => {
        const label = new Date(e.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        buckets.set(label, (buckets.get(label) ?? 0) + 1);
      });
    return Array.from(buckets.entries())
      .map(([label, count]) => ({ label, count }))
      .reverse()
      .slice(-12);
  }, [events]);

  const variantDistribution = useMemo(() => {
    const buckets = new Map<string, number>();
    events
      .filter((e) => e.type === "variant_selected")
      .forEach((e) => {
        const label = `${FLAG_MAP[e.flagKey ?? ""]?.name ?? e.flagKey}: ${e.variant}`;
        buckets.set(label, (buckets.get(label) ?? 0) + 1);
      });
    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  }, [events]);

  const rolloutPercentages = useMemo(
    () =>
      flags
        .filter((f) => f.definition.type === "rollout")
        .map((f) => ({
          label: f.definition.name,
          value: f.definition.rolloutPercentage ?? 0,
        })),
    [flags]
  );

  const experimentParticipation = useMemo(() => {
    const buckets = new Map<string, number>();
    events
      .filter((e) => e.type === "experiment_viewed")
      .forEach((e) => {
        const label = FLAG_MAP[e.flagKey ?? ""]?.name ?? e.flagKey ?? "Unknown";
        buckets.set(label, (buckets.get(label) ?? 0) + 1);
      });
    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  }, [events]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Analytics"
        description={`${events.length} tracked events this session across flag evaluations, variants, and experiments.`}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flag evaluations over time</CardTitle>
            <CardDescription>flag_evaluated events, grouped by minute</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSeriesAreaChart data={evaluationsOverTime} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active variants</CardTitle>
            <CardDescription>variant_selected events by flag + variant</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={variantDistribution} horizontal />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rollout percentages</CardTitle>
            <CardDescription>Current configured rollout % per flag</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={rolloutPercentages} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experiment participation</CardTitle>
            <CardDescription>experiment_viewed events per experiment</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={experimentParticipation} horizontal />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
