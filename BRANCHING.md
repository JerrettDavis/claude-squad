# Branching Model

This repository uses a **dual-track branch strategy**:

- `main` → **JerrettDavis distribution branch**
- `dev` → **upstream-compatibility branch**

The goal is to keep local/fork-specific release behavior on `main` while preserving an upstream-mergeable path on `dev`.

---

## Branch Intent

## `main` (fork-owned)
Use for anything specific to the JerrettDavis fork, including:

- Fork-scoped package identity (`@jerrettdavis/*`)
- Fork-specific publish/release workflows
- Repo/account-specific defaults and links
- Operational changes needed to ship and test this fork independently

## `dev` (upstream-aligned)
Use for changes intended to remain mergeable with upstream.

- Keep provider/runtime/docs/test parity work here when possible
- Prefer upstream-neutral naming and behavior
- Avoid fork-only identifiers, secrets, tokens, org-specific links, or publishing assumptions

---

## Hard Rule

**Anything we do not want upstream must stay out of `dev`.**

That includes (non-exhaustive):

- `@jerrettdavis/*` package scope rewrites
- JerrettDavis-only release/publish wiring
- Fork-specific account/org URLs where upstream-neutral alternatives exist
- Local-only operational automation that assumes this fork's ownership

---

## Practical Workflow

1. Start upstream-safe work on `dev`.
2. If a change is fork-specific, target `main` only.
3. Before promoting from `main` into `dev`, remove or revert fork-only deltas.
4. Before opening upstream PRs from `dev`, run a final fork-specific grep pass.

Suggested grep checks:

```bash
rg -n "jerrettdavis|@jerrettdavis|JerrettDavis/claude-squad" .
```

Expected result on `dev`: only intentionally accepted upstream-safe references.

---

## Merge Direction

- `dev` -> upstream PRs (when ready)
- `main` -> fork release/test channel
- Avoid blind `main` -> `dev` merges; cherry-pick only upstream-safe commits
