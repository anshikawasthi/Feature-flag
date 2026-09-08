import { beforeEach, describe, expect, it } from "vitest";
import { OpenFeature, type Provider, type ResolutionDetails } from "@openfeature/web-sdk";

import { featureFlagService } from "./feature-flag-service";
import { useSettingsStore } from "@/store/settings-store";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";
import { OverrideAwareProvider } from "./openfeature/override-provider";
import { LocalMockOpenFeatureProvider } from "./openfeature/mock-provider";

/** Always throws — used to prove FeatureFlagService falls back safely instead of crashing. */
class ThrowingProvider implements Provider {
  readonly metadata = { name: "throwing" };
  resolveBooleanEvaluation(): ResolutionDetails<boolean> {
    throw new Error("boom");
  }
  resolveStringEvaluation(): ResolutionDetails<string> {
    throw new Error("boom");
  }
  resolveNumberEvaluation(): ResolutionDetails<number> {
    throw new Error("boom");
  }
  resolveObjectEvaluation<T>(): ResolutionDetails<T> {
    throw new Error("boom");
  }
}

beforeEach(() => {
  useFlagOverridesStore.getState().clearAll();
  useSettingsStore.setState({ persona: "employee", environment: "development", provider: "local-mock" });
});

describe("featureFlagService", () => {
  it("reads boolean/variant/config values through an in-memory mock OpenFeature provider", async () => {
    await OpenFeature.setProviderAndWait(new OverrideAwareProvider(new LocalMockOpenFeatureProvider()), {
      targetingKey: "employee",
      persona: "employee",
      environment: "development",
    });

    expect(featureFlagService.getBooleanFlag("enable_dark_mode")).toBe(true);
    expect(featureFlagService.getConfigValue<number>("search_result_limit")).toBe(25);
    expect(["classic", "modern", "experimental"]).toContain(featureFlagService.getVariant("navigation_version"));
  });

  it("respects local overrides applied on top of the active provider", async () => {
    await OpenFeature.setProviderAndWait(new OverrideAwareProvider(new LocalMockOpenFeatureProvider()), {
      targetingKey: "employee",
      persona: "employee",
      environment: "development",
    });
    useFlagOverridesStore.getState().setOverride("enable_dark_mode", { enabled: false });

    expect(featureFlagService.getBooleanFlag("enable_dark_mode")).toBe(false);
  });

  it("falls back to the catalog default instead of throwing when the provider errors", async () => {
    await OpenFeature.setProviderAndWait(new ThrowingProvider(), {}).catch(() => {
      // Expected: ThrowingProvider has no initialize(), so this resolves; if a future
      // change makes it throw during init, OpenFeature still registers the provider.
    });

    expect(() => featureFlagService.getBooleanFlag("enable_dark_mode")).not.toThrow();
    // enable_dark_mode's catalog default is `true`.
    expect(featureFlagService.getBooleanFlag("enable_dark_mode")).toBe(true);
  });
});
