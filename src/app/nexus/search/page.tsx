"use client";

import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModuleDisabledNotice } from "@/components/feature-flags/module-disabled-notice";
import { useFlag } from "@/hooks/use-flag";
import { useVariant } from "@/hooks/use-variant";
import { useConfig } from "@/hooks/use-config";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

const SAMPLE_RESULTS = Array.from({ length: 40 }).map((_, i) => `Search result item ${i + 1}`);

export default function NexusSearchPage() {
  useModuleAccessTracking("search", "Search module accessed");
  const advancedSearch = useFlag("enable_advanced_search");
  const newAlgorithm = useFlag("new_search_algorithm");
  const experimentVariant = useVariant("search_experiment");
  const resultLimit = useConfig<number>("search_result_limit");
  const [query, setQuery] = useState("");

  if (!advancedSearch) return <ModuleDisabledNotice moduleName="Search" />;

  const filtered = SAMPLE_RESULTS.filter((r) =>
    r.toLowerCase().includes(query.toLowerCase())
  ).slice(0, resultLimit);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="Search"
        description="Nexus Enterprise search — advanced filters, gradual algorithm rollout, and an active ranking experiment."
        actions={
          newAlgorithm ? <Badge variant="success">new_search_algorithm rollout</Badge> : undefined
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="size-4" /> Search
          </CardTitle>
          <CardDescription>
            Ranking strategy: <span className="font-mono">{experimentVariant}</span> · showing
            up to {resultLimit} results
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Nexus Enterprise…"
            />
            <Badge variant="outline" className="gap-1">
              <SlidersHorizontal className="size-3" /> Advanced filters on
            </Badge>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {filtered.map((r) => (
              <div key={r} className="py-2 text-sm">
                {r}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">No results.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
