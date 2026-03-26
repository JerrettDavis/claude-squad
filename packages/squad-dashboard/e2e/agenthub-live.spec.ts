import { test, expect, request } from '@playwright/test'

const API = process.env.E2E_API_BASE_URL || 'http://localhost:8790'

test.describe('AgentHub live data (no mocks)', () => {
  test('empty workspace renders zero-state with screenshot', async ({ page }) => {
    const api = await request.newContext()
    await api.post(`${API}/api/dev/reset`)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
    await expect(page.getByText('0').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-empty-overview.png', fullPage: true })

    await page.goto('/issues')
    await expect(page.getByText('Open (0)')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-empty-issues.png', fullPage: true })
  })

  test('seeded workspace renders populated data with screenshot', async ({ page }) => {
    const api = await request.newContext()
    await api.post(`${API}/api/dev/reset`)
    await api.post(`${API}/api/dev/seed`)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
    await expect(page.getByText('AgentHub: implement local mention parser')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-overview.png', fullPage: true })

    await page.goto('/issues')
    await expect(page.getByText('Open (1)')).toBeVisible()
    await expect(page.getByText('implement local mention parser')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-issues.png', fullPage: true })

    await page.goto('/pulls')
    await expect(page.getByText('mentions + reactions UI')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-prs.png', fullPage: true })

    await page.goto('/activity')
    await expect(page.getByText('issue.comment_added')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-activity.png', fullPage: true })
  })
})
