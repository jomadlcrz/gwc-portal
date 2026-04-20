const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
import { ROUTES } from '../../app/routes'
import type { PostCategory } from '../../data/posts'
import { getPostCategorySlug, getPostPath, getPostsByCategory } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

export function renderpost_lists_page(category: PostCategory): string {
  const cards = getPostsByCategory(category)
  return `
    <main class="post-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.POST_LISTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search post lists',
      })}

      <section class="post-list-hero">
        <div class="post-container post-list-hero-inner">
          <p class="post-list-eyebrow">Other Articles</p>
          <h1 class="post-list-title">${getPostCategorySlug(category)}</h1>
        </div>
      </section>

      <section class="post-shell">
        <div class="post-container">
          <section class="post-related" aria-label="All posts">
            <div class="post-related-grid">
              ${cards
                .map(
                  (card) => `
                <article class="post-related-card">
                  ${
                    card.image
                      ? `<img class="post-related-image" src="${card.image}" alt="${card.title}" loading="lazy" />`
                      : '<div class="post-related-image post-related-image-placeholder" aria-hidden="true"></div>'
                  }
                  <div class="post-related-body">
                    <h3>${card.title}</h3>
                    <p class="post-related-date">Posted: ${card.date}</p>
                    <p>${card.excerpt}</p>
                  </div>
                  <div class="post-related-footer">
                    <a href="${getPostPath(card.slug)}">Read More</a>
                  </div>
                </article>
              `,
                )
                .join('')}
            </div>
          </section>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}


