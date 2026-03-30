import { test, expect } from '@playwright/test'

test.describe('Homepage - Visual Regression (T096)', () => {
  // ---------------------------------------------------------------------------
  // Mobile viewport (375 x 812 — iPhone 13)
  // ---------------------------------------------------------------------------

  test('mobile: hero above-fold content and dual CTAs visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Hero section is present
    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()

    // Hero communicates walkout basements / egress windows specialization
    const heroTitle = page.locator('.hero__title')
    await expect(heroTitle).toBeVisible()
    const titleText = await heroTitle.textContent()
    expect(
      titleText?.toLowerCase().includes('walkout') ||
        titleText?.toLowerCase().includes('egress') ||
        titleText?.toLowerCase().includes('basement'),
    ).toBeTruthy()

    // Hero communicates Utah focus
    const heroContent = await hero.textContent()
    expect(heroContent?.toLowerCase()).toContain('utah')

    // Dual CTAs visible: Phone Number + Book Appointment
    const callCta = page.locator('.cta-block__btn--call')
    const estimateCta = page.locator('.cta-block__btn--estimate')
    await expect(callCta).toBeVisible()
    await expect(estimateCta).toBeVisible()

    // Trust badges section renders
    const trustBadges = page.locator('.trust-badges')
    await expect(trustBadges).toBeVisible()
    const badgeItems = page.locator('.trust-badges__item')
    await expect(badgeItems.first()).toBeVisible()

    await expect(page).toHaveScreenshot('homepage-mobile.png', { fullPage: true })
  })

  test('mobile: trust badges section renders with items', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const trustBadges = page.locator('.trust-badges')
    await expect(trustBadges).toBeVisible()

    const badgeCount = await page.locator('.trust-badges__item').count()
    expect(badgeCount).toBeGreaterThan(0)

    await expect(trustBadges).toHaveScreenshot('trust-badges-mobile.png')
  })

  // ---------------------------------------------------------------------------
  // Desktop viewport (1440 x 900 — wide)
  // ---------------------------------------------------------------------------

  test('desktop: full layout with services overview and reviews', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    // Hero section
    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()

    // Services overview section
    const serviceCards = page.locator('.service-card')
    await expect(serviceCards.first()).toBeVisible()
    const serviceCount = await serviceCards.count()
    expect(serviceCount).toBeGreaterThan(0)

    // Verify at least one service card has a title
    const firstServiceTitle = page.locator('.service-card__title').first()
    await expect(firstServiceTitle).toBeVisible()

    // Reviews section
    const reviewCards = page.locator('.review-card')
    await expect(reviewCards.first()).toBeVisible()
    const firstReviewText = page.locator('.review-card__text').first()
    await expect(firstReviewText).toBeVisible()

    // Trust badges
    const trustBadges = page.locator('.trust-badges')
    await expect(trustBadges).toBeVisible()

    await expect(page).toHaveScreenshot('homepage-desktop.png', { fullPage: true })
  })

  test('desktop: hero communicates specialization and Utah focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()

    // Subtitle should reinforce specialization
    const heroSubtitle = page.locator('.hero__subtitle')
    await expect(heroSubtitle).toBeVisible()

    // Overall hero text should mention specialization + Utah
    const heroText = await hero.textContent()
    const lowerText = heroText?.toLowerCase() ?? ''
    expect(
      lowerText.includes('walkout') ||
        lowerText.includes('egress') ||
        lowerText.includes('basement'),
    ).toBeTruthy()
    expect(lowerText).toContain('utah')

    await expect(hero).toHaveScreenshot('hero-desktop.png')
  })
})
