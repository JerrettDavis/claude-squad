# AgentHub (Self-Hosted Orchestration Workflow)

This branch introduces an **AgentHub MVP**: a lightweight, self-hosted orchestration service so Squad can operate without GitHub as the coordination backend.

## Goals

- Run locally via npm (`npm run agenthub:serve`)
- Run remotely (VM, bare metal, container)
- Provide a stable API surface for squad orchestration
- Support a dedicated pipe/parameter contract for routing work to AgentHub

## Start AgentHub locally

```bash
npm run agenthub:serve
```

## One-command local stack (AgentHub + API + Dashboard)

```bash
npm run stack:local -- --workspace demo
```

Useful flags:

- `--workspace <name>`: workspace folder under `.local/workspaces/<name>`
- `--fresh`: reset `.squad` + `.agenthub` state for that workspace before launch
- `--dashboard-port <port>` (default `5173`)
- `--api-port <port>` (default `8790`)
- `--agenthub-port <port>` (default `8787`)

Examples:

```bash
# reusable workspace
npm run stack:local -- --workspace team-a

# clean test run each time
npm run stack:local -- --workspace team-a --fresh
```

Optional env vars:

- `AGENTHUB_HOST` (default `0.0.0.0`)
- `AGENTHUB_PORT` (default `8787`)

## API (MVP)

- `GET /healthz`
- `POST /v1/jobs`
- `GET /v1/jobs`
- `GET /v1/jobs/:id`
- `POST /v1/jobs/:id/cancel`

### Create job request

```json
{
  "pipe": "agenthub",
  "prompt": "Build feature X",
  "parameters": {
    "orchestrator": "agenthub",
    "agenthubUrl": "http://localhost:8787"
  },
  "meta": {
    "team": "default"
  }
}
```

## Proposed Squad runtime contract

To route work through self-hosted AgentHub, we standardize:

- **Pipe:** `agenthub`
- **Parameters:**
  - `orchestrator=agenthub`
  - `agenthubUrl=<base-url>`

## Docker example

```bash
docker run --rm -p 8787:8787 -e AGENTHUB_PORT=8787 -v ${PWD}:/app -w /app node:22 bash -lc "npm ci && npm run agenthub:serve"
```

## CLI routing (Phase 2)

The interactive shell can now route coordinator work to AgentHub via flags:

```bash
squad --orchestrator agenthub --agenthub-url http://localhost:8787
```

This submits coordinator requests as jobs (`pipe=agenthub`) instead of creating a local coordinator session.

## Validation docs

- `docs/agenthub-e2e.md` — local E2E flow, seeded/empty workspace scenarios, endpoint checklist, screenshot coverage.

## Next implementation steps

1. Extend non-shell commands to support AgentHub routing where applicable.
2. Add remote executor mode (webhook or stream callback) for long-running agent runs.
3. Add auth layer (token or mTLS) for remote deployments.
4. Add persistence backend (sqlite/postgres) instead of in-memory queue.
5. Add full integration tests for `--orchestrator agenthub` and failure modes.
