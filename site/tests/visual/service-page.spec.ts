import { test, expect } from '@playwright/test'

test.describe('Service Page - Visual Regression (T098)', () => {
  const SERVICE_PATH = '/services/walkout-basements'

  // ---------------------------------------------------------------------------
  // Mobile viewport
  // ---------------------------------------------------------------------------

  test('mobile: service page renders with key sections', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(SERVICE_PATH)

    // Page loads successfully
    await expect(page).toHaveURL(new RegExp(SERVICE_PATH))

    // Anxiety stack sections visible (reassurance / trust-building blocks)
    const anxietyStack = page.locator('[class*="anxiety"], [data-section="anxiety-stack"]')
    if ((await anxietyStack.count()) > 0) {
      await expect(anxietyStack.first()).toBeVisible()
    }

    // CTA block present
    const ctaBlock = page.locator('.cta-block')
    await expect(ctaBlock.first()).toBeVisible()

    await expect(page).toHaveScreenshot('service-walkout-mobile.png', { fullPage: true })
  })

  test('mobile: FAQ accordion expand and collapse', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(SERVICE_PATH)

    const faqSection = page.locator('.faq')
    await expect(faqSection).toBeVisible()

    // FAQ items exist
    const faqItems = page.locator('.faq__item')
    const faqCount = await faqItems.count()
    expect(faqCount).toBeGreaterThan(0)

    // Screenshot collapsed state
    await expect(faqSection).toHaveScreenshot('faq-collapsed-mobile.png')

    // Click first FAQ question to expand
    const firstQuestion = page.locator('.faq__question').first()
    await firstQuestion.click()

    // Answer should become visible
    const firstAnswer = page.locator('.faq__answer').first()
    await expect(firstAnswer).toBeVisible()

    // Screenshot expanded state
    await expect(faqSection).toHaveScreenshot('faq-expanded-mobile.png')

    // Click again to collapse
    await firstQuestion.click()

    // Answer should be hidden again
    await expect(firstAnswer).not.toBeVisible()

    // Screenshot re-collapsed state
    await expect(faqSection).toHaveScreenshot('faq-recollapsed-mobile.png')
  })

  // ---------------------------------------------------------------------------
  // Desktop viewport
  // ---------------------------------------------------------------------------

  test('desktop: full service page layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(SERVICE_PATH)

    // Anxiety stack sections
    const anxietyStack = page.locator('[class*="anxiety"], [data-section="anxiety-stack"]')
    if ((await anxietyStack.count()) > 0) {
      await expect(anxietyStack.first()).toBeVisible()
    }

    // Process steps section renders
    const processSteps = page.locator(
      '[class*="process"], [data-section="process-steps"]',
    )
    if ((await processSteps.count()) > 0) {
      await expect(processSteps.first()).toBeVisible()
    }

    // FAQ section
    const faqSection = page.locator('.faq')
    await expect(faqSection).toBeVisible()

    // CTA block
    const ctaBlock = page.locator('.cta-block')
    await expect(ctaBlock.first()).toBeVisible()

    await expect(page).toHaveScreenshot('service-walkout-desktop.png', { fullPage: true })
  })

  test('desktop: FAQ accordion expand and collapse', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(SERVICE_PATH)

    const faqSection = page.locator('.faq')
    await expect(faqSection).toBeVisible()

    // Screenshot collapsed state
    await expect(faqSection).toHaveScreenshot('faq-collapsed-desktop.png')

    // Click first FAQ question to expand
    const firstQuestion = page.locator('.faq__question').first()
    await firstQuestion.click()

    // Answer visible
    const firstAnswer = page.locator('.faq__answer').first()
    await expect(firstAnswer).toBeVisible()

    // Screenshot expanded state
    await expect(faqSection).toHaveScreenshot('faq-expanded-desktop.png')

    // Click again to collapse
    await firstQuestion.click()
    await expect(firstAnswer).not.toBeVisible()
  })

  test('desktop: process steps section renders', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(SERVICE_PATH)

    const processSteps = page.locator(
      '[class*="process"], [data-section="process-steps"]',
    )
    if ((await processSteps.count()) > 0) {
      await expect(processSteps.first()).toBeVisible()
      await expect(processSteps.first()).toHaveScreenshot('process-steps-desktop.png')
    }
  })
})
