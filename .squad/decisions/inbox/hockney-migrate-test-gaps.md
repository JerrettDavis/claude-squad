# Testing Lessons from Migrate Command (57 tests, 5 critical bugs caught)

**By:** Hockney (Tester)  
**Date:** 2026-03-03  
**Context:** Code review of migrate-command.test.ts, cast-guard.test.ts, migrate-e2e.test.ts revealed gaps that allowed 5 bugs to slip through or only surface during peer review.

---

## Executive Summary

We wrote 57 tests for the migrate command and caught 5 significant bugs:
1. **Shell reinit after migrate** — `.first-run` not cleaned after reinit (lifecycle bug)
2. **Casting registry missing** — SDK wipe didn't recreate registry (state loss)
3. **config.json survival** — Not in USER_OWNED, nearly lost during wipe (data loss)
4. **Path traversal** — `--restore` and `--backup-dir` lacked containment checks (security)
5. **Partial backup rollback** — No `backupComplete` flag prevented destructive recovery (data corruption)

**Root cause pattern:** Tests existed but were category-gapped. We tested the happy path and feature branches but didn't test:
- Filesystem state machine transitions (what happens *between* steps?)
- Security boundaries (path containment, symlink traversal)
- Recovery paths under partial failure (backup completeness + rollback)
- Integration points (shell lifecycle through migrate, SDK state recreation)

---

## 3 Lessons + Action Items

### 1. **Lifecycle Tests Must Cross CLI Boundaries**

**Gap:** Tests for migrate existed. Tests for shell first-run gating existed. But NO test covered the contract between them: migrate should NOT trigger re-init when a user runs `squad shell` afterward.

**What happened:**
- Migrate reinit via `sdkInitSquad()` created `.first-run` marker
- Shell checks `.first-run` to decide if init UI should show  
- User sees "Welcome to Squad!" a second time ❌

**What we do now:**
- Every CLI command that modifies `.squad/` must test the downstream lifecycle impact
- For migrate: add test that runs `squad shell` (or at least checks shell entry condition) post-migration
- For any new `--reinit` or `--reset` flag: test that `.first-run`, `.init-prompt`, session markers are in the correct state for the *next* command

**Pattern for new commands:**
```typescript
describe('Downstream shell interaction', () => {
  it('leaves .squad/ in a state that does NOT retrigger init', () => {
    // Run command that reinits
    // Verify firstRunGating conditions are false
    // Verify no leftover init markers exist
  });
});
```

---

### 2. **SQUAD_OWNED vs USER_OWNED Is a Security+Correctness Boundary**

**Gap:** Tests covered individual files in USER_OWNED (team.md, agents/) but didn't test the full set as a category. The list is canonical and easy to get wrong:
```typescript
const USER_OWNED = [
  'team.md', 'agents/', 'identity/', 
  'config.json',  // <-- This was missed initially
  'orchestration-log.md', // etc
];
```

**What happened:**
- Migrate wipes SQUAD_OWNED (templates, casting, etc.)
- Tests verified agents/ survived ✓
- Tests verified team.md survived ✓
- Tests did NOT verify config.json survived ❌
- User lost squad.config.ts-derived config on migrate

**What we do now:**
- Create a `test/fixtures/full-squad-dir.ts` that populates BOTH USER_OWNED and SQUAD_OWNED
- Test that after wipe+reinit, USER_OWNED files are **byte-identical** to before
- Test that SQUAD_OWNED is **recreated fresh** (not preserved)
- Any new file added to USER_OWNED requires:
  1. Update migrate.ts constants
  2. Add to both migrate-command.test.ts and migrate-e2e.test.ts fixture
  3. Add assertion `expect(fs.readFileSync(...)).toBe(originalContent)`

**For all CLI commands that modify `.squad/`:**
- Maintain a shared `USER_OWNED_FILES` constant in a util
- Use it in every test that checks preservation/deletion

---

### 3. **Security Boundaries Need Dedicated Test Category + Fuzzing**

**Gap:** Migrate added `--restore` and `--backup-dir` flags with path containment checks:
```typescript
if (!path.resolve(backupRoot).startsWith(path.resolve(cwd))) {
  error('path must be within the current directory');
}
```

Tests for this existed (line 79 in migrate.ts comment), but only at the unit level. No E2E test.

**What happened:**
- Tests used valid relative/absolute paths within cwd ✓
- Tests did NOT try:
  - `--restore ../../../etc/passwd` (outside cwd)
  - `--restore /tmp/evil` (absolute path outside cwd)
  - `--restore ~/.squad-backup-evil` (symlink traversal)
  - `--backup-dir=.` (current dir, ambiguous)

**What we do now:**
- Every CLI flag that accepts a path gets a dedicated security test block:
  ```typescript
  describe('Security: path containment', () => {
    it('rejects paths outside cwd', () => {
      expect(() => runMigrate(cwd, { restore: '../../../etc/passwd' }))
        .toThrow(/must be within/);
    });
    it('rejects absolute paths outside cwd', () => {
      expect(() => runMigrate(cwd, { restore: '/tmp/evil' }))
        .toThrow(/must be within/);
    });
    it('rejects symlinks that escape cwd', () => {
      // Create a symlink: cwd/.squad-backup-evil -> /tmp
      // Verify it's rejected
    });
  });
  ```
- Assign this test writing to Baer (Security) for review before merge

---

## 4 Patterns for New CLI Commands

When adding a new command (e.g., `squad export`, `squad import`), enforce:

| Pattern | Why | Example Test |
|---------|-----|--------------|
| **Filesystem State Machine** | Commands have pre/post conditions; tests must verify *both* | Before: `.squad/` is X. Command runs. After: `.squad/` is Y. No in-between corruption. |
| **Boundary Categorization** | Files are USER_OWNED or SQUAD_OWNED; tests verify the right category is touched | Add to USER_OWNED? Update fixture + add preservation test. Delete? Add deletion test. |
| **Path Security** | Any `--path`, `--dir`, `--restore` flag must contain-check | `path.resolve(input).startsWith(path.resolve(cwd))` |
| **Recovery Paths** | If command has `--backup`, test that a partial backup doesn't corrupt on rollback | Only restore if `backupComplete` flag is true |
| **Downstream Lifecycle** | Commands that modify `.squad/` must test the next shell/init interaction | After migrate: verify `.first-run` doesn't exist (no re-init) |

---

## Update to Hockney's Charter

Add to `.squad/agents/hockney/charter.md` under "What I Own":

> - **Lifecycle contracts:** CLI commands that modify `.squad/` must test their impact on downstream commands (shell init, casting state, etc.)
> - **Boundary testing:** USER_OWNED vs SQUAD_OWNED file preservation is tested as a category, not piecemeal
> - **Security test blocks:** Any path-accepting flag triggers a dedicated security category with containment, traversal, and symlink tests
> - **Recovery tests:** Backup/restore/rollback paths must test partial failure scenarios (e.g., incomplete backup + forced rollback)

---

## Conclusion

**80% coverage is the floor.** But coverage ≠ completeness. Tests must organize around:
1. **Boundaries** (what changes, what doesn't)
2. **Contracts** (CLI command → downstream lifecycle)
3. **Security** (paths, escapes, boundaries)
4. **Recovery** (partial failure is a feature; test it)

The 5 bugs caught here would have shipped without peer review. Two of them (shell reinit, config.json loss) would hit production users. The migration test gaps are now obvious in hindsight—but only because we wrote 57 tests and forced the team to think hard about what wasn't tested.

Next command: organize tests by these categories from the start.
