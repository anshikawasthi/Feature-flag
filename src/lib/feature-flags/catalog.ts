import type { FlagDefinition } from "@/types/flag";

/**
 * The full ~30 flag catalog exercised across the Nexus Enterprise modules
 * and the Evaluation Portal tooling pages. Values here are the catalog
 * "defaults" — actual evaluation also considers runtime overrides and,
 * for role-targeting/rollout/multivariate flags, the current persona /
 * environment / hash bucket.
 */
export const FLAG_CATALOG: FlagDefinition[] = [
  // ---------------------------------------------------------------------
  // Category 1: Boolean flags
  // ---------------------------------------------------------------------
  {
    key: "new_dashboard",
    name: "New Dashboard",
    description: "Enables the redesigned Nexus Enterprise dashboard shell.",
    category: "boolean",
    type: "boolean",
    defaultValue: false,
  },
  {
    key: "new_navigation",
    name: "New Navigation",
    description: "Enables the restructured primary navigation.",
    category: "boolean",
    type: "boolean",
    defaultValue: false,
  },
  {
    key: "enable_dark_mode",
    name: "Enable Dark Mode",
    description: "Allows users to switch the application into dark mode.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
  },
  {
    key: "enable_ai_assistant",
    name: "Enable AI Assistant",
    description: "Turns on the Nexus AI Assistant module.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
    dependsOn: "enable_advanced_search",
  },
  {
    key: "enable_export",
    name: "Enable Export",
    description: "Allows exporting reports and dashboards.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
  },
  {
    key: "enable_notifications",
    name: "Enable Notifications",
    description: "Turns on the Notifications module.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
  },
  {
    key: "enable_admin_console",
    name: "Enable Admin Console",
    description: "Turns on the Admin Console module.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
  },
  {
    key: "enable_advanced_search",
    name: "Enable Advanced Search",
    description: "Enables advanced filters and operators in Search.",
    category: "boolean",
    type: "boolean",
    defaultValue: true,
  },

  // ---------------------------------------------------------------------
  // Category 2: Role targeting
  // ---------------------------------------------------------------------
  {
    key: "executive_dashboard",
    name: "Executive Dashboard",
    description: "Executive-only KPI dashboard with company-wide metrics.",
    category: "role-targeting",
    type: "boolean",
    defaultValue: false,
    roleTargeting: ["executive", "administrator"],
  },
  {
    key: "manager_reports",
    name: "Manager Reports",
    description: "Team performance reports for people managers.",
    category: "role-targeting",
    type: "boolean",
    defaultValue: false,
    roleTargeting: ["manager", "administrator", "executive"],
  },
  {
    key: "admin_tools",
    name: "Admin Tools",
    description: "Low-level administrative utilities in the Admin Console.",
    category: "role-targeting",
    type: "boolean",
    defaultValue: false,
    roleTargeting: ["administrator"],
    dependsOn: "enable_admin_console",
  },
  {
    key: "premium_analytics",
    name: "Premium Analytics",
    description: "Advanced analytics widgets for premium personas.",
    category: "role-targeting",
    type: "boolean",
    defaultValue: false,
    roleTargeting: ["manager", "administrator", "executive"],
    dependsOn: "enable_export",
  },

  // ---------------------------------------------------------------------
  // Category 3: Percentage rollout
  // ---------------------------------------------------------------------
  {
    key: "beta_dashboard",
    name: "Beta Dashboard",
    description: "Early-access dashboard layout, gradually rolled out.",
    category: "percentage-rollout",
    type: "rollout",
    rolloutPercentage: 10,
    dependsOn: "new_dashboard",
  },
  {
    key: "new_search_algorithm",
    name: "New Search Algorithm",
    description: "Relevance-ranked search results, gradually rolled out.",
    category: "percentage-rollout",
    type: "rollout",
    rolloutPercentage: 25,
  },
  {
    key: "new_report_engine",
    name: "New Report Engine",
    description: "Next-gen report generation engine.",
    category: "percentage-rollout",
    type: "rollout",
    rolloutPercentage: 5,
  },
  {
    key: "modern_homepage",
    name: "Modern Homepage",
    description: "Modernized homepage experience.",
    category: "percentage-rollout",
    type: "rollout",
    rolloutPercentage: 50,
  },

  // ---------------------------------------------------------------------
  // Category 4: Multivariate flags
  // ---------------------------------------------------------------------
  {
    key: "navigation_version",
    name: "Navigation Version",
    description: "Controls which navigation experience is rendered.",
    category: "multivariate",
    type: "multivariate",
    variants: [
      { key: "classic", label: "Classic" },
      { key: "modern", label: "Modern" },
      { key: "experimental", label: "Experimental" },
    ],
    defaultVariant: "classic",
  },
  {
    key: "homepage_layout",
    name: "Homepage Layout",
    description: "Controls the homepage layout variant.",
    category: "multivariate",
    type: "multivariate",
    variants: [
      { key: "layout_a", label: "Layout A" },
      { key: "layout_b", label: "Layout B" },
      { key: "layout_c", label: "Layout C" },
    ],
    defaultVariant: "layout_a",
  },

  // ---------------------------------------------------------------------
  // Category 5: Dynamic configuration
  // ---------------------------------------------------------------------
  {
    key: "search_result_limit",
    name: "Search Result Limit",
    description: "Maximum number of search results returned per query.",
    category: "dynamic-config",
    type: "config",
    configValue: 25,
    unit: "items",
    configRange: { min: 5, max: 100, step: 5 },
  },
  {
    key: "api_timeout",
    name: "API Timeout",
    description: "Timeout applied to outbound API calls.",
    category: "dynamic-config",
    type: "config",
    configValue: 5000,
    unit: "ms",
    configRange: { min: 1000, max: 15000, step: 500 },
  },
  {
    key: "max_dashboard_widgets",
    name: "Max Dashboard Widgets",
    description: "Maximum widgets a user may pin to their dashboard.",
    category: "dynamic-config",
    type: "config",
    configValue: 8,
    unit: "widgets",
    configRange: { min: 1, max: 20, step: 1 },
  },
  {
    key: "refresh_interval",
    name: "Refresh Interval",
    description: "How often live data on the dashboard refreshes.",
    category: "dynamic-config",
    type: "config",
    configValue: 30,
    unit: "sec",
    configRange: { min: 5, max: 300, step: 5 },
  },

  // ---------------------------------------------------------------------
  // Category 6: Experimentation
  // ---------------------------------------------------------------------
  {
    key: "pricing_experiment",
    name: "Pricing Experiment",
    description: "A/B test between flat pricing and tiered pricing display.",
    category: "experimentation",
    type: "experiment",
    variants: [
      { key: "control_flat_pricing", label: "Control: Flat Pricing", weight: 50 },
      { key: "variant_tiered_pricing", label: "Variant: Tiered Pricing", weight: 50 },
    ],
    defaultVariant: "control_flat_pricing",
  },
  {
    key: "button_color_experiment",
    name: "Button Color Experiment",
    description: "A/B test of primary call-to-action button color.",
    category: "experimentation",
    type: "experiment",
    variants: [
      { key: "variant_blue", label: "Variant A: Blue", weight: 50 },
      { key: "variant_green", label: "Variant B: Green", weight: 50 },
    ],
    defaultVariant: "variant_blue",
  },
  {
    key: "search_experiment",
    name: "Search Experiment",
    description: "A/B test of classic vs. AI-ranked search results.",
    category: "experimentation",
    type: "experiment",
    variants: [
      { key: "control_classic_ranking", label: "Control: Classic Ranking", weight: 50 },
      { key: "variant_ai_ranking", label: "Variant: AI Ranking", weight: 50 },
    ],
    defaultVariant: "control_classic_ranking",
  },
  {
    key: "recommendation_experiment",
    name: "Recommendation Experiment",
    description: "A/B test of popularity-based vs personalized recommendations.",
    category: "experimentation",
    type: "experiment",
    variants: [
      { key: "control_popularity_based", label: "Control: Popularity Based", weight: 50 },
      { key: "variant_personalized", label: "Variant: Personalized", weight: 50 },
    ],
    defaultVariant: "control_popularity_based",
  },

  // ---------------------------------------------------------------------
  // Category 7: Kill switches
  // ---------------------------------------------------------------------
  {
    key: "disable_ai_system",
    name: "Disable AI System",
    description: "Operationally kills the AI Assistant module app-wide.",
    category: "kill-switch",
    type: "killswitch",
    defaultValue: false,
  },
  {
    key: "disable_external_api",
    name: "Disable External API",
    description: "Cuts off all outbound calls to external APIs.",
    category: "kill-switch",
    type: "killswitch",
    defaultValue: false,
  },
  {
    key: "disable_exports",
    name: "Disable Exports",
    description: "Blocks all report/dashboard export actions.",
    category: "kill-switch",
    type: "killswitch",
    defaultValue: false,
  },
  {
    key: "maintenance_mode",
    name: "Maintenance Mode",
    description: "Puts the entire application into read-only maintenance mode.",
    category: "kill-switch",
    type: "killswitch",
    defaultValue: false,
  },
];

export const FLAG_MAP: Record<string, FlagDefinition> = Object.fromEntries(
  FLAG_CATALOG.map((f) => [f.key, f])
);

export const FLAG_CATEGORY_LABELS: Record<FlagDefinition["category"], string> = {
  boolean: "Boolean",
  "role-targeting": "Role Targeting",
  "percentage-rollout": "Percentage Rollout",
  multivariate: "Multivariate",
  "dynamic-config": "Dynamic Configuration",
  experimentation: "Experimentation",
  "kill-switch": "Kill Switch",
};
