import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Service Page (Walkout Basements) - Accessibility (T099)', () => {
  const servicePath = '/services/walkout-basements'

  test.beforeEach(async ({ page }) => {
    await page.goto(servicePath)
  })

  test('passes axe-core scan with no violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('heading hierarchy: h1 is unique with proper nesting', async ({
    page,
  }) => {
    const h1s = await page.locator('h1').count()
    expect(h1s).toBe(1)

    const h2s = await page.locator('h2').count()
    expect(h2s).toBeGreaterThan(0)

    // Collect all headings in DOM order and verify no levels are skipped
    const headingLevels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) =>
        headings.map((h) => parseInt(h.tagName.replace('H', ''), 10))
      )

    expect(headingLevels[0]).toBe(1)

    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      if (current > previous) {
        expect(current - previous).toBeLessThanOrEqual(1)
      }
    }
  })

  test('all service images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('anxiety stack sections have proper heading structure', async ({
    page,
  }) => {
    // Anxiety stack sections should each have a heading
    const anxietySection = page.locator(
      '[data-section="anxiety-stack"], .anxiety-stack'
    )
    const sectionCount = await anxietySection.count()

    if (sectionCount > 0) {
      for (let i = 0; i < sectionCount; i++) {
        const section = anxietySection.nth(i)
        const headings = section.locator('h2, h3, h4')
        const headingCount = await headings.count()
        expect(headingCount).toBeGreaterThan(0)
      }
    }
  })

  test('FAQ accordion: ARIA attributes are present', async ({ page }) => {
    const faqButtons = page.locator(
      '[data-section="faq"] button, .faq button, details summary'
    )
    const count = await faqButtons.count()
    expect(count).toBeGreaterThan(0)

    // Check first FAQ trigger for ARIA attributes
    const firstTrigger = faqButtons.first()

    // For button-based accordions, check aria-expanded and aria-controls
    const tagName = await firstTrigger.evaluate((el) =>
      el.tagName.toLowerCase()
    )

    if (tagName === 'button') {
      const ariaExpanded = await firstTrigger.getAttribute('aria-expanded')
      expect(ariaExpanded).not.toBeNull()

      const ariaControls = await firstTrigger.getAttribute('aria-controls')
      expect(ariaControls).not.toBeNull()

      // The controlled panel should exist
      if (ariaControls) {
        const panel = page.locator(`#${ariaControls}`)
        await expect(panel).toBeAttached()
      }
    }
    // <details>/<summary> elements have native accessibility built in
  })

  test('FAQ accordion: keyboard navigation expand/collapse', async ({
    page,
  }) => {
    // Find FAQ triggers (buttons or summary elements)
    const faqTriggers = page.locator(
      '[data-section="faq"] button, .faq button, details summary'
    )
    const triggerCount = await faqTriggers.count()
    expect(triggerCount).toBeGreaterThan(0)

    const firstTrigger = faqTriggers.first()
    const tagName = await firstTrigger.evaluate((el) =>
      el.tagName.toLowerCase()
    )

    // Tab to the first FAQ trigger
    await firstTrigger.focus()
    await expect(firstTrigger).toBeFocused()

    if (tagName === 'button') {
      // Button-based accordion
      const ariaControls = await firstTrigger.getAttribute('aria-controls')

      // Press Enter to expand
      await page.keyboard.press('Enter')
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')
      if (ariaControls) {
        await expect(page.locator(`#${ariaControls}`)).toBeVisible()
      }

      // Press Enter again to collapse
      await page.keyboard.press('Enter')
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false')

      // Also verify Space key works
      await page.keyboard.press('Space')
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')

      // Space again to collapse
      await page.keyboard.press('Space')
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false')
    } else if (tagName === 'summary') {
      // Native <details> accordion
      const details = firstTrigger.locator('..')

      // Press Enter to expand
      await page.keyboard.press('Enter')
      await expect(details).toHaveAttribute('open', '')

      // Press Enter again to collapse
      await page.keyboard.press('Enter')
      await expect(details).not.toHaveAttribute('open', '')

      // Verify Space key also works
      await page.keyboard.press('Space')
      await expect(details).toHaveAttribute('open', '')

      await page.keyboard.press('Space')
      await expect(details).not.toHaveAttribute('open', '')
    }
  })
})
