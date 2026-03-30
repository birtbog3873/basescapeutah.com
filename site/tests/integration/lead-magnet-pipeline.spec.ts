import { test, expect } from '@playwright/test'

test.describe('Lead Magnet Pipeline', () => {
  // Skip all tests — requires Astro dev server + Payload CMS running with
  // seed data that includes at least one blog post with a LeadMagnetCTA block.
  // Run `pnpm dev` in the monorepo root before un-skipping.
  test.skip()

  test('submits lead magnet form from blog post and receives download URL', async ({ page }) => {
    // Navigate to blog index to find a post with a lead magnet CTA
    await page.goto('/blog')

    // Click the first blog post link
    const firstPost = page.locator('a[href^="/blog/"]').first()
    await expect(firstPost).toBeVisible()
    await firstPost.click()

    // -----------------------------------------------------------------------
    // Find and fill the lead magnet form
    // -----------------------------------------------------------------------
    const leadMagnetForm = page.locator('[data-form="lead-magnet"]')

    // If no lead magnet form on this post, skip gracefully
    const formCount = await leadMagnetForm.count()
    test.skip(formCount === 0, 'No lead magnet form found on first blog post')

    await expect(leadMagnetForm).toBeVisible()

    // Fill in name and email
    await leadMagnetForm.locator('[name="name"]').fill('Magnet Test User')
    await leadMagnetForm.locator('[name="email"]').fill('magnet-test@example.com')

    // Submit the form
    await leadMagnetForm.getByRole('button', { name: /download|get|submit/i }).click()

    // -----------------------------------------------------------------------
    // Verify success state + download link
    // -----------------------------------------------------------------------
    const successState = leadMagnetForm.locator('[data-state="success"]')
    await expect(successState).toBeVisible({ timeout: 10_000 })

    // A download link should be present in the success state
    const downloadLink = successState.locator('a[href]')
    await expect(downloadLink).toBeVisible()

    // Verify the download URL is a real resource (not empty href)
    const href = await downloadLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href!.length).toBeGreaterThan(1)
  })

  test('lead magnet form validates required email field', async ({ page }) => {
    await page.goto('/blog')

    const firstPost = page.locator('a[href^="/blog/"]').first()
    await expect(firstPost).toBeVisible()
    await firstPost.click()

    const leadMagnetForm = page.locator('[data-form="lead-magnet"]')
    const formCount = await leadMagnetForm.count()
    test.skip(formCount === 0, 'No lead magnet form found on first blog post')

    // Submit without filling any fields
    await leadMagnetForm.getByRole('button', { name: /download|get|submit/i }).click()

    // Form should show validation error — not transition to success
    const successState = leadMagnetForm.locator('[data-state="success"]')
    await expect(successState).not.toBeVisible({ timeout: 2_000 })
  })

  test('lead magnet form accessible from dedicated landing page', async ({ page }) => {
    // Some lead magnets may be hosted on a standalone page rather than
    // embedded in a blog post. Test the /resources or /guides path if present.
    const response = await page.goto('/resources')

    // If the /resources page doesn't exist, skip this test
    test.skip(response?.status() === 404, 'No /resources page available')

    const leadMagnetForm = page.locator('[data-form="lead-magnet"]')
    const formCount = await leadMagnetForm.count()
    test.skip(formCount === 0, 'No lead magnet form found on /resources page')

    await leadMagnetForm.locator('[name="name"]').fill('Resource User')
    await leadMagnetForm.locator('[name="email"]').fill('resource@example.com')
    await leadMagnetForm.getByRole('button', { name: /download|get|submit/i }).click()

    const successState = leadMagnetForm.locator('[data-state="success"]')
    await expect(successState).toBeVisible({ timeout: 10_000 })

    // Verify download link is present
    const downloadLink = successState.locator('a[href]')
    await expect(downloadLink).toBeVisible()
    const href = await downloadLink.getAttribute('href')
    expect(href).toBeTruthy()
  })
})
