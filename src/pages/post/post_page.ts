import '../../styles/post.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
import { ROUTES, getPostListsRoute } from '../../app/routes'
import { getPostBySlug, getPostCategorySlug, getPostPath, posts } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPostParagraphs(title: string, excerpt: string, content: string): string[] {
  return [
    excerpt,
    content,
    `${title} reflects GWC's continuing effort to deliver timely, student-centered updates that guide academic planning and campus participation.`,
    'The college encourages students, parents, faculty, and staff to monitor official announcements regularly so important schedules, requirements, and opportunities are not missed.',
  ]
}

export function renderpost_page(slug: string): string | null {
  const post = getPostBySlug(slug)

  if (!post) {
    return null
  }

  const related = posts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3)
  const bodyParagraphs = buildPostParagraphs(post.title, post.excerpt, post.content)

  return `
    <main class="post-page">
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
        searchAriaLabel: 'Search site content',
      })}

      <section class="post-shell">
        <div class="post-container">
          <article class="post-feature">
            ${
              post.image
                ? `<img class="post-image" src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy" />`
                : '<div class="post-image post-image-placeholder" aria-hidden="true"></div>'
            }
            <div class="post-feature-body">
              <h1 class="post-title">${escapeHtml(post.title)}</h1>
              <span class="post-date-chip">${escapeHtml(post.date)}</span>
            </div>
          </article>

          <section class="post-body">
            ${bodyParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          </section>

          <hr class="post-divider" />

          <section class="post-related" aria-label="Related articles">
            <div class="post-related-head">
              <h2>Other Related Articles:</h2>
              <a href="${getPostListsRoute(getPostCategorySlug(post.category))}" class="post-see-more">See More</a>
            </div>
            <div class="post-related-grid">
              ${related
                .map(
                  (item) => `
                <article class="post-related-card">
                  ${
                    item.image
                      ? `<img src="${item.image}" alt="${escapeHtml(item.title)}" class="post-related-image" loading="lazy" />`
                      : '<div class="post-related-image post-related-image-placeholder" aria-hidden="true"></div>'
                  }
                  <div class="post-related-body">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="post-related-date small text-muted"><i class="post-date-icon bi bi-clock" aria-hidden="true"></i> <strong>posted:</strong> ${escapeHtml(item.date)}</p>
                    <p>${escapeHtml(item.excerpt)}</p>
                  </div>
                  <div class="post-related-footer">
                    <a href="${getPostPath(item.slug)}">Read More</a>
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


