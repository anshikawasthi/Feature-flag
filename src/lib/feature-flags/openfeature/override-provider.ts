import {
  OpenFeatureEventEmitter,
  StandardResolutionReasons,
  type EvaluationContext,
  type JsonValue,
  type Logger,
  type Provider,
  type ProviderMetadata,
  type ResolutionDetails,
} from "@openfeature/web-sdk";

import { FLAG_MAP } from "../catalog";
import { useFlagOverridesStore } from "@/store/flag-overrides-store";

/**
 * Wraps any OpenFeature `Provider` (real vendor or the local mock) and applies
 * two concerns uniformly, regardless of which vendor is active:
 *
 * 1. Local override precedence — values forced via the Flag Override Editor /
 *    Kill Switch Control Center always win over the wrapped provider's value.
 * 2. `dependsOn` cascading — a local catalog concept ("this flag also requires
 *    that flag to be enabled") no vendor backend knows about.
 *
 * This replaces logic that used to be duplicated inside every vendor provider
 * subclass (see git history of `providers/*.ts`) with a single implementation.
 */
export class OverrideAwareProvider implements Provider {
  readonly metadata: ProviderMetadata;
  readonly events: OpenFeatureEventEmitter;

  constructor(private readonly inner: Provider) {
    this.metadata = inner.metadata;
    this.events = inner.events instanceof OpenFeatureEventEmitter ? inner.events : new OpenFeatureEventEmitter();
  }

  /** Access to the wrapped provider, for extras that aren't part of the OpenFeature spec (health, introspection). */
  getInner(): Provider {
    return this.inner;
  }

  async initialize(context?: EvaluationContext): Promise<void> {
    await this.inner.initialize?.(context);
  }

  async onContextChange(oldContext: EvaluationContext, newContext: EvaluationContext): Promise<void> {
    await this.inner.onContextChange?.(oldContext, newContext);
  }

  async onClose(): Promise<void> {
    await this.inner.onClose?.();
  }

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<boolean> {
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    const base =
      override?.enabled !== undefined
        ? { value: override.enabled, reason: StandardResolutionReasons.STATIC, variant: "override" }
        : this.inner.resolveBooleanEvaluation(flagKey, defaultValue, context, logger);

    const dependsOn = FLAG_MAP[flagKey]?.dependsOn;
    if (!dependsOn || !base.value) return base;

    const dependencyResult = this.resolveBooleanEvaluation(dependsOn, false, context, logger);
    return dependencyResult.value ? base : { ...base, value: false };
  }

  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<string> {
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    if (override?.variant !== undefined) {
      return { value: override.variant, reason: StandardResolutionReasons.STATIC, variant: "override" };
    }
    return this.inner.resolveStringEvaluation(flagKey, defaultValue, context, logger);
  }

  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<number> {
    const override = useFlagOverridesStore.getState().overrides[flagKey];
    if (typeof override?.configValue === "number") {
      return { value: override.configValue, reason: StandardResolutionReasons.STATIC, variant: "override" };
    }
    return this.inner.resolveNumberEvaluation(flagKey, defaultValue, context, logger);
  }

  resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<T> {
    return this.inner.resolveObjectEvaluation(flagKey, defaultValue, context, logger);
  }
}
