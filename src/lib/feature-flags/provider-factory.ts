import type { ProviderId } from "@/types/provider";
import type { FeatureProvider } from "./types";
import { LocalMockProvider } from "./providers/local-mock-provider";
import { LaunchDarklyProvider } from "./providers/launchdarkly-provider";
import { UnleashProvider } from "./providers/unleash-provider";
import { FlagsmithProvider } from "./providers/flagsmith-provider";

export function createProvider(providerId: ProviderId): FeatureProvider {
  switch (providerId) {
    case "launchdarkly":
      return new LaunchDarklyProvider();
    case "unleash":
      return new UnleashProvider();
    case "flagsmith":
      return new FlagsmithProvider();
    case "local-mock":
    default:
      return new LocalMockProvider();
  }
}
