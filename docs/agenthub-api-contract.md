# AgentHub API Contract (GitHub-shaped)

Goal: keep endpoints as close to GitHub REST as practical while adding optional `_agenthub` enrichments.

## Compatibility endpoints

- `GET /repos/{owner}/{repo}/issues`
- `GET /repos/{owner}/{repo}/pulls`
- `GET /repos/{owner}/{repo}/labels`

## Dashboard aliases

- `GET /api/issues`
- `GET /api/prs`
- `GET /api/agents`
- `GET /api/events`

## Response policy

- GitHub-like fields should remain stable for agent portability.
- AgentHub extensions live under `_agenthub` to avoid compatibility breakage.
