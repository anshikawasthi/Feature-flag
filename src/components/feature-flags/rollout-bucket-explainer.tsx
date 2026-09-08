"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppSettings } from "@/hooks/use-app-settings";
import { FLAG_CATALOG } from "@/lib/feature-flags/catalog";
import { hashString, bucketOf } from "@/lib/feature-flags/mock-engine";

const ROLLOUT_FLAGS = FLAG_CATALOG.filter((f) => f.type === "rollout");

/**
 * Shows exactly how the mock engine's percentage-rollout math resolves for the
 * *current* persona/environment: the seed string, its raw hash, the resulting
 * 0-99 bucket, the rollout threshold, and the enabled/disabled outcome. Only
 * reflects the Local Mock provider's deterministic hash bucketing — a real
 * Unleash/LaunchDarkly/Flagsmith provider evaluates gradual rollouts
 * server-side using its own stickiness hash, not this formula.
 */
export function RolloutBucketExplainer() {
  const { persona, environment } = useAppSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>How the rollout bucket is computed</CardTitle>
        <CardDescription>
          For persona <span className="font-mono">{persona}</span> in{" "}
          <span className="font-mono">{environment}</span> — seed string ={" "}
          <span className="font-mono">flagKey:persona:environment</span>, hashed and reduced to a
          stable 0–99 bucket. The flag is enabled when{" "}
          <span className="font-mono">bucket &lt; rollout %</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Seed string</TableHead>
                <TableHead className="text-right">Hash</TableHead>
                <TableHead className="text-right">Bucket (0-99)</TableHead>
                <TableHead className="text-right">Rollout %</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLLOUT_FLAGS.map((f) => {
                const seed = `${f.key}:${persona}:${environment}`;
                const hash = hashString(seed);
                const bucket = bucketOf(seed);
                const percentage = f.rolloutPercentage ?? 0;
                const enabled = bucket < percentage;
                return (
                  <TableRow key={f.key}>
                    <TableCell>
                      <div className="font-medium">{f.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{f.key}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {seed}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {hash}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {bucket}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {percentage}%
                    </TableCell>
                    <TableCell>
                      {enabled ? (
                        <Badge variant="success">
                          In rollout ({bucket} &lt; {percentage})
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Not in rollout ({bucket} ≥ {percentage})
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This only reflects the Local Mock provider&apos;s deterministic hash bucketing. Real
          Unleash/LaunchDarkly/Flagsmith providers evaluate gradual rollouts server-side with
          their own stickiness hash — switch to Local Mock in Settings to see this math actually
          drive the flag values above.
        </p>
      </CardContent>
    </Card>
  );
}
