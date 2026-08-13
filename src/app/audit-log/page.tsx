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
import { Button } from "@/components/ui/button";
import { useAuditLog } from "@/hooks/use-audit-log";
import type { AuditActionType } from "@/types/audit";

const TYPE_LABELS: Record<AuditActionType, string> = {
  provider_change: "Provider change",
  persona_change: "Persona change",
  environment_change: "Environment change",
  feature_access: "Feature access",
};

export default function AuditLogPage() {
  const { entries, clear } = useAuditLog();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Audit Log"
        description="Tracks provider changes, persona changes, environment changes, and feature access."
        actions={
          <Button size="sm" variant="outline" onClick={clear}>
            Clear log
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{TYPE_LABELS[e.type]}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{e.actor}</TableCell>
                  <TableCell className="text-sm">{e.summary}</TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No audit events recorded yet — switch persona, provider, or environment to
                    generate entries.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
