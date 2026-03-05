# QA Discipline: Destructive Commands Need Adversarial Testing at Design Time

**Author:** Waingro (Product Dogfooder)  
**Date:** 2026-03-04  
**Status:** Proposal (awaiting Scribe merge)  
**Triggered by:** `squad migrate` post-user-testing bugs

---

## Context

The `squad migrate` command had a pre-PR team review (9 agents) that caught **2/4 critical bugs**. Post-user testing found **2 additional bugs**:

| Bug | Severity | Review | User | Root Cause |
|-----|----------|--------|------|-----------|
| `casting/registry.json` wiped, not recreated | P0 | ❌ | ✅ | SDK skips registry.json; logic gap in migrate |
| `.first-run` marker → re-entry to Init Mode | P1 | ❌ | ✅ | Incomplete marker cleanup |
| `config.json` destroyed (SQUAD_OWNED not USER_OWNED) | P0 | ✅ | N/A | File ownership violation |
| `--restore` path traversal (no cwd containment) | P0 | ✅ | N/A | Missing validation |

This reflects a **QA discipline gap**: code review catches logical and security issues, but destructive operations need adversarial testing for state contamination, version compatibility, and edge cases.

---

## Decision

**For any CLI command that deletes, moves, or overwrites files, the implementation must include:**

1. **File Ownership Matrix** (explicit, non-overlapping)
   - SQUAD_OWNED files (regenerated fresh) vs USER_OWNED files (preserved)
   - No overlap; documented at code level

2. **Gherkin Scenario Matrix** (written at design time)
   - File ownership enforcement scenarios
   - Version-specific regression scenarios (≥2 prior major versions)
   - State contamination scenarios (.first-run, shell markers)
   - Dangerous input scenarios (path traversal, symlinks)
   - Partial failure & rollback scenarios
   - Idempotence scenarios

3. **Pre-Flight Checklist** (in PR template for destructive commands)
   - [ ] File ownership matrix explicit & non-overlapping
   - [ ] Rollback path: error during mutation → restore from backup
   - [ ] Marker cleanup: .first-run, .init-prompt, shell state removed
   - [ ] Path validation: containment checks (startsWith cwd)
   - [ ] Version compat: test ≥2 prior major versions
   - [ ] Idempotence: safe to run twice
   - [ ] Dry-run: pixel-perfect, no mutation
   - [ ] Partial failure: can roll back mid-operation
   - [ ] User communication: next steps clear
   - [ ] Adversarial inputs: path traversal, symlinks, collisions

4. **Shell State Tests** (dedicated test category)
   - Any command touching `.squad/.first-run` or markers
   - Verify shell would NOT re-enter Init Mode post-migration
   - Verify markers are not created during reinit

5. **Version-Specific Fixtures** (test against known cohorts)
   - v0.5.x: no casting/, minimal agents
   - v0.8.x: casting/ present, full registry
   - Current: up-to-date schema
   - Test each variant in isolation

---

## Examples

### Gherkin Scenarios for `squad migrate`

```gherkin
Scenario: Migrate handles repos with no casting state (v0.5.x)
  Given a .squad/ from v0.5.x (no casting/ directory)
  When running 'squad migrate'
  Then registry.json is created from agents/
  And casting/policy.json and casting/history.json are initialized

Scenario: Migrate removes init-mode markers
  Given a migrated repo with agent roster
  When 'squad migrate' completes
  Then .squad/.first-run does NOT exist
  And shell does not re-enter Init Mode

Scenario: --restore rejects path traversal attempts
  When running 'squad migrate --restore ../../etc/passwd'
  Then exit code is 1
  And no files outside cwd are accessed
```

### Pre-Flight Checklist in PR

When reviewing a destructive command, the reviewer should verify all 10 items before approval. Include this checklist in the PR template.

---

## Impact

- **Code review focus:** syntax, logic, security (what reviewers are good at)
- **Adversarial QA focus:** state contamination, version compat, edge cases (what QA is good at)
- **Result:** destructive commands get both disciplines instead of one alone

---

## Implementation

1. Scribe: merge this decision
2. Keaton/Fenster: update PR template to include destructive command checklist
3. Waingro: add "destructive command" tag to issue templates
4. Squad: on next destructive command PR, enforce the checklist
