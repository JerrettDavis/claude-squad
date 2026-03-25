import { test, expect } from '@playwright/test'

test.describe('Squad Dashboard', () => {
  test('overview page shows stats and agent cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
    await expect(page.getByText('Active Agents')).toBeVisible()
    await expect(page.getByText('Open Issues')).toBeVisible()
    await expect(page.getByText('Open PRs')).toBeVisible()
    await expect(page.getByText('Claude Bot').first()).toBeVisible()
    await expect(page.getByText('Copilot Agent').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/overview.png', fullPage: true })
  })

  test('agents page displays all agents with status', async ({ page }) => {
    await page.goto('/agents')
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible()
    await expect(page.getByText('Claude Bot')).toBeVisible()
    await expect(page.getByText('Copilot Agent')).toBeVisible()
    await expect(page.getByText('JD.AI')).toBeVisible()
    await expect(page.getByText('Ralph (Triage)')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/agents.png', fullPage: true })
  })

  test('issues page shows open and closed tabs', async ({ page }) => {
    await page.goto('/issues')
    await expect(page.getByRole('heading', { name: 'Issues' })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Open/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Closed/ })).toBeVisible()
    await expect(page.getByText('CI/CD tests fail')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/issues-open.png', fullPage: true })

    await page.getByRole('tab', { name: /Closed/ }).click()
    await expect(page.getByText('Package publishing workflow')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/issues-closed.png', fullPage: true })
  })

  test('pull requests page shows PRs with status', async ({ page }) => {
    await page.goto('/pulls')
    await expect(page.getByRole('heading', { name: 'Pull Requests' })).toBeVisible()
    await expect(page.getByText('convert .js test files to ESM')).toBeVisible()
    await expect(page.getByText('Draft')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/pull-requests.png', fullPage: true })
  })

  test('activity feed shows chronological events', async ({ page }) => {
    await page.goto('/activity')
    await expect(page.getByRole('heading', { name: 'Activity Feed' })).toBeVisible()
    await expect(page.getByText('Picked up issue #3')).toBeVisible()
    await expect(page.getByText('Reviewed PR #1')).toBeVisible()
    await expect(page.getByText('Opened PR #1')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/activity-feed.png', fullPage: true })
  })

  test('repository browser shows files and branch picker', async ({ page }) => {
    await page.goto('/repo')
    await expect(page.getByRole('heading', { name: 'Repository' })).toBeVisible()
    await expect(page.getByText('packages')).toBeVisible()
    await expect(page.getByText('README.md')).toBeVisible()
    await expect(page.getByText('index.cjs', { exact: true })).toBeVisible()
    // Branch picker
    await expect(page.getByText('main').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/repo-browser.png', fullPage: true })

    // Open branch picker
    await page.getByText('main').first().click()
    await expect(page.getByText('copilot/fix-ci-cd-tests')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/repo-branch-picker.png', fullPage: true })
  })

  test('branches page shows all branches with status', async ({ page }) => {
    await page.goto('/branches')
    await expect(page.getByRole('heading', { name: 'Branches' })).toBeVisible()
    await expect(page.getByText('main').first()).toBeVisible()
    await expect(page.getByText('default')).toBeVisible()
    await expect(page.getByText('protected')).toBeVisible()
    await expect(page.getByText('copilot/fix-ci-cd-tests')).toBeVisible()
    await expect(page.getByText('feature/squad-dashboard')).toBeVisible()
    await expect(page.getByText('worktree')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/branches.png', fullPage: true })
  })

  test('history page shows commits and diff viewer', async ({ page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible()
    await expect(page.getByText('Select a commit to view its diff')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/history.png', fullPage: true })

    // Click a commit to show diff
    await page.getByText('Add Playwright e2e tests with screenshots').click()
    await expect(page.getByText('index.cjs')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/history-with-diff.png', fullPage: true })
  })

  test('theme toggle cycles through light, dark, and system', async ({ page }) => {
    await page.goto('/')
    // Default should be system (dark on most test environments)
    await page.screenshot({ path: 'e2e/screenshots/theme-dark.png', fullPage: true })

    // Click theme toggle to cycle
    await page.getByTitle(/Theme/).click()
    await page.screenshot({ path: 'e2e/screenshots/theme-toggled.png', fullPage: true })
  })

  test('wiki shows pages and content viewer', async ({ page }) => {
    await page.goto('/wiki')
    await expect(page.getByRole('heading', { name: 'Wiki' })).toBeVisible()
    await expect(page.getByText('Architecture Overview')).toBeVisible()
    await expect(page.getByText('Agent Conventions')).toBeVisible()
    await expect(page.getByText('Select a page to view its content')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/wiki.png', fullPage: true })

    // Select a page
    await page.getByText('Architecture Overview').click()
    await expect(page.getByText('System Components')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/wiki-page.png', fullPage: true })
  })

  test('projects page shows active projects and discussions', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    await expect(page.getByText('Claude Code Adapter for Squad SDK')).toBeVisible()
    await expect(page.getByText('Squad Dashboard — Self-Hosted Agent Management UI')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/projects.png', fullPage: true })

    // Click into a project
    await page.getByText('Claude Code Adapter for Squad SDK').click()
    await expect(page.getByText('RFC: Claude Code Adapter')).toBeVisible()
    await expect(page.getByText('Spec: ClaudeCodeAdapter Interface')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/project-detail.png', fullPage: true })
  })

  test('ralph triage shows pipeline and routing rules', async ({ page }) => {
    await page.goto('/triage')
    await expect(page.getByRole('heading', { name: 'Ralph Triage' })).toBeVisible()
    await expect(page.getByText('Watch', { exact: true })).toBeVisible()
    await expect(page.getByText('Classify', { exact: true })).toBeVisible()
    await expect(page.getByText('Assign', { exact: true })).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/triage-history.png', fullPage: true })

    // Switch to routing rules tab
    await page.getByRole('tab', { name: 'Routing Rules' }).click()
    await expect(page.getByText('Bug fix')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/triage-routing.png', fullPage: true })

    // Switch to capabilities tab
    await page.getByRole('tab', { name: 'Agent Capabilities' }).click()
    await expect(page.getByText('Workload').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/triage-capabilities.png', fullPage: true })
  })

  test('orchestration log shows audit trail', async ({ page }) => {
    await page.goto('/orchestration')
    await expect(page.getByRole('heading', { name: 'Orchestration Log' })).toBeVisible()
    await expect(page.getByText('Assigned to build Wiki and Projects pages')).toBeVisible()
    await expect(page.getByText('Triaged PR #1')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/orchestration-log.png', fullPage: true })
  })

  test('decision inbox shows pending decisions with options', async ({ page }) => {
    await page.goto('/decisions')
    await expect(page.getByRole('heading', { name: 'Decision Inbox' })).toBeVisible()
    await expect(page.getByText('Merge PR #1: ESM Migration')).toBeVisible()
    await expect(page.getByText('recommended').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/decisions-pending.png', fullPage: true })

    // Check resolved tab
    await page.getByRole('tab', { name: /Resolved/ }).click()
    await expect(page.getByText('Dashboard Tech Stack Decision')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/decisions-resolved.png', fullPage: true })
  })

  test('agent steering shows sessions with live output', async ({ page }) => {
    await page.goto('/steering')
    await expect(page.getByRole('heading', { name: 'Agent Steering' })).toBeVisible()
    await expect(page.getByText('Claude Bot')).toBeVisible()
    await expect(page.getByText('Copilot Agent')).toBeVisible()
    await expect(page.getByText('Output').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/steering.png', fullPage: true })
  })

  test('cost tracking shows spending breakdown', async ({ page }) => {
    await page.goto('/costs')
    await expect(page.getByRole('heading', { name: 'Cost Tracking' })).toBeVisible()
    await expect(page.getByText('Total Spend')).toBeVisible()
    await expect(page.getByText('Total Tokens')).toBeVisible()
    await expect(page.getByText('Cost by Agent')).toBeVisible()
    await expect(page.getByText('Daily Cost')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/costs.png', fullPage: true })
  })

  test('sidebar navigation works across all pages', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Squad Dashboard' })).toBeVisible()

    await page.getByRole('link', { name: 'Agents' }).click()
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible()

    await page.getByRole('link', { name: 'Issues' }).click()
    await expect(page.getByRole('heading', { name: 'Issues' })).toBeVisible()

    await page.getByRole('link', { name: 'Pull Requests' }).click()
    await expect(page.getByRole('heading', { name: 'Pull Requests' })).toBeVisible()

    await page.getByRole('link', { name: 'Activity' }).click()
    await expect(page.getByRole('heading', { name: 'Activity Feed' })).toBeVisible()

    await page.getByRole('link', { name: 'Repository' }).click()
    await expect(page.getByRole('heading', { name: 'Repository' })).toBeVisible()

    await page.getByRole('link', { name: 'Branches' }).click()
    await expect(page.getByRole('heading', { name: 'Branches' })).toBeVisible()

    await page.getByRole('link', { name: 'History' }).click()
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible()

    await page.getByRole('link', { name: 'Wiki' }).click()
    await expect(page.getByRole('heading', { name: 'Wiki' })).toBeVisible()

    await page.getByRole('link', { name: 'Projects' }).click()
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()

    await page.getByRole('link', { name: 'Ralph Triage' }).click()
    await expect(page.getByRole('heading', { name: 'Ralph Triage' })).toBeVisible()

    await page.getByRole('link', { name: 'Orchestration Log' }).click()
    await expect(page.getByRole('heading', { name: 'Orchestration Log' })).toBeVisible()

    await page.getByRole('link', { name: 'Decision Inbox' }).click()
    await expect(page.getByRole('heading', { name: 'Decision Inbox' })).toBeVisible()

    await page.getByRole('link', { name: 'Agent Steering' }).click()
    await expect(page.getByRole('heading', { name: 'Agent Steering' })).toBeVisible()

    await page.getByRole('link', { name: 'Cost Tracking' }).click()
    await expect(page.getByRole('heading', { name: 'Cost Tracking' })).toBeVisible()

    await page.getByRole('link', { name: 'Overview' }).click()
    await expect(page.getByText('Monitor your squad at a glance')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/navigation-complete.png', fullPage: true })
  })
})
