"use client";

import { PageHeader } from "@/components/layout/page-header";
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
import { AccessRestrictedNotice } from "@/components/feature-flags/access-restricted-notice";
import { useFlag } from "@/hooks/use-flag";
import { useModuleAccessTracking } from "@/hooks/use-module-access";
import { PERSONAS } from "@/types/persona";

const USERS = [
  { name: "Ava Chen", persona: "employee", status: "Active" },
  { name: "Diego Ruiz", persona: "manager", status: "Active" },
  { name: "Priya Nair", persona: "administrator", status: "Active" },
  { name: "Sam Okafor", persona: "executive", status: "Invited" },
];

export default function NexusUsersPage() {
  useModuleAccessTracking("users", "User Management module accessed");
  const hasAdminTools = useFlag("admin_tools");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="User Management"
        description="Nexus Enterprise directory — advanced admin tools require administrator persona + enable_admin_console."
      />
      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription>{USERS.length} people across {PERSONAS.length} personas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.name}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="capitalize">{u.persona}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin tools</CardTitle>
          <CardDescription>Bulk role changes, SSO configuration, and provisioning.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasAdminTools ? (
            <AccessRestrictedNotice flagName="admin_tools" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Bulk role change, SSO configuration, and SCIM provisioning tools would render
              here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
