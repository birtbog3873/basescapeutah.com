import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Homepage - Accessibility (T097)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('passes axe-core scan with no violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('color contrast in hero section passes axe scan', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('[data-section="hero"]')
      .withRules(['color-contrast'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('heading hierarchy: h1 exists, is unique, and h2s follow', async ({
    page,
  }) => {
    const h1s = await page.locator('h1').count()
    expect(h1s).toBe(1)

    const h2s = await page.locator('h2').count()
    expect(h2s).toBeGreaterThan(0)

    // Verify no heading level is skipped: collect all headings in DOM order
    const headingLevels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) =>
        headings.map((h) => parseInt(h.tagName.replace('H', ''), 10))
      )

    // First heading must be h1
    expect(headingLevels[0]).toBe(1)

    // Each subsequent heading should not skip more than one level deeper
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      // Going deeper should only step one level at a time
      if (current > previous) {
        expect(current - previous).toBeLessThanOrEqual(1)
      }
    }
  })

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      // alt must be present (can be empty string for decorative images)
      expect(alt).not.toBeNull()
    }
  })

  test('skip link is present and functional', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"], a[href="#main"]')
    await expect(skipLink.first()).toBeAttached()

    // Focus the skip link (usually first focusable element)
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    const href = await focused.getAttribute('href')
    expect(href).toMatch(/^#main/)

    // Activate skip link and verify focus moves to target
    await page.keyboard.press('Enter')
    const target = await page.locator(':focus').getAttribute('id')
    expect(target).toMatch(/^main/)
  })

  test('keyboard navigation: Tab reaches both CTA buttons', async ({
    page,
  }) => {
    const callNowCta = page.locator(
      'a.cta-block__btn--call, a.mobile-bar__btn--call'
    )
    const estimateCta = page.locator(
      'a:has-text("Book Appointment"), button:has-text("Book Appointment")'
    )

    await expect(callNowCta.first()).toBeVisible()
    await expect(estimateCta.first()).toBeVisible()

    // Tab through the page until we find both CTAs receiving focus
    let callNowFocused = false
    let estimateFocused = false
    const maxTabs = 30

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab')
      const focusedText = await page.locator(':focus').textContent()
      const text = focusedText?.trim() ?? ''

      if (text.match(/\(\d{3}\)\s?\d{3}-\d{4}/)) {
        callNowFocused = true
      }
      if (text.includes('Book Appointment')) {
        estimateFocused = true
      }
      if (callNowFocused && estimateFocused) break
    }

    expect(callNowFocused).toBe(true)
    expect(estimateFocused).toBe(true)
  })
})
