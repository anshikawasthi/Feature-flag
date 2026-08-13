"use client";

import { useEffect } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVariant } from "@/hooks/use-variant";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useAnalyticsEvents } from "@/hooks/use-analytics-events";
import { EXPERIMENTS } from "@/lib/mock/experiments";
import { FLAG_MAP } from "@/lib/feature-flags/catalog";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";

function ExperimentCard({
  flagKey,
  name,
  hypothesis,
}: {
  flagKey: string;
  name: string;
  hypothesis: string;
}) {
  const variant = useVariant(flagKey);
  const { persona, provider, environment } = useAppSettings();
  const { trackEvent, events } = useAnalyticsEvents();
  const definition = FLAG_MAP[flagKey];

  useEffect(() => {
    trackEvent({
      type: "experiment_viewed",
      flagKey,
      label: `${name} viewed`,
      persona,
      provider,
      environment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagKey]);

  const variantCounts =
    definition.variants?.map((v) => ({
      label: v.label,
      value: events.filter(
        (e) => e.flagKey === flagKey && e.type === "variant_selected" && e.variant === v.key
      ).length,
    })) ?? [];

  const impressions = events.filter(
    (e) => e.flagKey === flagKey && e.type === "experiment_viewed"
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{hypothesis}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {definition.variants?.map((v) => (
            <Badge key={v.key} variant={variant === v.key ? "default" : "outline"}>
              {v.label}
              {variant === v.key ? " · active" : ""}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {impressions} impression{impressions === 1 ? "" : "s"} recorded this session
        </p>
        <CategoryBarChart data={variantCounts} height={160} horizontal />
      </CardContent>
    </Card>
  );
}

export default function ExperimentsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Experimentation Lab"
        description="Live A/B tests with tracked impressions and active variant selection."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {EXPERIMENTS.map((exp) => (
          <ExperimentCard
            key={exp.flagKey}
            flagKey={exp.flagKey}
            name={exp.name}
            hypothesis={exp.hypothesis}
          />
        ))}
      </div>
    </div>
  );
}
