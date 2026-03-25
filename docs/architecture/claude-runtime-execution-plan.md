# Claude Runtime Migration Plan (Execution)

## Objective
Ship Claude Code support quickly with minimal code churn and low regression risk.

## Principles
- Additive changes only where possible.
- Keep Copilot runtime as the baseline safety net.
- Ship in thin vertical slices.

## Workstreams

### WS1 — Runtime Interface + Copilot Extraction (Owner: copilot-agent)
- [ ] Add `RuntimeProvider` interface and shared runtime event types.
- [ ] Wrap current Copilot adapter as `CopilotRuntimeProvider`.
- [ ] Add runtime selection in config with default `copilot`.
- [ ] Update coordinator bootstrap to resolve runtime provider from config.

### WS2 — Claude Runtime MVP (Owner: copilot-agent + review)
- [ ] Implement `ClaudeCodeRuntimeProvider` with session lifecycle and streaming hooks.
- [ ] Map Claude runtime errors into existing normalized error taxonomy.
- [ ] Add feature flags/capability flags for unsupported operations.

### WS3 — Templates / Workflows Runtime-Aware (Owner: split with team)
- [ ] Parameterize workflow labels/assignee conventions by runtime.
- [ ] Add Claude-specific automation template variants where needed.
- [ ] Keep existing Copilot templates unchanged by default.

### WS4 — Skills / Hooks / Plugin Compatibility (Owner: split with team)
- [ ] Identify Copilot-specific skill/path assumptions and isolate behind compatibility helpers.
- [ ] Support runtime-specific instruction files (Copilot instructions vs CLAUDE.md pathing guidance).
- [ ] Validate hook execution semantics under both runtimes.

### WS5 — Testing + CI Matrix (Owner: copilot-agent)
- [ ] Add provider contract tests.
- [ ] Add Claude provider smoke tests.
- [ ] Add runtime template rendering tests.
- [ ] Add CI matrix for `RUNTIME=copilot` + `RUNTIME=claude-code`.

## Milestones

### M1 (Foundations)
- Provider interface merged.
- Copilot extraction merged.
- All existing tests green.

### M2 (Claude MVP)
- Claude provider integrated.
- Basic prompt-response flow validated locally.
- Runtime toggle functional.

### M3 (Operational Readiness)
- Runtime-aware templates merged.
- CI matrix green in both modes.
- Docs updated for Claude setup and migration.

## Decision Log (Initial)
1. Do **not** rename `.copilot/*` globally in first phase.
2. Keep `copilot` runtime default until Claude lane proves stable.
3. Prefer runtime-tokenized templates over duplicated workflow stacks.

## Definition of Done
- Squad can run with Claude runtime selected and pass smoke tests.
- Copilot mode remains regression-free.
- Teams can opt in per repo with one config change.
