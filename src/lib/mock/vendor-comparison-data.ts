export interface ComparisonRow {
  capability: string;
  launchdarkly: string;
  unleash: string;
  flagsmith: string;
}

/**
 * Static, indicative reference matrix for the Vendor Comparison page.
 * High-level capability descriptions — verify current specifics against
 * each vendor's official documentation before using for procurement.
 */
export const VENDOR_COMPARISON_MATRIX: ComparisonRow[] = [
  {
    capability: "Boolean flags",
    launchdarkly: "Full support",
    unleash: "Full support",
    flagsmith: "Full support",
  },
  {
    capability: "Percentage rollout",
    launchdarkly: "Native, per-environment percentage rollouts",
    unleash: "Native gradual rollout activation strategy",
    flagsmith: "Native percentage-split segments",
  },
  {
    capability: "Role / segment targeting",
    launchdarkly: "Advanced targeting rules + user segments",
    unleash: "Strategy constraints + segments",
    flagsmith: "Segments based on user traits",
  },
  {
    capability: "Multivariate flags",
    launchdarkly: "String / number / JSON variations",
    unleash: "Variants API (string/number/JSON payloads)",
    flagsmith: "Multivariate feature values",
  },
  {
    capability: "Dynamic configuration",
    launchdarkly: "JSON/string/number flag variations",
    unleash: "Variant payloads on any toggle",
    flagsmith: "Remote config feature values",
  },
  {
    capability: "Experimentation / A-B testing",
    launchdarkly: "Built-in experimentation & metrics",
    unleash: "Variant-based experiments via analytics integration",
    flagsmith: "Multivariate values + external analytics",
  },
  {
    capability: "Kill switches",
    launchdarkly: "Instant flag off, scheduling supported",
    unleash: "Instant toggle off",
    flagsmith: "Instant toggle off",
  },
  {
    capability: "Deployment model",
    launchdarkly: "SaaS (+ optional Relay Proxy)",
    unleash: "Self-hosted or SaaS (Unleash Edge)",
    flagsmith: "Self-hosted or SaaS",
  },
  {
    capability: "Open source core",
    launchdarkly: "No",
    unleash: "Yes",
    flagsmith: "Yes",
  },
  {
    capability: "Audit log",
    launchdarkly: "Full audit trail",
    unleash: "Change request audit log",
    flagsmith: "Audit log (higher tiers)",
  },
];
