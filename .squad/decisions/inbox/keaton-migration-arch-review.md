# Lessons from Migration Feature Work (Issue #197, PR #199)

**By:** Keaton (Lead)  
**Date:** 2026-03-06  
**Context:** Completed `squad migrate` command (57 tests, 8 pre-PR blockers caught by team review)

---

## Lesson 1: File Ownership Model Must Be Explicit at Design Time

**Problem Found:**
- `config.json` was not in `USER_OWNED`, so migration destroyed user customization
- `casting/registry.json` was marked `SQUAD_OWNED` (wiped), but `sdkInitSquad()` didn't recreate it—stale state
- `.first-run` marker created by `sdkInitSquad()` was left behind post-migrate, causing shell to re-enter Init Mode

**Root Cause:**
The migration command was designed without explicit categorization of what `.squad/` files belong to *system* vs. *user*. This was only discovered when testing the real upgrade path.

**What We Do Now:**
- **Before implementation:** Any feature that touches state files (migrations, exports, imports, resets) must document file ownership explicitly in the proposal (`SQUAD_OWNED` vs. `USER_OWNED`).
- **Add to `.squad/` charter:** "File ownership is non-negotiable architectural context. If unclear, ask Keaton or Baer before coding."
- **Add to checklists:** Code review must include "verify all state files are categorized (SQUAD_OWNED/USER_OWNED)" before approving CLI state mutations.

---

## Lesson 2: Security Boundaries Need Static Enforcement, Not Runtime Checks

**Problem Found:**
- `--restore` and `--backup-dir` had no cwd containment guard—path traversal was possible
- `copyRecursive()` restore targets weren't validated—could write outside `.squad/`
- These blockers came from Baer (Security) in pre-PR team review, not from code review

**Root Cause:**
The migrate command implemented runtime path validation *after* path resolution, which could pass invalid paths through at critical moments. No guard to prevent `--restore ../../../etc`.

**What We Do Now:**
- **New pattern for file operations:** All path flags (`--restore`, `--backup-dir`, etc.) must be validated *before* use: `if (!path.startsWith(cwd)) { throw SquadError }`.
- **Add to security checklist:** CLI commands touching the filesystem must be reviewed by Baer (or designated security owner) before merge.
- **Add to Baer's charter:** "All file I/O in CLI is security-relevant. Path validation non-negotiable."

---

## Lesson 3: Correctness Invariants Must Be Tracked Explicitly

**Problem Found:**
- `runMigrate()` could attempt rollback even if backup failed—risking data loss
- The only guard was "hope the backup completed"—no `backupComplete` flag
- This blocker came from Fenster (Core Dev) in pre-PR review, not from tests

**Root Cause:**
The code had an implicit assumption ("if we reach rollback, backup succeeded") but no enforcement. Test coverage was strong (57 tests) but didn't catch this logic error because happy paths always succeeded.

**What We Do Now:**
- **New pattern for multi-step operations:** If a later step depends on an earlier step succeeding, use an explicit boolean flag (e.g., `backupComplete`). Document it in the code comment.
- **Add to code review checklist:** "Identify preconditions for rollback/cleanup/error paths. Verify they're enforced with explicit state, not implicit assumptions."
- **For next migration-like command:** Fenster reviews the error recovery paths before tests are written.

---

## Lesson 4: Pre-PR Team Review Caught 8 Blockers That Code Review Missed

**Problem Found:**
- Security (path traversal) — caught by Baer
- Correctness (backup incomplete rollback) — caught by Fenster  
- Feature scope (config.json ownership) — caught by Keaton
- UX (sdkInitSquad internal naming, error styling) — caught by Marquez
- Docs (install command incorrect) — caught by McManus
- Plus 3 other fixes

**Root Cause:**
Code review focused on *implementation correctness* (does the code do what it says?). Team review focused on *system correctness* (does this feature fit the architecture and user expectations?).

**What We Do Now:**
- **Mandatory team review gate before PR for high-risk changes:** Features touching:
  - State file mutations (migrations, exports, resets, backups)
  - Security boundaries (path I/O, PII handling)
  - Initialization/lifecycle (init, cleanup, re-entry guards)
  - Should route to relevant agents *before* PR goes up, in a comment: "Ready for pre-PR team review" → Baer, Fenster, Keaton, Marquez
- **Add to routing.md:** High-risk features get async pre-PR feedback from domain owners (security → Baer, core runtime → Fenster, arch → Keaton, UX → Marquez).
- **Document this in CONTRIBUTING.md:** "For features marked as 'high-risk' (migrations, security, lifecycle), request pre-PR feedback in an issue comment before opening the PR."

---

## Lesson 5: PR Target Branch Is a Process Failure Waiting to Happen

**Problem Found:**
- PR #199 was initially opened against `main` instead of `dev` (per CONTRIBUTING.md, features go to `dev`)
- Caught during PR creation, not during code review
- Small mistake, but revealed no automated enforcement

**Root Cause:**
CONTRIBUTING.md documents the rule but GitHub/Git don't enforce it at push/PR-create time.

**What We Do Now:**
- **Add branch protection rule:** Base branch for squad feature PRs must be `dev`, not `main`. Enforce this at GitHub level with branch protection rules.
- **If GitHub enforcement isn't available:** Add a pre-push hook that rejects direct pushes to `main` unless the commit includes "Closes #X" (release workflow exemption).
- **Document in CONTRIBUTING.md:** "Feature branches target `dev`. Release branches target `main`. If you see a PR targeting wrong branch, request change before review."

---

## Summary: Architecture → Process → Codification

| Gap | Addressed By | Now Codified In |
|-----|--------------|-----------------|
| File ownership implicit | Lesson 1 | `.squad/` charter + code review checklist |
| Path validation ad-hoc | Lesson 2 | Security checklist + Baer charter |
| Correctness assumptions unmeasured | Lesson 3 | Code review checklist + Fenster review pattern |
| Team review happened too late | Lesson 4 | Routing.md + CONTRIBUTING.md (pre-PR gate) |
| Branch target not enforced | Lesson 5 | GitHub branch protection rules |

**Captured for:** All future migration-like features, high-risk CLI work, and state-mutation commands.
