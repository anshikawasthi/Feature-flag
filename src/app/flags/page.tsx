"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FlagTable } from "@/components/feature-flags/flag-table";
import { DependencyGraph } from "@/components/feature-flags/dependency-graph";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FlagsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Feature Flag Dashboard"
        description="All ~30 catalog flags, their live evaluated values, and provider status."
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Flags</TabsTrigger>
          <TabsTrigger value="dependencies">Dependency Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <FlagTable />
        </TabsContent>
        <TabsContent value="dependencies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flag Dependencies</CardTitle>
              <CardDescription>
                Some flags only take effect when their parent flag is enabled — disabling
                the parent cascades to every dependent flag.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyGraph />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
