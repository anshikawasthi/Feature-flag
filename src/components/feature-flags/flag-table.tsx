"use client";

import { useMemo, useState } from "react";
import { Search, Settings2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlagCategoryBadge } from "./flag-category-badge";
import { FlagOverrideEditor } from "./flag-override-editor";
import { useFlagCatalog, type EvaluatedFlag } from "@/hooks/use-flag-catalog";
import { FLAG_CATEGORY_LABELS } from "@/lib/feature-flags/catalog";
import type { FlagCategory } from "@/types/flag";

function renderValue(f: EvaluatedFlag): string {
  if (f.definition.type === "config") {
    return `${f.configValue}${f.definition.unit ? ` ${f.definition.unit}` : ""}`;
  }
  if (f.definition.type === "multivariate" || f.definition.type === "experiment") {
    return f.variant ?? "";
  }
  if (f.definition.type === "rollout") {
    return f.enabled ? "In rollout" : "Not in rollout";
  }
  if (f.definition.type === "killswitch") {
    return f.enabled ? "Engaged" : "Normal";
  }
  return f.enabled ? "Enabled" : "Disabled";
}

function FlagRows({ items }: { items: EvaluatedFlag[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flag</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Current value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((f) => (
            <TableRow key={f.definition.key}>
              <TableCell>
                <div className="font-medium">{f.definition.name}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {f.definition.key}
                </div>
              </TableCell>
              <TableCell>
                <FlagCategoryBadge category={f.definition.category} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground capitalize">
                {f.definition.type}
              </TableCell>
              <TableCell className="text-sm">{renderValue(f)}</TableCell>
              <TableCell>
                {f.overridden ? (
                  <Badge variant="warning">Overridden</Badge>
                ) : (
                  <Badge variant="secondary">Provider default</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings2 className="size-3.5" /> Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{f.definition.name}</DialogTitle>
                      <DialogDescription>{f.definition.description}</DialogDescription>
                    </DialogHeader>
                    <FlagOverrideEditor definition={f.definition} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                No flags match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function FlagTable() {
  const flags = useFlagCatalog();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | FlagCategory>("all");
  const [grouped, setGrouped] = useState(true);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return flags.filter((f) => {
      const matchesSearch =
        term === "" ||
        f.definition.key.toLowerCase().includes(term) ||
        f.definition.name.toLowerCase().includes(term);
      const matchesCategory = category === "all" || f.definition.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [flags, search, category]);

  const groups = useMemo(() => {
    const map = new Map<FlagCategory, EvaluatedFlag[]>();
    filtered.forEach((f) => {
      const arr = map.get(f.definition.category) ?? [];
      arr.push(f);
      map.set(f.definition.category, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search flags by key or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v as "all" | FlagCategory)}>
          <SelectTrigger className="w-full sm:w-[210px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(FLAG_CATEGORY_LABELS).map(([k, l]) => (
              <SelectItem key={k} value={k}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setGrouped((g) => !g)}>
          {grouped ? "Ungroup" : "Group by category"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {flags.length} flags shown
      </p>

      {grouped ? (
        groups.map(([cat, items]) => (
          <div key={cat} className="flex flex-col gap-2">
            <FlagCategoryBadge category={cat} />
            <FlagRows items={items} />
          </div>
        ))
      ) : (
        <FlagRows items={filtered} />
      )}
    </div>
  );
}
