import gwcLogo from '../../assets/gwc-logo.png'
import gwcLogoWhite from '../../assets/gwc-logo-white.png'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/siteHeader'
import { renderMainSiteFooter } from '../../components/siteFooter'
import { renderHomeOverlays } from '../../components/siteOverlay'

type SearchItem = {
  title: string
  category: 'Articles' | 'Files' | 'Board Resolutions'
  excerpt: string
}

const searchIndex: SearchItem[] = [
  {
    title: 'Enrollment Advisory for New Students',
    category: 'Articles',
    excerpt: 'Prepare original credentials and complete online pre-registration before campus visit.',
  },
  {
    title: 'Scholarship Screening Schedule',
    category: 'Articles',
    excerpt: 'Screening and interview slots are available through the Guidance Office.',
  },
  {
    title: 'Student Handbook 2026 Edition',
    category: 'Files',
    excerpt: 'PDF reference for policies, grading system, and student conduct guidelines.',
  },
  {
    title: 'Admission Requirements Checklist',
    category: 'Files',
    excerpt: 'Downloadable checklist for freshmen, transferees, and returning students.',
  },
  {
    title: 'Board Resolution No. 12, Series of 2026',
    category: 'Board Resolutions',
    excerpt: 'Policy update on tuition structure and installment payment schedule.',
  },
]

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
    return '<p class="search-empty">Sorry, you must enter at least one search criteria before you can continue.</p>'
  }

  const normalized = query.toLowerCase()
  const matches = searchIndex.filter((item) => {
    const title = item.title.toLowerCase()
    const excerpt = item.excerpt.toLowerCase()
    const category = item.category.toLowerCase()
    return title.includes(normalized) || excerpt.includes(normalized) || category.includes(normalized)
  })

  if (matches.length === 0) {
    return `<p class="search-empty">No records found for "${escapeHtml(query)}".</p>`
  }

  return `
    <ul class="search-result-list">
      ${matches
        .map(
          (item) => `
        <li class="search-result-item">
          <p class="search-result-kind">${item.category}</p>
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
        </li>
      `,
        )
        .join('')}
    </ul>
  `
}

export function renderSearchPage(): string {
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

      <section class="search-shell">
        <div class="search-input-row">
          <form action="${ROUTES.SEARCH}" method="get" class="search-query-form">
            <input type="search" name="q" value="${queryEscaped}" placeholder="Search" aria-label="Search site" autofocus />
            <button type="submit">Search</button>
          </form>
        </div>

        <section class="search-result-box" aria-live="polite">
          <div class="search-result-content">
            ${renderSearchResults(query)}
          </div>
        </section>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}
