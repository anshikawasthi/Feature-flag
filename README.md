This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Feature flags via OpenFeature

All feature flag evaluation in this app goes through [OpenFeature](https://openfeature.dev/), the CNCF
vendor-agnostic feature flag standard. Business code, hooks, and pages never import a vendor SDK directly —
they call `featureFlagService` (`src/lib/feature-flags/feature-flag-service.ts`), which wraps
`OpenFeature.getClient()`.

See the in-app **[How OpenFeature Works](http://localhost:3000/how-openfeature-works)** page for a full
walkthrough of the request flow, architecture, and fallback behavior.

### Architecture

- `src/lib/feature-flags/openfeature/mock-provider.ts` — `LocalMockOpenFeatureProvider`, a fully-featured
  OpenFeature `Provider` backed by the local deterministic mock engine (role targeting, rollout percentages,
  multivariate bucketing). Used directly for the "Local Mock" provider, and automatically as a fallback for any
  real vendor whose credentials aren't configured.
- `src/lib/feature-flags/openfeature/override-provider.ts` — `OverrideAwareProvider`, a decorator `Provider`
  that applies local flag overrides and `dependsOn` cascades in front of whichever provider is active, so this
  logic only needs to exist once.
- `src/lib/feature-flags/openfeature/vendor-provider-factory.ts` — the **only** file that imports a concrete
  vendor SDK-backed `Provider` (`@openfeature/launchdarkly-client-provider`, `@openfeature/unleash-web-provider`,
  `@openfeature/flagsmith-client-provider`).
- `src/lib/feature-flags/openfeature/bootstrap.ts` — calls `OpenFeature.setProviderAndWait(...)` and
  `OpenFeature.setContext(...)`. The only place a provider is registered.
- `src/lib/feature-flags/feature-flag-service.ts` — the public API (`getBooleanFlag`, `getVariant`,
  `getConfigValue`, `getHealth`, etc.) consumed by every hook and page, with safe catalog-default fallbacks.
- `src/context/feature-flag-context.tsx` — bootstraps OpenFeature on mount/provider change and re-renders
  consumers on OpenFeature's own provider events (`Ready`, `ConfigurationChanged`, `ContextChanged`).

### Switching providers

Adding a new vendor means changes in exactly one place, `vendor-provider-factory.ts`:

1. Install its official OpenFeature provider package (see the [OpenFeature ecosystem](https://openfeature.dev/ecosystem) for the current list).
2. Add a `case` to `buildVendorProvider()` that reads the vendor's env var(s) and constructs its `Provider`.
3. Add the vendor to `ProviderId`/`PROVIDERS` in `src/types/provider.ts` so it shows up in the Provider Switcher.

No hook, page, or component needs to change — they all depend only on the standard OpenFeature `Client` via
`featureFlagService`.

Required environment variables per vendor (falls back to the local mock provider when unset):

| Provider     | Env var(s)                                                              |
| ------------ | ------------------------------------------------------------------------ |
| LaunchDarkly | `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID`                                     |
| Unleash      | `NEXT_PUBLIC_UNLEASH_PROXY_URL`, `NEXT_PUBLIC_UNLEASH_CLIENT_KEY`         |
| Flagsmith    | `NEXT_PUBLIC_FLAGSMITH_ENV_ID`                                           |

### Tests

```bash
npm test
```

Runs the Vitest suite covering `LocalMockOpenFeatureProvider`, `OverrideAwareProvider` (override precedence and
`dependsOn` cascading), and `featureFlagService` (registered against an in-memory mock `Provider`, verifying safe
fallback when a provider throws).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
