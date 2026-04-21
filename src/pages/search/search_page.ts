import '../../styles/search.css'
import '../../styles/post.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
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

function getSearchMatches(query: string): SearchItem[] {
  const normalized = query.toLowerCase()
  if (!query) {
    return []
  }

  return searchIndex.filter((item) => {
    const title = item.title.toLowerCase()
    const excerpt = item.excerpt.toLowerCase()
    const content = item.content.toLowerCase()
    return title.includes(normalized) || excerpt.includes(normalized) || content.includes(normalized)
  })
}

function renderSearchResults(query: string, matches: SearchItem[]): string {

  if (!query) {
    return `
      <div class="search-state-message">
        <h2>Sorry, you must enter at least one search criteria before you can continue</h2>
      </div>
    `
  }

  if (matches.length === 0) {
    return `
      <div class="search-state-message">
        <h2>No Result Found using the keyword:</h2>
        <p><span class="blockquote-footer">Keyword: "<strong>${escapeHtml(query)}</strong>"</span></p>
      </div>
    `
  }

  return `
    <header class="search-summary">
      <h2>Found ${matches.length} Result${matches.length === 1 ? '' : 's'} using:</h2>
      <p><span class="blockquote-footer">Keyword: "<strong>${escapeHtml(query)}</strong>"</span></p>
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
            <p class="search-result-date small text-muted"><svg class="post-date-icon" viewBox="0 0 24 24" width="1.16em" height="1.16em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <strong>posted:</strong> ${item.date}</p>
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
  const matches = getSearchMatches(query)
  const isEmptyState = !query || matches.length === 0
  const shellClass = isEmptyState ? 'search-shell post-shell search-shell-compact' : 'search-shell post-shell'
  const resultBoxClass = isEmptyState ? 'search-result-box search-result-box-empty' : 'search-result-box'

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

      <section class="${shellClass}">
        <div class="post-container">
          <div class="search-input-row">
            <form action="${ROUTES.SEARCH}" method="get" class="search-query-form">
              <input type="search" name="q" value="${queryEscaped}" placeholder="Search" aria-label="Search site" autofocus />
              <button type="submit" aria-label="Search">
                <i class="bi bi-search" aria-hidden="true"></i>
                <span class="search-button-label">Search</span>
              </button>
            </form>
          </div>

          <section class="${resultBoxClass}" aria-live="polite">
            <div class="search-result-content">
              ${renderSearchResults(query, matches)}
            </div>
          </section>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}


