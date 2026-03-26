import { test, expect } from '@playwright/test'

/**
 * Comprehensive screenshot suite — captures every page in both dark and light mode.
 * Screenshots go to e2e/screenshots/{theme}/{page}.png
 */

const pages = [
  { path: '/', name: 'overview', heading: 'Overview' },
  { path: '/agents', name: 'agents', heading: 'Agents' },
  { path: '/issues', name: 'issues', heading: 'Issues' },
  { path: '/pulls', name: 'pull-requests', heading: 'Pull Requests' },
  { path: '/activity', name: 'activity-feed', heading: 'Activity Feed' },
  { path: '/repo', name: 'repo-browser', heading: 'Repository' },
  { path: '/branches', name: 'branches', heading: 'Branches' },
  { path: '/history', name: 'history', heading: 'History' },
  { path: '/wiki', name: 'wiki', heading: 'Wiki' },
  { path: '/projects', name: 'projects', heading: 'Projects' },
  { path: '/triage', name: 'triage', heading: 'Ralph Triage' },
  { path: '/orchestration', name: 'orchestration', heading: 'Orchestration Log' },
  { path: '/decisions', name: 'decisions', heading: 'Decision Inbox' },
  { path: '/steering', name: 'steering', heading: 'Agent Steering' },
  { path: '/costs', name: 'costs', heading: 'Cost Tracking' },
  { path: '/agent-config', name: 'agent-config', heading: 'Agent Configuration' },
  { path: '/settings', name: 'settings', heading: 'Settings' },
]

const themes = ['dark', 'light'] as const

for (const theme of themes) {
  test.describe(`${theme} mode screenshots`, () => {
    test.beforeEach(async ({ page }) => {
      // Set theme via localStorage before navigating
      await page.addInitScript((t) => {
        localStorage.setItem('squad-theme', t)
      }, theme)
    })

    for (const p of pages) {
      test(`${p.name} (${theme})`, async ({ page }) => {
        await page.goto(p.path)
        await expect(page.getByRole('heading', { name: p.heading })).toBeVisible()
        await page.screenshot({
          path: `e2e/screenshots/${theme}/${p.name}.png`,
          fullPage: true,
        })
      })
    }

    // Extra feature-specific screenshots
    test(`wiki with content selected (${theme})`, async ({ page }) => {
      await page.goto('/wiki')
      await page.getByText('Architecture Overview').click()
      await expect(page.getByText('System Components')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/wiki-content.png`, fullPage: true })
    })

    test(`project detail with discussions (${theme})`, async ({ page }) => {
      await page.goto('/projects')
      await page.getByText('Claude Code Adapter for Squad SDK').click()
      await expect(page.getByText('RFC: Claude Code Adapter')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/project-detail.png`, fullPage: true })
    })

    test(`history with diff viewer (${theme})`, async ({ page }) => {
      await page.goto('/history')
      await page.getByText('Add Playwright e2e tests with screenshots').click()
      await expect(page.getByText('index.cjs')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/history-diff.png`, fullPage: true })
    })

    test(`triage routing rules (${theme})`, async ({ page }) => {
      await page.goto('/triage')
      await page.getByRole('tab', { name: 'Routing Rules' }).click()
      await expect(page.getByText('Bug fix')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/triage-routing.png`, fullPage: true })
    })

    test(`triage capabilities (${theme})`, async ({ page }) => {
      await page.goto('/triage')
      await page.getByRole('tab', { name: 'Agent Capabilities' }).click()
      await expect(page.getByText('Workload').first()).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/triage-capabilities.png`, fullPage: true })
    })

    test(`decisions resolved (${theme})`, async ({ page }) => {
      await page.goto('/decisions')
      await page.getByRole('tab', { name: /Resolved/ }).click()
      await expect(page.getByText('Dashboard Tech Stack Decision')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/decisions-resolved.png`, fullPage: true })
    })

    test(`issues closed tab (${theme})`, async ({ page }) => {
      await page.goto('/issues')
      await page.getByRole('tab', { name: /Closed/ }).click()
      await expect(page.getByText('Package publishing workflow')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/issues-closed.png`, fullPage: true })
    })

    test(`repo branch picker open (${theme})`, async ({ page }) => {
      await page.goto('/repo')
      await page.getByText('main').first().click()
      await expect(page.getByText('copilot/fix-ci-cd-tests')).toBeVisible()
      await page.screenshot({ path: `e2e/screenshots/${theme}/repo-branch-picker.png`, fullPage: true })
    })
  })
}
