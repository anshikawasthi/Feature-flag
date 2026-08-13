import { Badge } from "@/components/ui/badge";
import { FLAG_CATEGORY_LABELS } from "@/lib/feature-flags/catalog";
import type { FlagCategory } from "@/types/flag";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<FlagCategory, string> = {
  boolean: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "role-targeting":
    "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "percentage-rollout":
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  multivariate:
    "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  "dynamic-config":
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  experimentation:
    "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
  "kill-switch":
    "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function FlagCategoryBadge({ category }: { category: FlagCategory }) {
  return (
    <Badge variant="outline" className={cn(CATEGORY_STYLES[category])}>
      {FLAG_CATEGORY_LABELS[category]}
    </Badge>
  );
}
