import { describe, expect, it } from "vitest";
import { StandardResolutionReasons } from "@openfeature/web-sdk";

import { LocalMockOpenFeatureProvider } from "./mock-provider";
import { toEvaluationContext } from "./context";

const provider = new LocalMockOpenFeatureProvider();

const employeeCtx = toEvaluationContext({ persona: "employee", environment: "development" });
const executiveCtx = toEvaluationContext({ persona: "executive", environment: "development" });

describe("LocalMockOpenFeatureProvider", () => {
  it("resolves plain boolean flags to their catalog default", () => {
    const result = provider.resolveBooleanEvaluation("enable_dark_mode", false, employeeCtx);
    expect(result.value).toBe(true);
    expect(result.reason).toBe(StandardResolutionReasons.TARGETING_MATCH);
  });

  it("resolves role-targeting flags based on the evaluation context's persona", () => {
    const forEmployee = provider.resolveBooleanEvaluation("executive_dashboard", false, employeeCtx);
    const forExecutive = provider.resolveBooleanEvaluation("executive_dashboard", false, executiveCtx);
    expect(forEmployee.value).toBe(false);
    expect(forExecutive.value).toBe(true);
  });

  it("resolves multivariate flags to one of the defined variant keys, deterministically", () => {
    const first = provider.resolveStringEvaluation("navigation_version", "classic", employeeCtx);
    const second = provider.resolveStringEvaluation("navigation_version", "classic", employeeCtx);
    expect(["classic", "modern", "experimental"]).toContain(first.value);
    expect(second.value).toBe(first.value);
  });

  it("resolves dynamic-config flags to their configured numeric value", () => {
    const result = provider.resolveNumberEvaluation("search_result_limit", 0);
    expect(result.value).toBe(25);
  });

  it("falls back to the caller-supplied default for an unknown flag key", () => {
    const result = provider.resolveBooleanEvaluation("does_not_exist", true, employeeCtx);
    expect(result.value).toBe(true);
    expect(result.reason).toBe(StandardResolutionReasons.DEFAULT);
  });
});
