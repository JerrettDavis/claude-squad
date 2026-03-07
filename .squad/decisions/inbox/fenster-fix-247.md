# Decision: Optional dependencies must use lazy loading (#247)

**Date:** 2026-03-09
**Author:** Fenster
**Status:** Active

## Context

Issue #247 — two community reports of installation failure caused by top-level imports of `@opentelemetry/api` crashing when the package wasn't properly installed in `npx` temp environments.

## Decision

1. **All optional/telemetry dependencies must be loaded lazily** — never at module top-level. Use `createRequire(import.meta.url)` inside a `try/catch` for synchronous lazy loading.

2. **Centralized wrapper pattern** — when multiple source files import from the same optional package, create a single wrapper module (e.g., `otel-api.ts`) that provides the fallback logic. Consumers import from the wrapper.

3. **`@opentelemetry/api` is now an optionalDependency** — it was a hard dependency but is functionally optional. The SDK operates with no-op telemetry when absent.

4. **`vscode-jsonrpc` added as direct dep** — improves hoisting for npx installs. The ESM subpath import issue (`vscode-jsonrpc/node` without `.js`) is upstream in `@github/copilot-sdk`.

## Implications

- Any new OTel integration must import from `runtime/otel-api.js`, never directly from `@opentelemetry/api`.
- Test files may continue importing `@opentelemetry/api` directly (it's installed in dev).
- If adding new optional dependencies in the future, follow the same lazy-load + wrapper pattern.
