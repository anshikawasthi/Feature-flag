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
import { useAppSettings } from "@/hooks/use-app-settings";
import { useProviderHealth } from "@/hooks/use-provider-health";
import { PROVIDERS, type ProviderId } from "@/types/provider";
import { PERSONAS, type Persona } from "@/types/persona";
import { ENVIRONMENTS, type Environment } from "@/types/environment";
import { cn } from "@/lib/utils";

function OptionCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors",
        active ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {active && <Badge>Active</Badge>}
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}

export default function SettingsPage() {
  const { persona, provider, environment, setPersona, setProvider, setEnvironment } =
    useAppSettings();
  const health = useProviderHealth();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure the active provider, persona, and environment for this session."
      />

      <Card>
        <CardHeader>
          <CardTitle>Feature flag provider</CardTitle>
          <CardDescription>
            Switching providers re-initializes the abstraction layer. Real SDKs are used
            automatically when the matching environment variable is configured — otherwise
            the shared mock engine is used ({health.configured ? "currently live" : "currently simulated"}
            ).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROVIDERS.map((p) => (
            <OptionCard
              key={p.id}
              active={provider === p.id}
              title={p.name}
              description={p.requiresEnvVar ? `Requires ${p.requiresEnvVar}` : "Always available"}
              onClick={() => setProvider(p.id as ProviderId)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Persona</CardTitle>
          <CardDescription>Simulates the currently signed-in user for role targeting.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <OptionCard
              key={p.id}
              active={persona === p.id}
              title={p.label}
              description={p.description}
              onClick={() => setPersona(p.id as Persona)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>
            Affects rollout bucketing and is recorded on every tracked event.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ENVIRONMENTS.map((e) => (
            <OptionCard
              key={e.id}
              active={environment === e.id}
              title={e.label}
              description={e.id}
              onClick={() => setEnvironment(e.id as Environment)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
