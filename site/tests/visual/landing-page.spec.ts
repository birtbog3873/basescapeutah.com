import { test, expect } from '@playwright/test'

test.describe('Landing Page - Visual Regression (T107)', () => {
  const LANDING_PATH = '/lp/walkout-spring-2026'

  // ---------------------------------------------------------------------------
  // Mobile viewport
  // ---------------------------------------------------------------------------

  test('mobile: landing page renders with focused offer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LANDING_PATH)

    // Landing layout container
    const landingLayout = page.locator('.landing-layout')
    await expect(landingLayout).toBeVisible()

    // Focused offer content visible
    const pageContent = await page.textContent('body')
    expect(pageContent?.length).toBeGreaterThan(0)

    await expect(page).toHaveScreenshot('landing-walkout-mobile.png', { fullPage: true })
  })

  test('mobile: standard navigation is suppressed', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LANDING_PATH)

    // Main nav links should NOT be present on landing pages
    // Check that typical nav elements (Services, Areas, Gallery, About) are absent
    const mainNav = page.locator('nav a[href="/services"], nav a[href="/gallery"], nav a[href="/about"]')
    const navCount = await mainNav.count()
    expect(navCount).toBe(0)
  })

  test('mobile: embedded form is present', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LANDING_PATH)

    // Either multi-step form or quick-callback form
    const multiForm = page.locator('.multi-form')
    const quickCallback = page.locator('[class*="callback"], [class*="quick-form"]')
    const genericForm = page.locator('form')

    const hasMultiForm = (await multiForm.count()) > 0
    const hasQuickCallback = (await quickCallback.count()) > 0
    const hasGenericForm = (await genericForm.count()) > 0

    expect(hasMultiForm || hasQuickCallback || hasGenericForm).toBeTruthy()

    if (hasMultiForm) {
      await expect(multiForm.first()).toBeVisible()
      const formTitle = page.locator('.multi-form__title')
      if ((await formTitle.count()) > 0) {
        await expect(formTitle.first()).toBeVisible()
      }
      await expect(multiForm.first()).toHaveScreenshot('landing-form-mobile.png')
    }
  })

  test('mobile: trust badges and phone CTA visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LANDING_PATH)

    // Trust badges
    const trustBadges = page.locator('.trust-badges')
    await expect(trustBadges).toBeVisible()

    const badgeItems = page.locator('.trust-badges__item')
    const badgeCount = await badgeItems.count()
    expect(badgeCount).toBeGreaterThan(0)

    // Phone CTA visible (tel: link or call button)
    const phoneCta = page.locator(
      'a[href^="tel:"], .cta-block__btn--call, [class*="phone-cta"]',
    )
    await expect(phoneCta.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Desktop viewport
  // ---------------------------------------------------------------------------

  test('desktop: full landing page layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING_PATH)

    // Landing layout
    const landingLayout = page.locator('.landing-layout')
    await expect(landingLayout).toBeVisible()

    // No standard navigation
    const mainNav = page.locator('nav a[href="/services"], nav a[href="/gallery"], nav a[href="/about"]')
    const navCount = await mainNav.count()
    expect(navCount).toBe(0)

    await expect(page).toHaveScreenshot('landing-walkout-desktop.png', { fullPage: true })
  })

  test('desktop: embedded form present', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING_PATH)

    // Form should be present
    const multiForm = page.locator('.multi-form')
    const quickCallback = page.locator('[class*="callback"], [class*="quick-form"]')
    const genericForm = page.locator('form')

    const hasMultiForm = (await multiForm.count()) > 0
    const hasQuickCallback = (await quickCallback.count()) > 0
    const hasGenericForm = (await genericForm.count()) > 0

    expect(hasMultiForm || hasQuickCallback || hasGenericForm).toBeTruthy()

    if (hasMultiForm) {
      await expect(multiForm.first()).toBeVisible()
      await expect(multiForm.first()).toHaveScreenshot('landing-form-desktop.png')
    }
  })

  test('desktop: trust badges and phone CTA visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING_PATH)

    // Trust badges
    const trustBadges = page.locator('.trust-badges')
    await expect(trustBadges).toBeVisible()

    // Phone CTA
    const phoneCta = page.locator(
      'a[href^="tel:"], .cta-block__btn--call, [class*="phone-cta"]',
    )
    await expect(phoneCta.first()).toBeVisible()

    await expect(trustBadges).toHaveScreenshot('landing-trust-badges-desktop.png')
  })

  test('desktop: focused offer content is prominent', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING_PATH)

    // The landing page should have a clear headline / offer section
    const landingLayout = page.locator('.landing-layout')
    await expect(landingLayout).toBeVisible()

    // Content should reference the spring 2026 offer or walkout basements
    const bodyText = await page.textContent('body')
    const lowerText = bodyText?.toLowerCase() ?? ''
    expect(
      lowerText.includes('walkout') ||
        lowerText.includes('basement') ||
        lowerText.includes('spring') ||
        lowerText.includes('2026'),
    ).toBeTruthy()
  })
})
