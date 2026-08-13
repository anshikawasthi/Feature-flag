"use client";

import { ArrowRight } from "lucide-react";

import { FLAG_MAP } from "@/lib/feature-flags/catalog";
import { useFlag } from "@/hooks/use-flag";
import { Badge } from "@/components/ui/badge";

const DEPENDENCY_EDGES = Object.values(FLAG_MAP)
  .filter((f) => f.dependsOn)
  .map((f) => ({ child: f.key, parent: f.dependsOn as string }));

function DependencyRow({ parent, child }: { parent: string; child: string }) {
  const parentEnabled = useFlag(parent);
  const childEnabled = useFlag(child);
  const parentDef = FLAG_MAP[parent];
  const childDef = FLAG_MAP[child];

  let status = "Active";
  if (!parentEnabled) status = "Blocked by dependency";
  else if (!childEnabled) status = "Disabled independently";

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={parentEnabled ? "success" : "secondary"}>{parentDef.name}</Badge>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        <Badge variant={childEnabled ? "success" : "secondary"}>{childDef.name}</Badge>
        <span className="font-mono text-[11px] text-muted-foreground">
          {child} depends on {parent}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{status}</p>
    </div>
  );
}

export function DependencyGraph() {
  return (
    <div className="flex flex-col gap-3">
      {DEPENDENCY_EDGES.map((edge) => (
        <DependencyRow key={edge.child} parent={edge.parent} child={edge.child} />
      ))}
    </div>
  );
}
