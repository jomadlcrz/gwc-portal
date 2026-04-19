import gwcLogo from '../../assets/gwc_logo\.avif'
import gwcLogoWhite from '../../assets/gwc_logo_white\.avif'
import { ROUTES } from '../../app/routes'
import { getArticlePosts, getPostPath } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

const cards = getArticlePosts()
const latest = cards[0]

export function renderpost_lists_page(): string {
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

      <section class="post-shell">
        <div class="post-container">
          <section class="post-related" aria-label="All posts">
            <div class="post-related-head">
              <h2>All Posts</h2>
              <span class="post-date-chip">${cards.length} article${cards.length === 1 ? '' : 's'}</span>
            </div>
            ${
              latest
                ? `<section class="post-body"><p>Latest: ${latest.title}</p></section>`
                : '<section class="post-body"><p>No Post Found</p></section>'
            }
            <hr class="post-divider" />
            <div class="post-related-grid">
              ${cards
                .map(
                  (card) => `
                <article class="post-related-card">
                  <img class="post-related-image" src="${card.image}" alt="${card.title}" loading="lazy" />
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
