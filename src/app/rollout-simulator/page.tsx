"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SplitPieChart } from "@/components/charts/split-pie-chart";
import { simulateRollout, ROLLOUT_PERCENTAGE_PRESETS } from "@/lib/mock/rollout-simulation";
import { FLAG_CATALOG } from "@/lib/feature-flags/catalog";
import { ENVIRONMENTS, type Environment } from "@/types/environment";
import { PERSONAS, type Persona } from "@/types/persona";

const ROLLOUT_FLAGS = FLAG_CATALOG.filter((f) => f.type === "rollout");

export default function RolloutSimulatorPage() {
  const [flagKey, setFlagKey] = useState(ROLLOUT_FLAGS[0].key);
  const [userCount, setUserCount] = useState(1000);
  const [percentage, setPercentage] = useState(25);
  const [environment, setEnvironment] = useState<Environment>("production");
  const [persona, setPersona] = useState<Persona>("employee");

  const result = useMemo(
    () => simulateRollout(flagKey, userCount, percentage, environment, persona),
    [flagKey, userCount, percentage, environment, persona]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Rollout Simulator"
        description="Simulate percentage rollouts across a synthetic user population."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Simulation controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Flag</Label>
              <Select value={flagKey} onValueChange={setFlagKey}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLLOUT_FLAGS.map((f) => (
                    <SelectItem key={f.key} value={f.key}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Simulated user count</Label>
                <span className="text-sm tabular-nums">{userCount.toLocaleString()}</span>
              </div>
              <Slider
                value={[userCount]}
                min={100}
                max={50000}
                step={100}
                onValueChange={([v]) => setUserCount(v)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Rollout percentage</Label>
                <span className="text-sm tabular-nums">{percentage}%</span>
              </div>
              <Slider
                value={[percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => setPercentage(v)}
              />
              <div className="flex flex-wrap gap-1.5">
                {ROLLOUT_PERCENTAGE_PRESETS.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={percentage === p ? "default" : "outline"}
                    onClick={() => setPercentage(p)}
                  >
                    {p}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENVIRONMENTS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Persona</Label>
              <Select value={persona} onValueChange={(v) => setPersona(v as Persona)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERSONAS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rollout impact</CardTitle>
            <CardDescription>
              {result.inRollout.toLocaleString()} of {result.totalUsers.toLocaleString()}{" "}
              simulated users fall inside the {percentage}% rollout bucket for{" "}
              <span className="font-mono">{flagKey}</span> in {environment}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SplitPieChart
              data={[
                { label: "In rollout", value: result.inRollout },
                { label: "Not in rollout", value: result.outOfRollout },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
