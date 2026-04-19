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
    <main class="ann-page">
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

      <section class="ann-title-block">
        <h1>POST LISTS <i class="ann-megaphone-icon" data-lucide="newspaper"></i></h1>
      </section>

      <section class="ann-highlight">
        <p>${latest ? `Latest: ${latest.title}` : 'No Post Found'}</p>
      </section>

      <section class="ann-list-wrap">
        <h2>All Posts:</h2>
        <div class="ann-grid">
          ${cards
            .map(
              (card) => `
            <article class="ann-card">
              <img class="ann-card-img-top" src="${card.image}" alt="${card.title}" loading="lazy" />
              <div class="ann-card-body">
                <p class="ann-card-date">${card.date}</p>
                <h3>${card.title}</h3>
                <p>${card.excerpt}</p>
              </div>
              <div class="ann-card-footer">
                <a href="${getPostPath(card.slug)}" class="ann-card-footer-link">
                  <span>Read More</span>
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </article>
          `,
            )
            .join('')}
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}
