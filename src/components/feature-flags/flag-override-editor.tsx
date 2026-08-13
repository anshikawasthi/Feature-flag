"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import type { FlagDefinition } from "@/types/flag";
import { ROLLOUT_PERCENTAGE_PRESETS } from "@/lib/mock/rollout-simulation";

export function FlagOverrideEditor({ definition }: { definition: FlagDefinition }) {
  const override = useFlagOverridesStore((s) => s.overrides[definition.key]);
  const setOverride = useFlagOverridesStore((s) => s.setOverride);
  const clearOverride = useFlagOverridesStore((s) => s.clearOverride);

  const [localPercentage, setLocalPercentage] = useState(
    override?.rolloutPercentage ?? definition.rolloutPercentage ?? 0
  );
  const [localConfig, setLocalConfig] = useState(
    String(override?.configValue ?? definition.configValue ?? "")
  );

  const hasOverride = Boolean(override);

  return (
    <div className="flex flex-col gap-4">
      {(definition.type === "boolean" || definition.type === "killswitch") && (
        <div className="flex items-center justify-between">
          <Label htmlFor={`override-${definition.key}`}>
            {definition.type === "killswitch" ? "Force kill switch state" : "Force enabled state"}
          </Label>
          <Switch
            id={`override-${definition.key}`}
            checked={override?.enabled ?? definition.defaultValue ?? false}
            onCheckedChange={(checked) => setOverride(definition.key, { enabled: checked })}
          />
        </div>
      )}

      {definition.type === "rollout" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Rollout percentage</Label>
            <span className="text-sm font-medium tabular-nums">{localPercentage}%</span>
          </div>
          <Slider
            value={[localPercentage]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => setLocalPercentage(v)}
            onValueCommit={([v]) => setOverride(definition.key, { rolloutPercentage: v })}
          />
          <div className="flex flex-wrap gap-1.5">
            {ROLLOUT_PERCENTAGE_PRESETS.map((preset) => (
              <Button
                key={preset}
                size="sm"
                variant={localPercentage === preset ? "default" : "outline"}
                onClick={() => {
                  setLocalPercentage(preset);
                  setOverride(definition.key, { rolloutPercentage: preset });
                }}
              >
                {preset}%
              </Button>
            ))}
          </div>
        </div>
      )}

      {(definition.type === "multivariate" || definition.type === "experiment") && (
        <div className="flex flex-col gap-2">
          <Label>Forced variant</Label>
          <Select
            value={override?.variant ?? "__auto"}
            onValueChange={(v) =>
              v === "__auto"
                ? clearOverride(definition.key)
                : setOverride(definition.key, { variant: v })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__auto">Auto (deterministic bucket)</SelectItem>
              {definition.variants?.map((v) => (
                <SelectItem key={v.key} value={v.key}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {definition.type === "config" && (
        <div className="flex flex-col gap-3">
          <Label>
            Value {definition.unit ? `(${definition.unit})` : ""}
          </Label>
          {definition.configRange ? (
            <>
              <Slider
                value={[Number(localConfig) || 0]}
                min={definition.configRange.min}
                max={definition.configRange.max}
                step={definition.configRange.step ?? 1}
                onValueChange={([v]) => setLocalConfig(String(v))}
                onValueCommit={([v]) => setOverride(definition.key, { configValue: v })}
              />
              <span className="text-sm font-medium tabular-nums">
                {localConfig} {definition.unit}
              </span>
            </>
          ) : (
            <Input
              value={localConfig}
              onChange={(e) => setLocalConfig(e.target.value)}
              onBlur={() => setOverride(definition.key, { configValue: localConfig })}
            />
          )}
        </div>
      )}

      {(definition.type === "boolean" && definition.category === "role-targeting") && (
        <p className="text-xs text-muted-foreground">
          Default visibility: {definition.roleTargeting?.join(", ")}
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={!hasOverride}
        onClick={() => clearOverride(definition.key)}
        className="self-start"
      >
        <RotateCcw className="size-3.5" /> Reset to default
      </Button>
    </div>
  );
}
