import gwcLogo from '../../assets/gwc_logo\.avif'
import gwcLogoWhite from '../../assets/gwc_logo_white\.avif'
import { ROUTES } from '../../app/routes'
import { getPostPath, posts } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

type SearchItem = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  image?: string
}

const searchIndex: SearchItem[] = posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
}))

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getQuery(): string {
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
}

function renderSearchResults(query: string): string {
  if (!query) {
    return '<p class="search-empty">Enter a keyword to search posts.</p>'
  }

  const normalized = query.toLowerCase()
  const matches = searchIndex.filter((item) => {
    const title = item.title.toLowerCase()
    const excerpt = item.excerpt.toLowerCase()
    const content = item.content.toLowerCase()
    return title.includes(normalized) || excerpt.includes(normalized) || content.includes(normalized)
  })

  if (matches.length === 0) {
    return `<p class="search-empty">No records found for "${escapeHtml(query)}".</p>`
  }

  return `
    <header class="search-summary">
      <h2>Found ${matches.length} Result${matches.length === 1 ? '' : 's'} using:</h2>
      <p>Keyword: "<strong>${escapeHtml(query)}</strong>"</p>
    </header>
    <ul class="search-result-list">
      ${matches
        .map(
          (item) => `
        <li class="search-result-item">
          ${
            item.image
              ? `<img class="search-result-thumb" src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" />`
              : '<div class="search-result-thumb search-result-thumb-placeholder" aria-hidden="true"></div>'
          }
          <div class="search-result-body">
            <h3>${item.title}</h3>
            <p class="search-result-date">Posted: ${item.date}</p>
            <p>${item.excerpt}</p>
            <a href="${getPostPath(item.slug)}">Read More</a>
          </div>
        </li>
      `,
        )
        .join('')}
    </ul>
  `
}

export function rendersearch_page(): string {
  const query = getQuery()
  const queryEscaped = escapeHtml(query)

  return `
    <main class="search-page">
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

      <section class="search-shell post-shell">
        <div class="post-container">
          <div class="search-input-row">
            <form action="${ROUTES.SEARCH}" method="get" class="search-query-form">
              <input type="search" name="q" value="${queryEscaped}" placeholder="Search" aria-label="Search site" autofocus />
              <button type="submit" aria-label="Search">
                <i data-lucide="search" aria-hidden="true"></i>
                <span class="search-button-label">Search</span>
              </button>
            </form>
          </div>

          <section class="search-result-box" aria-live="polite">
            <div class="search-result-content">
              ${renderSearchResults(query)}
            </div>
          </section>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}
