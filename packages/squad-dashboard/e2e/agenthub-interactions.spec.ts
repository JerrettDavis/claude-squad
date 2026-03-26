import { test, expect, request } from '@playwright/test'

const API = process.env.E2E_API_BASE_URL || 'http://localhost:8790'

test.describe('AgentHub interactions (comments + reactions)', () => {
  test('issue comments and reactions mutate real endpoints with screenshots', async ({ page }) => {
    const api = await request.newContext()

    await api.post(`${API}/api/dev/reset`)
    await api.post(`${API}/api/dev/seed`)

    const beforeComments = await (await api.get(`${API}/api/issues/101/comments`)).json()
    expect(beforeComments.length).toBe(3)

    await api.post(`${API}/api/issues/101/comments`, {
      data: { author: 'jd', text: 'Adding one more comment from e2e' },
    })
    await api.post(`${API}/api/issues/101/reactions`, {
      data: { emoji: 'rocket' },
    })

    const afterComments = await (await api.get(`${API}/api/issues/101/comments`)).json()
    expect(afterComments.length).toBe(4)

    const issues = await (await api.get(`${API}/api/issues`)).json()
    const issue101 = issues.find((i: { number: number }) => i.number === 101)
    expect(issue101.comments).toBe(4)
    expect(issue101.reactions.rocket).toBe(1)

    await page.goto('/issues')
    await expect(page.getByText('implement local mention parser')).toBeVisible()
    await expect(page.getByText('Open (1)')).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-issue-comments.png', fullPage: true })

    await page.goto('/activity')
    await expect(page.getByText('issue.comment_added').first()).toBeVisible()
    await expect(page.getByText('issue.reaction_added').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/live-seeded-issue-reactions-activity.png', fullPage: true })
  })
})
