# AgentHub Local E2E Validation Guide

This document validates the local-only AgentHub stack with **no GitHub integration** and **no UI mocks**.

## Scope

- AgentHub service (`scripts/agenthub-server.mjs`)
- Squad API (`packages/squad-api/src/server.mjs`)
- Dashboard (`packages/squad-dashboard`)
- Live data modes:
  - Empty workspace
  - Seeded workspace (issues, PRs, comments/events, reactions metadata)

## Startup (single command)

```bash
npm run stack:local -- --workspace e2e-demo --fresh --dashboard-port 5195
```

Expected output includes:

- workspace path under `.local/workspaces/e2e-demo`
- API URL
- AgentHub URL
- Dashboard URL

## Data modes

### Empty mode

```bash
curl -X POST http://localhost:8790/api/dev/reset
```

Expected:

- `/api/issues` => `[]`
- `/api/prs` => `[]`
- `/api/agents` => `[]`
- `/api/wiki` => `[]`

### Seeded mode

```bash
curl -X POST http://localhost:8790/api/dev/reset
curl -X POST http://localhost:8790/api/dev/seed
```

Expected seeded sample records:

- 1 issue (with comments count and reactions metadata)
- 1 PR
- 2 agents
- event log entries (including `issue.comment_added`)
- wiki seed page (`agenthub-runbook`)

## Playwright E2E

New live-data suite:

- `packages/squad-dashboard/e2e/agenthub-live.spec.ts`

Covers:

1. Empty workspace visuals and counts
2. Seeded workspace visuals for overview/issues/PRs/activity
3. Interaction mutations (issue comment + reaction) with endpoint assertions and screenshots
3. Screenshot artifacts for both modes

Run:

```bash
cd packages/squad-dashboard
npx playwright test e2e/agenthub-live.spec.ts e2e/agenthub-interactions.spec.ts
```

## Endpoint coverage checklist

- `GET /healthz`
- `POST /api/dev/reset`
- `POST /api/dev/seed`
- `GET /api/issues`
- `GET /api/issues/:number/comments`
- `POST /api/issues/:number/comments`
- `POST /api/issues/:number/reactions`
- `GET /api/prs`
- `GET /api/agents`
- `GET /api/events`
- `GET /api/events/stream`
- `GET /api/wiki`

## Notes

- Running app pages should use live API hooks when `VITE_USE_MOCKS=false`.
- If a page still appears demo-like, verify it no longer imports from `src/data/*mock`.
- Use workspace names to preserve/reload test scenarios; use `--fresh` for clean reset.
