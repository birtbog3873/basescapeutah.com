import { test, expect } from '@playwright/test'

test.describe('Lead Pipeline — Multi-Step Form', () => {
  // Skip all tests — requires both the Astro dev server (localhost:4321)
  // and Payload CMS (localhost:3000) running with seed data.
  // Run `pnpm dev` in the monorepo root before un-skipping.
  test.skip()

  test('completes the full multi-step estimate form', async ({ page }) => {
    await page.goto('/contact')

    // -----------------------------------------------------------------------
    // Step 1: Service type + zip code
    // -----------------------------------------------------------------------
    const form = page.locator('.multi-form')
    await expect(form).toBeVisible()

    // Select service type
    await form.locator('[name="serviceType"]').selectOption('walkout-basement')

    // Enter zip code
    await form.locator('[name="zipCode"]').fill('84020')

    // Advance to step 2
    await form.getByRole('button', { name: /next/i }).click()

    // -----------------------------------------------------------------------
    // Step 2: Project purpose + timeline
    // -----------------------------------------------------------------------
    const purposeField = form.locator('[name="projectPurpose"]')
    await expect(purposeField).toBeVisible()

    await purposeField.selectOption('rental-unit')
    await form.locator('[name="timeline"]').selectOption('1-3-months')

    // Advance to step 3
    await form.getByRole('button', { name: /next/i }).click()

    // -----------------------------------------------------------------------
    // Step 3: Contact info + submit
    // -----------------------------------------------------------------------
    const nameField = form.locator('[name="name"]')
    await expect(nameField).toBeVisible()

    await nameField.fill('Test User')
    await form.locator('[name="phone"]').fill('801-555-0000')
    await form.locator('[name="email"]').fill('test@example.com')

    // Submit the form
    await form.getByRole('button', { name: /submit/i }).click()

    // -----------------------------------------------------------------------
    // Success state
    // -----------------------------------------------------------------------
    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 10_000 })
  })

  test('fires Plausible analytics events during form progression', async ({ page }) => {
    // Track calls to window.plausible by injecting a spy before navigation
    const plausibleCalls: string[] = []
    await page.addInitScript(() => {
      ;(window as any).__plausibleCalls = []
      ;(window as any).plausible = (event: string) => {
        ;(window as any).__plausibleCalls.push(event)
      }
    })

    await page.goto('/contact')

    const form = page.locator('.multi-form')
    await expect(form).toBeVisible()

    // Step 1
    await form.locator('[name="serviceType"]').selectOption('walkout-basement')
    await form.locator('[name="zipCode"]').fill('84020')
    await form.getByRole('button', { name: /next/i }).click()

    // Step 2
    await form.locator('[name="projectPurpose"]').selectOption('rental-unit')
    await form.locator('[name="timeline"]').selectOption('1-3-months')
    await form.getByRole('button', { name: /next/i }).click()

    // Step 3
    await form.locator('[name="name"]').fill('Test User')
    await form.locator('[name="phone"]').fill('801-555-0000')
    await form.locator('[name="email"]').fill('test@example.com')
    await form.getByRole('button', { name: /submit/i }).click()

    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 10_000 })

    // Verify Plausible was called at least once (form steps fire events)
    const calls = await page.evaluate(() => (window as any).__plausibleCalls)
    expect(calls.length).toBeGreaterThan(0)
  })
})

test.describe('Lead Pipeline — Quick Callback Form', () => {
  // Skip all tests — requires both dev servers running.
  test.skip()

  test('submits quick callback form and shows success state', async ({ page }) => {
    await page.goto('/')

    // Locate the QuickCallback form (may be in hero, sidebar, or footer)
    const callbackForm = page.locator('[data-form="quick-callback"]')
    await expect(callbackForm).toBeVisible()

    // Fill required fields
    await callbackForm.locator('[name="name"]').fill('Callback User')
    await callbackForm.locator('[name="phone"]').fill('801-555-9999')

    // Submit
    await callbackForm.getByRole('button', { name: /call|submit|request/i }).click()

    // Verify success state appears
    await expect(
      callbackForm.getByText(/thank you|we'll call|received/i),
    ).toBeVisible({ timeout: 10_000 })
  })
})
