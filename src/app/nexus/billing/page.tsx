"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessRestrictedNotice } from "@/components/feature-flags/access-restricted-notice";
import { useFlag } from "@/hooks/use-flag";
import { useVariant } from "@/hooks/use-variant";
import { useModuleAccessTracking } from "@/hooks/use-module-access";

const PLANS = [
  { name: "Starter", price: "$29/mo" },
  { name: "Growth", price: "$99/mo" },
  { name: "Enterprise", price: "Contact us" },
];

export default function NexusBillingPage() {
  useModuleAccessTracking("billing", "Billing module accessed");
  const hasExecutiveDashboard = useFlag("executive_dashboard");
  const pricingVariant = useVariant("pricing_experiment");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Nexus Enterprise billing module."
        actions={<Badge variant="outline">pricing_experiment: {pricingVariant}</Badge>}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            {pricingVariant === "variant_tiered_pricing" ? "Tiered pricing" : "Flat pricing"}
          </CardTitle>
          <CardDescription>Active experiment variant drives the plan display below.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="mt-1 text-lg font-semibold">{p.price}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Executive financial overview</CardTitle>
          <CardDescription>Gated by executive_dashboard role targeting</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasExecutiveDashboard ? (
            <AccessRestrictedNotice flagName="executive_dashboard" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Company-wide revenue, churn, and expansion metrics would render here for
              executives and administrators.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
