"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VENDOR_COMPARISON_MATRIX } from "@/lib/mock/vendor-comparison-data";
import { useFlagCatalog } from "@/hooks/use-flag-catalog";

export default function VendorComparisonPage() {
  const flags = useFlagCatalog();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Vendor Comparison"
        description="Side-by-side capability matrix for LaunchDarkly, Unleash, and Flagsmith."
      />
      <Card>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capability</TableHead>
                <TableHead>LaunchDarkly</TableHead>
                <TableHead>Unleash</TableHead>
                <TableHead>Flagsmith</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDOR_COMPARISON_MATRIX.map((row) => (
                <TableRow key={row.capability}>
                  <TableCell className="font-medium">{row.capability}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.launchdarkly}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.unleash}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.flagsmith}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-3 pt-5">
          <p className="text-sm text-muted-foreground">
            Current flag status snapshot as evaluated by the active provider ({flags.length}{" "}
            flags total).
          </p>
          <div className="flex flex-wrap gap-2">
            {flags.map((f) => (
              <Badge
                key={f.definition.key}
                variant={f.definition.type === "config" ? "outline" : f.enabled ? "success" : "secondary"}
              >
                {f.definition.key}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
