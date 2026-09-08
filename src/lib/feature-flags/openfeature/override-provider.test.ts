import { beforeEach, describe, expect, it } from "vitest";
import { StandardResolutionReasons, type EvaluationContext, type JsonValue, type Provider, type ResolutionDetails } from "@openfeature/web-sdk";

import { OverrideAwareProvider } from "./override-provider";
import { toEvaluationContext } from "./context";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";

/** A trivial stub inner provider returning fixed values per flag key, for isolating override/dependsOn behavior. */
class StubProvider implements Provider {
  readonly metadata = { name: "stub" };
  constructor(private readonly booleans: Record<string, boolean>) {}

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean): ResolutionDetails<boolean> {
    return { value: this.booleans[flagKey] ?? defaultValue, reason: StandardResolutionReasons.STATIC };
  }
  resolveStringEvaluation(_flagKey: string, defaultValue: string): ResolutionDetails<string> {
    return { value: defaultValue, reason: StandardResolutionReasons.STATIC };
  }
  resolveNumberEvaluation(_flagKey: string, defaultValue: number): ResolutionDetails<number> {
    return { value: defaultValue, reason: StandardResolutionReasons.STATIC };
  }
  resolveObjectEvaluation<T extends JsonValue>(_flagKey: string, defaultValue: T): ResolutionDetails<T> {
    return { value: defaultValue, reason: StandardResolutionReasons.STATIC };
  }
}

const ctx: EvaluationContext = toEvaluationContext({ persona: "administrator", environment: "development" });

beforeEach(() => {
  useFlagOverridesStore.getState().clearAll();
});

describe("OverrideAwareProvider", () => {
  it("delegates to the inner provider when no override is set", () => {
    const provider = new OverrideAwareProvider(new StubProvider({ enable_admin_console: true }));
    const result = provider.resolveBooleanEvaluation("enable_admin_console", false, ctx, console);
    expect(result.value).toBe(true);
  });

  it("lets a local override force a boolean value regardless of the inner provider", () => {
    useFlagOverridesStore.getState().setOverride("enable_admin_console", { enabled: false });
    const provider = new OverrideAwareProvider(new StubProvider({ enable_admin_console: true }));
    const result = provider.resolveBooleanEvaluation("enable_admin_console", false, ctx, console);
    expect(result.value).toBe(false);
    expect(result.variant).toBe("override");
  });

  it("cascades dependsOn: a flag can't be enabled while its dependency resolves to false", () => {
    // admin_tools depends on enable_admin_console per the catalog.
    const provider = new OverrideAwareProvider(
      new StubProvider({ admin_tools: true, enable_admin_console: false })
    );
    const result = provider.resolveBooleanEvaluation("admin_tools", false, ctx, console);
    expect(result.value).toBe(false);
  });

  it("dependsOn cascade re-enables once the dependency is overridden on", () => {
    useFlagOverridesStore.getState().setOverride("enable_admin_console", { enabled: true });
    const provider = new OverrideAwareProvider(
      new StubProvider({ admin_tools: true, enable_admin_console: false })
    );
    const result = provider.resolveBooleanEvaluation("admin_tools", false, ctx, console);
    expect(result.value).toBe(true);
  });

  it("lets a local override force a variant/config value", () => {
    useFlagOverridesStore.getState().setOverride("navigation_version", { variant: "experimental" });
    useFlagOverridesStore.getState().setOverride("search_result_limit", { configValue: 99 });
    const provider = new OverrideAwareProvider(new StubProvider({}));

    const variant = provider.resolveStringEvaluation("navigation_version", "classic", ctx, console);
    const config = provider.resolveNumberEvaluation("search_result_limit", 25, ctx, console);

    expect(variant.value).toBe("experimental");
    expect(config.value).toBe(99);
  });
});
