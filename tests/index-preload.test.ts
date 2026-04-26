import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('index.html image preloads', () => {
  const indexHtmlPath = resolve(process.cwd(), 'index.html')
  const html = readFileSync(indexHtmlPath, 'utf-8')

  it('contains required image preload links with explicit types', () => {
    const expectedPreloads = [
      { href: '/images/gwc_logo.avif', type: 'image/avif' },
      { href: '/images/gwc_logo_white.avif', type: 'image/avif' },
      { href: '/images/cover.avif', type: 'image/avif' },
      { href: '/images/gwc_logo_gear.avif', type: 'image/avif' },
      { href: '/images/admission_cover.png', type: 'image/png' },
    ]

    for (const preload of expectedPreloads) {
      const pattern = new RegExp(
        `<link[^>]*rel=["']preload["'][^>]*href=["']${preload.href}["'][^>]*as=["']image["'][^>]*type=["']${preload.type}["'][^>]*>`,
        'i',
      )
      expect(html).toMatch(pattern)
    }
  })
})
