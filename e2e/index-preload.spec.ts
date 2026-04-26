import { expect, test } from '@playwright/test'

test.describe('index preload links', () => {
  test('includes required image preload entries with correct types', async ({ page }) => {
    await page.goto('/')

    const expected = [
      { href: '/images/gwc_logo.avif', type: 'image/avif' },
      { href: '/images/gwc_logo_white.avif', type: 'image/avif' },
      { href: '/images/cover.avif', type: 'image/avif' },
      { href: '/images/gwc_logo_gear.avif', type: 'image/avif' },
      { href: '/images/admission_cover.png', type: 'image/png' },
    ]

    for (const preload of expected) {
      const locator = page.locator(
        `head link[rel="preload"][as="image"][href="${preload.href}"][type="${preload.type}"]`,
      )
      await expect(locator).toHaveCount(1)
    }
  })
})
