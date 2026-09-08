import type { EvaluationContext } from "@openfeature/web-sdk";

import type { Persona } from "@/types/persona";
import type { Environment } from "@/types/environment";

export interface FlagEvalIdentity {
  persona: Persona;
  environment: Environment;
}

/**
 * Maps this app's persona/environment concepts onto an OpenFeature
 * `EvaluationContext`. `targetingKey` is the OpenFeature-standard field most
 * providers use for per-user targeting/rollout bucketing (LaunchDarkly's
 * `key`, Unleash's `userId`, Flagsmith's identity) — the vendor providers each
 * translate it to their own SDK's concept internally.
 */
export function toEvaluationContext({ persona, environment }: FlagEvalIdentity): EvaluationContext {
  return {
    targetingKey: persona,
    persona,
    environment,
  };
}

/** Reads persona/environment back out of an OpenFeature context, with safe defaults. */
export function fromEvaluationContext(context: EvaluationContext): FlagEvalIdentity {
  return {
    persona: (context.persona as Persona) ?? "employee",
    environment: (context.environment as Environment) ?? "development",
  };
}
