import {
  OpenFeatureEventEmitter,
  StandardResolutionReasons,
  type EvaluationContext,
  type JsonValue,
  type Provider,
  type ProviderMetadata,
  type ResolutionDetails,
} from "@openfeature/web-sdk";

import { FLAG_MAP } from "../catalog";
import { resolveBooleanValue, resolveConfigValue, resolveVariant } from "../mock-engine";
import { fromEvaluationContext } from "./context";

/**
 * The vendor-agnostic fallback provider: a fully-featured OpenFeature `Provider`
 * backed entirely by the local deterministic mock engine (role targeting,
 * percentage rollout, multivariate bucketing, dynamic config). Used as the
 * `local-mock` provider itself, and as the automatic fallback whenever a real
 * vendor provider isn't configured (no credentials present).
 *
 * Local override precedence and `dependsOn` cascading are intentionally NOT
 * handled here — that logic is centralized once in `OverrideAwareProvider` so
 * it applies uniformly regardless of which provider (mock or real vendor) is
 * active.
 */
export class LocalMockOpenFeatureProvider implements Provider {
  readonly metadata: ProviderMetadata = { name: "local-mock" };
  readonly events = new OpenFeatureEventEmitter();

  async initialize(): Promise<void> {
    // Small simulated connection delay so the "Connecting to…" UI state is visible,
    // matching the previous LocalMockProvider's behavior.
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean, context: EvaluationContext): ResolutionDetails<boolean> {
    const def = FLAG_MAP[flagKey];
    if (!def) return { value: defaultValue, reason: StandardResolutionReasons.DEFAULT };
    const value = resolveBooleanValue(def, undefined, fromEvaluationContext(context));
    return { value, reason: StandardResolutionReasons.TARGETING_MATCH };
  }

  resolveStringEvaluation(flagKey: string, defaultValue: string, context: EvaluationContext): ResolutionDetails<string> {
    const def = FLAG_MAP[flagKey];
    if (!def) return { value: defaultValue, reason: StandardResolutionReasons.DEFAULT };
    const value = resolveVariant(def, undefined, fromEvaluationContext(context));
    return { value, reason: StandardResolutionReasons.TARGETING_MATCH };
  }

  resolveNumberEvaluation(flagKey: string, defaultValue: number): ResolutionDetails<number> {
    const def = FLAG_MAP[flagKey];
    if (!def) return { value: defaultValue, reason: StandardResolutionReasons.DEFAULT };
    const value = Number(resolveConfigValue(def, undefined));
    return { value: Number.isNaN(value) ? defaultValue : value, reason: StandardResolutionReasons.STATIC };
  }

  resolveObjectEvaluation<T extends JsonValue>(_flagKey: string, defaultValue: T): ResolutionDetails<T> {
    // No dynamic-config flag in the catalog uses JSON/object values today.
    return { value: defaultValue, reason: StandardResolutionReasons.DEFAULT };
  }
}
