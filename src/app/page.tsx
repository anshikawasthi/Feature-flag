"use client";

import Link from "next/link";
import { Flag, Plug2, Globe, UserCircle2, ArrowRight, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useFlagCatalog } from "@/hooks/use-flag-catalog";
import { useProviderHealth } from "@/hooks/use-provider-health";
import { PERSONA_MAP } from "@/types/persona";
import { PROVIDERS } from "@/types/provider";
import { FLAG_CATEGORY_LABELS } from "@/lib/feature-flags/catalog";

export default function HomePage() {
  const { persona, provider, environment } = useAppSettings();
  const flags = useFlagCatalog();
  const health = useProviderHealth();
  const providerMeta = PROVIDERS.find((p) => p.id === provider)!;

  const enabledCount = flags.filter((f) => f.enabled).length;
  const overriddenCount = flags.filter((f) => f.overridden).length;

  const byCategory = Object.entries(FLAG_CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    count: flags.filter((f) => f.definition.category === key).length,
  }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nexus Enterprise</h1>
        <p className="text-sm text-muted-foreground">
          Feature Management Evaluation Portal — comparing LaunchDarkly, Unleash, and
          Flagsmith through a shared abstraction layer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Plug2 className="size-3.5" /> Active Provider
            </CardDescription>
            <CardTitle className="text-lg">{providerMeta.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={health.configured ? "success" : "secondary"}>
              {health.configured ? "Live connection" : "Simulated data"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <UserCircle2 className="size-3.5" /> Active Persona
            </CardDescription>
            <CardTitle className="text-lg">{PERSONA_MAP[persona].label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {PERSONA_MAP[persona].description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Globe className="size-3.5" /> Active Environment
            </CardDescription>
            <CardTitle className="text-lg capitalize">{environment}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Latency {health.latencyMs}ms · Cache {health.cacheStatus}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Flag className="size-3.5" /> Flag Statistics
            </CardDescription>
            <CardTitle className="text-lg">
              {enabledCount}/{flags.length} active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {overriddenCount} manually overridden
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flag Catalog Breakdown</CardTitle>
          <CardDescription>~30 flags across 7 evaluation categories</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {byCategory.map((c) => (
            <div key={c.key} className="rounded-lg border border-border p-3">
              <p className="text-2xl font-semibold">{c.count}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" /> Get started
            </CardTitle>
            <CardDescription>
              Explore the Feature Flag Dashboard to see every flag&apos;s live value, or
              jump into the Nexus Enterprise modules to see flags in action.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/flags">
                Feature Flag Dashboard <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/nexus/dashboard">Open Nexus Enterprise</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendor Comparison</CardTitle>
            <CardDescription>
              Compare rollout, targeting, variant and configuration support side-by-side
              across LaunchDarkly, Unleash, and Flagsmith.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline">
              <Link href="/vendor-comparison">
                View comparison matrix <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
