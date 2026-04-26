import '../../styles/announcements.css'
import '../../styles/post.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
import { ROUTES } from '../../app/routes'
import { getArticlePosts, getPostPath } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

const cards = getArticlePosts().slice(0, 3)
const latest = cards[0]

export function renderannouncements_page(): string {
  return `
    <main class="ann-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search announcements',
      })}

      <section class="ann-title-block">
        <h1>ANNOUNCEMENTS <i class="ann-megaphone-icon bi bi-megaphone"></i></h1>
      </section>

      <section class="ann-highlight">
        <p>${latest ? `Latest: ${latest.title}` : 'No Recent Announcement Found'}</p>
      </section>

      <section class="ann-list-wrap">
        <div class="post-container">
          <section class="post-related" aria-label="Other announcements">
            <div class="post-related-head">
              <h2>Other Announcements:</h2>
            </div>
            <div class="post-related-grid">
              ${cards
                .map(
                  (card) => `
                <article class="post-related-card">
                  <img class="post-related-image" src="${card.image}" alt="${card.title}" loading="lazy" />
                  <div class="post-related-body">
                    <h3>${card.title}</h3>
                    <p class="post-related-date small text-muted"><i class="post-date-icon bi bi-clock" aria-hidden="true"></i> <strong>posted:</strong> ${card.date}</p>
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




