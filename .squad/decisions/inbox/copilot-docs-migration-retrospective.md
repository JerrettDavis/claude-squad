# Docs Retrospective: v0.5.4 → v0.8.x Migration Failure

**Author:** McManus (DevRel)  
**Context:** User migration failed due to stale, fragmented, and version-specific documentation  
**Outcome:** Complete rewrite of 8 docs + 1 blog; identified structural failures in how docs are maintained

---

## What Failed

### 1. **Version Pinning Without Automatic Updates**
- `migration.md` pinned `@0.8.18` in 2024. By 2025, `v0.8.21` shipped—docs not updated.
- Users followed 6-month-old instructions and hit version mismatches.
- `troubleshooting.md` had Node.js "22.0.0" hard-coded with no way to detect drift.
- **Root cause:** No process ties docs to `package.json` version; no CI check for stale references.

### 2. **Multiple Doc Sources for One Topic**
- Migration info scattered across:
  - `migration.md` (global install, v0.5.4 focus)
  - `upgrading.md` (existing v0.8.x users)
  - `scenarios/keep-my-squad.md` (partial overlap)
  - `blog/021-the-migration.md` (historical, v0.8.18 launch)
  - `disaster-recovery.md` (backup scenarios)
- No single source of truth → users got conflicting information.
- **Root cause:** Docs grew organically without a clear domain ownership model.

### 3. **Removed Distributions Not Documented**
- `npx github:bradygaster/squad` was removed but `docs/reference/cli.md` still recommended it.
- `docs/scenarios/upgrading.md` referenced the removed distribution.
- Users who followed old links or guides hit 404s.
- **Root cause:** No "what changed" audit when distributions sunset.

### 4. **Internal Commands Listed as User-Facing**
- `squad migrate` didn't exist in the CLI initially (added in v0.8.20).
- `squad init` is internal, not user-facing, but no docs clarified this.
- Users got confused about which commands were stable/public.
- **Root cause:** No docs-as-contract for CLI; changes made in code without docs sync.

### 5. **No "What's New" for Patch/Minor Releases**
- `whatsnew.md` was missing v0.8.21 section entirely.
- v0.8.18 → v0.8.21 is 3 patch releases—users didn't know what was added.
- Migration guide didn't call out `squad migrate` as NEW (v0.8.20).
- **Root cause:** Release checklist didn't require "what's new" doc updates.

---

## What We Do Now

### Lesson 1: **Pin Docs to Code; Version Everything in CI**
**What we do now:**
- Every version reference in docs (Node.js, package versions, feature availability) gets a `<!-- v0.8.21 -->` HTML comment.
- CI job (on each release) finds all version comments and compares against `package.json`.
- Template in `docs/template.html` defines how version comments are written.
- Release checklist requires: "Run version audit CI before merge."
- If a version reference is >2 releases old, CI fails the build.

### Lesson 2: **Single Source of Truth per Task; Domain Owners**
**What we do now:**
- Docs map to CLI commands/features, not arbitrary topics:
  - `docs/get-started/migration.md` = "getting from old squad to new squad" (owns ALL paths: global, local, CI/CD)
  - `docs/scenarios/upgrading.md` = "already installed, want latest" (owns upgrade/rollback)
  - `docs/scenarios/troubleshooting.md` = "something broke" (owns diagnosis)
  - Blog posts = "announcements and stories" (reference docs, don't duplicate)
- `.squad/decisions.md` now tracks: "migration guide owner: [person]"; quarterly sync review.
- Incoming PRs that touch "migration" route to domain owner for approval.

### Lesson 3: **Breaking Changes & Distribution Sunsets Require Docs Audit**
**What we do now:**
- Release checklist adds:
  ```
  - [ ] List all distributions/commands removed/deprecated in this release
  - [ ] For each: find all docs that mention it; update or flag as breaking change
  - [ ] For each: check GH issues/discussions for user questions on old method; link new method
  ```
- `docs/reference/cli.md` now has a **Deprecated** section at the top with migration paths.
- When `npx github:bradygaster/squad` was removed, a callout was added to `migration.md` with the new command.
- Blog post required on major distribution changes; link from all affected docs.

### Lesson 4: **CLI Commands are Public Contracts; Docs-First Design**
**What we do now:**
- New CLI command = PR flow:
  1. Docs PR adds command to `docs/reference/cli.md` (marking as internal/experimental if needed).
  2. Code PR references docs PR: "See docs/reference/cli.md for contract."
  3. Both reviewed together; code review confirms docs accuracy.
  4. If a command changes after initial PR, docs updated first, then code.
- `squad init` marked **Internal Command** in CLI ref with explanation.
- `squad migrate` has a "Since v0.8.20" tag in docs and CLI help.

### Lesson 5: **Changelog Drives "What's New"; Release Docs Template**
**What we do now:**
- `CHANGELOG.md` is the single source for version changes (required by release checklist).
- `docs/whatsnew.md` auto-generated from CHANGELOG for each release.
- Template in release-checklist.md includes:
  ```
  ## Release Documentation
  - [ ] Update CHANGELOG.md with all changes
  - [ ] Generate docs/whatsnew.md from CHANGELOG (template in docs/template.html)
  - [ ] Verify migration guide links to whatsnew if breaking changes exist
  - [ ] Blog post required for minor+; optional for patches
  ```
- Users always see what changed; `whatsnew.md` is the central hub.

---

## McManus Practices (On Every New Feature/Release)

1. **Read the code PR first.** What's the contract?—What's new, what broke, what's internal?
2. **Check: does a docs PR exist?** If not, ask the author to open one before merge.
3. **Version all references** (code versions, Node versions, URLs) with `<!-- v0.8.21 -->` comments.
4. **Test all links, commands, code examples.** Run them locally or in CI.
5. **Update CHANGELOG before release.** Severity: blocker. (Release checklist already enforces.)
6. **After release: Generate whatsnew section.** Link from migration guide if breaking.
7. **Quarterly: Domain owner review.** Docs ownership shouldn't drift; revisit every release cycle.

---

## Structural Changes Made

- **`.squad/decisions.md`** now has "docs ownership" section
- **`release-checklist.md`** now includes docs sync and version audit steps
- **`docs/reference/cli.md`** has "Internal Command" and "Since vX.Y.Z" labels
- **`docs/whatsnew.md`** template added; generated from CHANGELOG
- **`docs/get-started/migration.md`** is now the canonical source (consolidated 8 docs + updates)
- **CI workflow** (new job) validates version references on every PR to main

---

## Bottom Line

**The failure wasn't about bad docs; it was about docs that couldn't stay in sync with code.** We fixed it by:
- Tying docs to code contracts (CLI as the API).
- Making version references machine-detectable.
- Eliminating duplication (one source per topic).
- Automating what we can (whatsnew generation, version checks).
- Adding docs to the release process, not an afterthought.

Every team member now knows: docs aren't complete until the code is merged AND docs are synced.
