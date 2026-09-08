import { OpenFeature } from "@openfeature/web-sdk";

import type { ProviderId } from "@/types/provider";
import { buildVendorProvider } from "./vendor-provider-factory";
import { OverrideAwareProvider } from "./override-provider";
import { toEvaluationContext, type FlagEvalIdentity } from "./context";

interface ActiveProviderInfo {
  providerId: ProviderId;
  configured: boolean;
  /** ms elapsed between starting the switch and the provider settling (ready or errored). */
  latencyMs: number;
  readyAt: string;
  /** true if `setProviderAndWait` resolved without throwing. */
  healthy: boolean;
}

let activeInfo: ActiveProviderInfo | null = null;
let activeOverrideProvider: OverrideAwareProvider | null = null;

/**
 * Central OpenFeature bootstrap. Builds the composed provider
 * (`OverrideAwareProvider` wrapping the vendor-specific — or local mock —
 * provider), registers it as OpenFeature's default provider, and sets the
 * initial evaluation context. This is the ONLY place `OpenFeature.setProvider*`
 * is called in the app.
 */
export async function configureFeatureFlagProvider(
  providerId: ProviderId,
  identity: FlagEvalIdentity
): Promise<void> {
  const start = Date.now();
  const { provider: vendorProvider, configured } = buildVendorProvider(providerId);
  const provider = new OverrideAwareProvider(vendorProvider);
  activeOverrideProvider = provider;

  let healthy = true;
  try {
    await OpenFeature.setProviderAndWait(provider, toEvaluationContext(identity));
  } catch {
    // The provider entered an ERROR state (e.g. bad credentials, unreachable
    // proxy). OpenFeature keeps it registered and every flag evaluation from
    // here on returns the caller-supplied default until it recovers — see the
    // "How OpenFeature Works" page for the fallback behavior this produces.
    healthy = false;
  }

  activeInfo = {
    providerId,
    configured,
    latencyMs: Date.now() - start,
    readyAt: new Date().toISOString(),
    healthy,
  };
}

/** Pushes a persona/environment change into the active provider's evaluation context. */
export function updateEvaluationContext(identity: FlagEvalIdentity): void {
  void OpenFeature.setContext(toEvaluationContext(identity));
}

/** Metadata about the currently active provider not covered by the OpenFeature spec (health, connection state). */
export function getActiveProviderInfo(): ActiveProviderInfo | null {
  return activeInfo;
}

/** The current composed provider, for extras like vendor-specific remote flag key introspection. */
export function getActiveOverrideProvider(): OverrideAwareProvider | null {
  return activeOverrideProvider;
}
