import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Financing Page - Accessibility (T105)', () => {
  const financingPath = '/financing'

  test.beforeEach(async ({ page }) => {
    await page.goto(financingPath)
  })

  test('passes axe-core scan with no violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('disclaimer text has sufficient color contrast', async ({ page }) => {
    // Target disclaimer/fine-print sections specifically for contrast check
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('financial data sections have proper headings and readable structure', async ({
    page,
  }) => {
    // Verify that sections containing financial data use proper headings
    const sections = page.locator('section, [data-section]')
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(0)

    // Each major section should contain at least one heading
    let sectionsWithHeadings = 0
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const headingCount = await section
        .locator('h1, h2, h3, h4, h5, h6')
        .count()
      if (headingCount > 0) {
        sectionsWithHeadings++
      }
    }
    expect(sectionsWithHeadings).toBeGreaterThan(0)

    // Any data tables should have proper markup
    const tables = page.locator('table')
    const tableCount = await tables.count()
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i)
      // Tables should have <th> elements for headers
      const thCount = await table.locator('th').count()
      expect(thCount).toBeGreaterThan(0)
    }
  })

  test('heading hierarchy is maintained throughout page', async ({ page }) => {
    const h1s = await page.locator('h1').count()
    expect(h1s).toBe(1)

    const h2s = await page.locator('h2').count()
    expect(h2s).toBeGreaterThan(0)

    // Collect all headings and verify no levels are skipped
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

  test('all links are descriptive (no bare "click here")', async ({
    page,
  }) => {
    const links = page.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    const nonDescriptivePatterns = [
      /^click here$/i,
      /^here$/i,
      /^read more$/i,
      /^more$/i,
      /^link$/i,
    ]

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = (await link.textContent())?.trim() ?? ''
      const ariaLabel = await link.getAttribute('aria-label')

      // Link must have either descriptive text or an aria-label
      const effectiveLabel = ariaLabel ?? text

      // Skip empty links that contain images (image alt serves as label)
      if (effectiveLabel === '') {
        const imgCount = await link.locator('img').count()
        const svgCount = await link.locator('svg').count()
        const hasAriaLabelledBy = await link.getAttribute('aria-labelledby')
        expect(
          imgCount > 0 || svgCount > 0 || hasAriaLabelledBy !== null
        ).toBe(true)
        continue
      }

      // Ensure the label is not a generic non-descriptive phrase
      for (const pattern of nonDescriptivePatterns) {
        expect(effectiveLabel).not.toMatch(pattern)
      }
    }
  })
})
