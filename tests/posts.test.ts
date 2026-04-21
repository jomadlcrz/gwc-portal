import { describe, expect, it } from 'vitest'

import {
  getPostBySlug,
  getPostCategoryFromSlug,
  getPostPath,
  getPostsByCategory,
} from '../src/data/posts'

describe('posts data helpers', () => {
  it('returns a post by slug', () => {
    const post = getPostBySlug('research-colloquium')
    expect(post).toBeDefined()
    expect(post?.category).toBe('GLOBAL')
  })

  it('builds an encoded post path', () => {
    expect(getPostPath('my slug')).toBe('/post/my%20slug')
  })

  it('parses a category slug case-insensitively', () => {
    expect(getPostCategoryFromSlug('global')).toBe('GLOBAL')
  })

  it('filters posts by category', () => {
    const events = getPostsByCategory('EVENTS')
    expect(events.length).toBeGreaterThan(0)
    expect(events.every((post) => post.category === 'EVENTS')).toBe(true)
  })
})
