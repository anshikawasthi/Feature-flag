import { ArrowRight, Layers, ShieldCheck, RefreshCw, Repeat } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FLOW_STEPS = [
  {
    title: "Request",
    detail: "A user loads a page or triggers an action in the app.",
  },
  {
    title: "Application",
    detail: 'Business code asks a question — "is this flag on for this user?" — via FeatureFlagService.',
  },
  {
    title: "OpenFeature Client",
    detail: "The vendor-agnostic client (openfeature/web-sdk) receives the request and applies the current evaluation context.",
  },
  {
    title: "Provider",
    detail: "The registered Provider translates the request into whatever the active vendor's SDK expects.",
  },
  {
    title: "Feature Flag Vendor",
    detail: "LaunchDarkly, Unleash, Flagsmith (or the local mock engine) evaluates targeting rules and returns a result.",
  },
  {
    title: "Response",
    detail: "The Provider normalizes the vendor's result into a standard OpenFeature ResolutionDetails object, and the boolean/string/number value flows back to the UI.",
  },
];

const codeExample = `import { OpenFeature } from "@openfeature/web-sdk";

// 1. Business code never imports a vendor SDK directly.
const client = OpenFeature.getClient();
const showNewDashboard = client.getBooleanValue("new_dashboard", false);

// 2. Only the bootstrap layer knows which vendor is active.
// Switching vendors means swapping this one call — nothing else changes.
await OpenFeature.setProviderAndWait(new LaunchDarklyClientProvider(clientId, {}));
// await OpenFeature.setProviderAndWait(new UnleashWebProvider({ url, clientKey, appName }));
// await OpenFeature.setProviderAndWait(new FlagsmithClientProvider({ environmentID }));`;

export default function HowOpenFeatureWorksPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="How OpenFeature Works"
        description="The vendor-agnostic layer that lets this app switch feature flag providers without touching business code."
      />

      <Card>
        <CardHeader>
          <CardTitle>The core idea</CardTitle>
          <CardDescription>
            OpenFeature is an open specification (a CNCF project) that standardizes how applications ask for
            feature flag values. Instead of every page and component calling a specific vendor&apos;s SDK
            directly, they all talk to one small, stable API: the OpenFeature <span className="font-mono">Client</span>.
            A single, swappable <span className="font-mono">Provider</span> translates those generic requests into
            whatever the active vendor actually needs.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request flow</CardTitle>
          <CardDescription>Every flag evaluation in this app follows the same six steps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-1 items-stretch gap-2">
                <div className="flex flex-1 flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3">
                  <Badge variant="secondary" className="w-fit">
                    {i + 1}. {step.title}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRight className="hidden size-4 shrink-0 self-center text-muted-foreground lg:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4" /> Architecture in this app
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">FeatureFlagService</span> — the only thing pages and
              hooks call. Wraps <span className="font-mono">OpenFeature.getClient()</span> with safe fallback
              defaults.
            </p>
            <p>
              <span className="font-medium text-foreground">OverrideAwareProvider</span> — a decorator Provider
              that applies local overrides (Flag Override Editor, Kill Switches) and <span className="font-mono">dependsOn</span> cascades
              uniformly, in front of whichever vendor is active.
            </p>
            <p>
              <span className="font-medium text-foreground">Vendor Provider Factory</span> — the only file that
              imports a concrete vendor SDK-backed Provider (LaunchDarkly, Unleash, Flagsmith, or the local mock
              engine as automatic fallback when credentials aren&apos;t configured).
            </p>
            <p>
              <span className="font-medium text-foreground">Bootstrap</span> — calls{" "}
              <span className="font-mono">OpenFeature.setProviderAndWait()</span> once per provider switch. This is
              the only place a provider is registered.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="size-4" /> Switching vendors is config-only
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              Because business code (pages, hooks, the flag catalog) only ever talks to the standard OpenFeature{" "}
              <span className="font-mono">Client</span>, changing vendors never means rewriting evaluation logic.
              It means constructing a different <span className="font-mono">Provider</span> instance in one place.
            </p>
            <p>
              Flag keys, default values, targeting rules, and variants are unaffected by which vendor is active —
              they&apos;re defined once in the local catalog and mirrored in whichever vendor project you connect.
            </p>
            <p>
              See the Provider Switcher in Settings to try this live: the same UI code renders identically no
              matter which of Local Mock, LaunchDarkly, Unleash, or Flagsmith is selected.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Code example</CardTitle>
          <CardDescription>Reading a flag, and the one call that changes when switching providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
            <code>{codeExample}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" /> Fallback behavior
          </CardTitle>
          <CardDescription>What happens when a provider isn&apos;t configured or errors out.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <RefreshCw className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-medium text-foreground">Not configured:</span> if a vendor&apos;s required
              environment variable is missing, the app never attempts a real connection — it registers the local
              mock provider instead, so every flag still evaluates deterministically (role targeting, rollout
              percentages, variants) with no account required.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <RefreshCw className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-medium text-foreground">Provider errors at runtime:</span> per the OpenFeature
              spec, if a provider throws or can&apos;t reach its backend, the client returns the default value
              supplied at the call site instead of crashing the app. <span className="font-mono">FeatureFlagService</span>{" "}
              always supplies the catalog&apos;s computed default as that value, so the UI degrades gracefully
              instead of breaking.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <RefreshCw className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-medium text-foreground">Local overrides always win:</span> whether the
              provider is healthy, degraded, or falling back, a forced value from the Flag Override Editor or a
              kill switch is applied before anything else — overrides are checked first in{" "}
              <span className="font-mono">OverrideAwareProvider</span>, ahead of the vendor call.
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
