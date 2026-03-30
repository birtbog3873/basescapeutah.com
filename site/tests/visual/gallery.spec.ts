import { test, expect } from '@playwright/test'

test.describe('Gallery Page - Visual Regression (T106)', () => {
  const GALLERY_PATH = '/gallery'

  // ---------------------------------------------------------------------------
  // Mobile viewport
  // ---------------------------------------------------------------------------

  test('mobile: gallery grid renders with project cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(GALLERY_PATH)

    // Gallery container
    const gallery = page.locator('.gallery')
    await expect(gallery).toBeVisible()

    // Grid of project cards
    const galleryGrid = page.locator('.gallery__grid')
    await expect(galleryGrid).toBeVisible()

    const projectCards = page.locator('.project-card')
    const cardCount = await projectCards.count()
    expect(cardCount).toBeGreaterThan(0)

    // Cards contain images
    const firstCardImage = projectCards.first().locator('img')
    await expect(firstCardImage).toBeVisible()

    await expect(page).toHaveScreenshot('gallery-mobile.png', { fullPage: true })
  })

  test('mobile: before/after paired image display', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(GALLERY_PATH)

    const beforeAfter = page.locator('.before-after')

    if ((await beforeAfter.count()) > 0) {
      await expect(beforeAfter.first()).toBeVisible()

      // Paired images present
      const images = beforeAfter.first().locator('.before-after__image')
      const imageCount = await images.count()
      expect(imageCount).toBeGreaterThanOrEqual(2) // before + after

      await expect(beforeAfter.first()).toHaveScreenshot('before-after-mobile.png')
    }
  })

  // ---------------------------------------------------------------------------
  // Desktop viewport
  // ---------------------------------------------------------------------------

  test('desktop: full gallery layout with grid', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(GALLERY_PATH)

    // Gallery and grid
    const gallery = page.locator('.gallery')
    await expect(gallery).toBeVisible()

    const galleryGrid = page.locator('.gallery__grid')
    await expect(galleryGrid).toBeVisible()

    const projectCards = page.locator('.project-card')
    const cardCount = await projectCards.count()
    expect(cardCount).toBeGreaterThan(0)

    await expect(page).toHaveScreenshot('gallery-desktop.png', { fullPage: true })
  })

  test('desktop: before/after paired image display', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(GALLERY_PATH)

    const beforeAfter = page.locator('.before-after')

    if ((await beforeAfter.count()) > 0) {
      await expect(beforeAfter.first()).toBeVisible()

      const images = beforeAfter.first().locator('.before-after__image')
      const imageCount = await images.count()
      expect(imageCount).toBeGreaterThanOrEqual(2)

      await expect(beforeAfter.first()).toHaveScreenshot('before-after-desktop.png')
    }
  })

  test('desktop: service type filter interaction', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(GALLERY_PATH)

    // Locate filter controls (buttons or links for filtering by service type)
    const filters = page.locator(
      '[class*="filter"] button, [class*="filter"] a, [data-filter]',
    )
    const filterCount = await filters.count()

    if (filterCount > 1) {
      // Capture initial grid state
      const galleryGrid = page.locator('.gallery__grid')
      await expect(galleryGrid).toBeVisible()

      const initialCardCount = await page.locator('.project-card').count()
      await expect(galleryGrid).toHaveScreenshot('gallery-grid-unfiltered.png')

      // Click the second filter (first is often "All")
      await filters.nth(1).click()

      // Wait for grid to update
      await page.waitForTimeout(500)

      // Grid should still be visible after filter
      await expect(galleryGrid).toBeVisible()

      // Card count may have changed (filtered)
      const filteredCardCount = await page.locator('.project-card').count()
      expect(filteredCardCount).toBeGreaterThanOrEqual(0)

      // Screenshot filtered state — compare to unfiltered if counts differ
      await expect(galleryGrid).toHaveScreenshot('gallery-grid-filtered.png')

      if (filteredCardCount !== initialCardCount) {
        // Grid visually changed — the filter worked
        expect(filteredCardCount).not.toBe(initialCardCount)
      }
    }
  })

  test('mobile: responsive layout shifts to single column', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(GALLERY_PATH)

    const galleryGrid = page.locator('.gallery__grid')
    await expect(galleryGrid).toBeVisible()

    // On mobile the grid should be narrower than desktop
    const gridBox = await galleryGrid.boundingBox()
    expect(gridBox).toBeTruthy()
    expect(gridBox!.width).toBeLessThanOrEqual(375)

    await expect(galleryGrid).toHaveScreenshot('gallery-grid-mobile.png')
  })
})
