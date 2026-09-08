import { LaunchDarklyClientProvider } from "@openfeature/launchdarkly-client-provider";
import { UnleashWebProvider } from "@openfeature/unleash-web-provider";
import { FlagsmithClientProvider } from "@openfeature/flagsmith-client-provider";
import type { Provider } from "@openfeature/web-sdk";

import type { ProviderId } from "@/types/provider";
import { LocalMockOpenFeatureProvider } from "./mock-provider";

export interface VendorProviderResult {
  provider: Provider;
  configured: boolean;
}

/**
 * The only file in this codebase that imports a concrete vendor-backed
 * OpenFeature `Provider` class. Everything else — hooks, pages, the
 * `FeatureFlagService` — depends only on the standard OpenFeature `Provider`/
 * `Client` interfaces.
 *
 * When a vendor's required env vars are absent, this returns the local mock
 * provider instead of attempting a real connection — the app behaves
 * identically to Local Mock out of the box, with no accounts required.
 */
export function buildVendorProvider(providerId: ProviderId): VendorProviderResult {
  switch (providerId) {
    case "launchdarkly": {
      const clientId = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID?.trim();
      if (!clientId) return { provider: new LocalMockOpenFeatureProvider(), configured: false };
      return { provider: new LaunchDarklyClientProvider(clientId, {}), configured: true };
    }
    case "unleash": {
      const url = process.env.NEXT_PUBLIC_UNLEASH_PROXY_URL?.trim();
      const clientKey = process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY?.trim();
      if (!url || !clientKey) return { provider: new LocalMockOpenFeatureProvider(), configured: false };
      return {
        provider: new UnleashWebProvider({ url, clientKey, appName: "nexus-enterprise" }),
        configured: true,
      };
    }
    case "flagsmith": {
      const environmentID = process.env.NEXT_PUBLIC_FLAGSMITH_ENV_ID?.trim();
      if (!environmentID) return { provider: new LocalMockOpenFeatureProvider(), configured: false };
      return { provider: new FlagsmithClientProvider({ environmentID }), configured: true };
    }
    case "local-mock":
    default:
      return { provider: new LocalMockOpenFeatureProvider(), configured: true };
  }
}
