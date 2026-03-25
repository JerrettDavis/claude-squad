# RFC: Claude Code Runtime Support (Minimal-Change Path)

## Status
Draft (implementation starting)

## Goal
Add first-class Claude Code support to Squad while preserving existing Copilot behavior and minimizing churn.

## Non-Goals
- No wholesale rewrite of coordinator/routing logic.
- No forced migration of existing Copilot users.
- No redesign of `.squad` state model.

## Constraints
- Keep existing Copilot runtime green.
- Introduce runtime-specific behavior behind explicit interfaces.
- Favor additive changes over global renames.

## Current State Summary
Squad is currently deeply coupled to Copilot-specific surfaces:
- Runtime adapter: `@github/copilot-sdk`
- CLI/process commands: `copilot`, `copilot --acp`
- Templates/workflows: `@copilot`, `squad:copilot`, `copilot-swe-agent`
- Skills/MCP conventions: `.copilot/*`

## Proposed Architecture
Introduce a provider abstraction:

```ts
interface RuntimeProvider {
  name: 'copilot' | 'claude-code';
  startSession(opts: StartSessionOptions): Promise<RuntimeSession>;
  send(sessionId: string, input: RuntimeInput): Promise<void>;
  stream(sessionId: string, onEvent: (e: RuntimeEvent) => void): Promise<Unsubscribe>;
  listModels?(): Promise<ModelInfo[]>;
  shutdown(sessionId: string): Promise<void>;
}
```

Implementations:
- `CopilotRuntimeProvider` (adapter over existing behavior)
- `ClaudeCodeRuntimeProvider` (new)

## Minimal-Change Strategy
1. **Extract, don’t rewrite** existing Copilot code into provider implementation.
2. Keep coordinator APIs unchanged where possible.
3. Add runtime selection config (`runtime.default`) with safe default = `copilot`.
4. Make templates runtime-aware using tokenized variants (instead of duplicating whole trees).

## Runtime Selection
- Global config: `runtime.default: copilot | claude-code`
- Optional per-agent override: `agent.runtime`
- CLI overrides (future): `--runtime claude-code`

## Compatibility Model
- Existing repos remain valid.
- Existing commands remain valid.
- Copilot workflow templates unchanged unless runtime=claude-code selected.
- New Claude templates generated only when explicitly requested.

## Risks / Blockers
1. Claude Code event/session semantics may differ from Copilot ACP behavior.
2. GitHub assignment automation differs (`@copilot` conventions are not portable as-is).
3. Runtime-specific docs/instructions files (`CLAUDE.md` vs Copilot instruction paths).

## Validation Plan
- Contract tests for `RuntimeProvider` lifecycle.
- Matrix CI lanes:
  - `RUNTIME=copilot` (must stay green)
  - `RUNTIME=claude-code` (new lane)
- E2E smoke:
  - spawn session
  - send prompt
  - observe streamed response
  - terminate cleanly

## Deliverables (Phase 1)
- Provider interface + Copilot extraction.
- `runtime.default` config support.
- No behavior regression for current users.

## Deliverables (Phase 2)
- Claude provider MVP.
- Runtime-aware template rendering for issue routing/automation.
- Initial Claude docs + setup guidance.
