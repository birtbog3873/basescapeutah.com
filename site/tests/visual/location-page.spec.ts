import { test, expect } from '@playwright/test'

test.describe('Location Page - Visual Regression (T103)', () => {
  const LOCATION_PATH = '/areas/draper-ut'

  // ---------------------------------------------------------------------------
  // Mobile viewport
  // ---------------------------------------------------------------------------

  test('mobile: location page renders with localized content', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LOCATION_PATH)

    await expect(page).toHaveURL(new RegExp(LOCATION_PATH))

    // Localized content section visible
    const locationLayout = page.locator('.location-layout')
    await expect(locationLayout).toBeVisible()

    // Page content should reference Draper
    const pageContent = await page.textContent('body')
    expect(pageContent?.toLowerCase()).toContain('draper')

    // Dual CTAs present
    const callCta = page.locator('.cta-block__btn--call')
    const estimateCta = page.locator('.cta-block__btn--estimate')
    await expect(callCta.first()).toBeVisible()
    await expect(estimateCta.first()).toBeVisible()

    await expect(page).toHaveScreenshot('location-draper-mobile.png', { fullPage: true })
  })

  test('mobile: NAP display matches footer NAP', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LOCATION_PATH)

    // NAP in location layout
    const locationNap = page.locator('.location-layout__nap')
    await expect(locationNap).toBeVisible()
    const locationNapText = await locationNap.textContent()

    // NAP in footer
    const footerNap = page.locator('footer')
    await expect(footerNap).toBeVisible()
    const footerText = await footerNap.textContent()

    // Extract phone number from location NAP and verify it appears in footer
    // Phone numbers typically contain digits and dashes/dots/parens
    const phonePattern = /[\d().\-+\s]{7,}/
    const locationPhone = locationNapText?.match(phonePattern)?.[0]?.replace(/\s/g, '')
    const footerPhone = footerText?.match(phonePattern)?.[0]?.replace(/\s/g, '')

    expect(locationPhone).toBeTruthy()
    expect(footerPhone).toBeTruthy()
    expect(locationPhone).toBe(footerPhone)
  })

  // ---------------------------------------------------------------------------
  // Desktop viewport
  // ---------------------------------------------------------------------------

  test('desktop: full location page layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LOCATION_PATH)

    // Location layout container
    const locationLayout = page.locator('.location-layout')
    await expect(locationLayout).toBeVisible()

    // Localized content references Draper
    const pageContent = await page.textContent('body')
    expect(pageContent?.toLowerCase()).toContain('draper')

    // NAP display
    const nap = page.locator('.location-layout__nap')
    await expect(nap).toBeVisible()

    // Dual CTAs
    const callCta = page.locator('.cta-block__btn--call')
    const estimateCta = page.locator('.cta-block__btn--estimate')
    await expect(callCta.first()).toBeVisible()
    await expect(estimateCta.first()).toBeVisible()

    await expect(page).toHaveScreenshot('location-draper-desktop.png', { fullPage: true })
  })

  test('desktop: local projects gallery or fallback', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LOCATION_PATH)

    // Check for local projects gallery — may have project cards or fallback content
    const projectCards = page.locator('.project-card')
    const gallerySection = page.locator(
      '[class*="gallery"], [class*="projects"], [data-section="local-projects"]',
    )

    const hasProjectCards = (await projectCards.count()) > 0
    const hasGallerySection = (await gallerySection.count()) > 0

    // Either project cards exist or a fallback gallery section is present
    expect(hasProjectCards || hasGallerySection).toBeTruthy()

    if (hasProjectCards) {
      await expect(projectCards.first()).toBeVisible()
      await expect(projectCards.first()).toHaveScreenshot('local-project-card-desktop.png')
    }
  })

  test('desktop: local reviews section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LOCATION_PATH)

    // Local reviews section
    const reviewCards = page.locator('.review-card')

    if ((await reviewCards.count()) > 0) {
      await expect(reviewCards.first()).toBeVisible()

      const firstReviewText = page.locator('.review-card__text').first()
      await expect(firstReviewText).toBeVisible()

      await expect(reviewCards.first()).toHaveScreenshot('local-review-card-desktop.png')
    }
  })
})
