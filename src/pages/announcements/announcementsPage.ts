import gwcLogo from '../../assets/gwc-logo.png'
import gwcLogoWhite from '../../assets/gwc-logo-white.png'
import { ROUTES } from '../../app/routes'
import { renderMainSiteHeader } from '../../components/siteHeader'

const cards = [
  {
    title: 'Enrollment Advisory for New Students',
    date: 'August 14, 2026',
    text: 'Please prepare your original credentials and complete online pre-registration before visiting campus.',
  },
  {
    title: 'Scholarship Screening Schedule',
    date: 'August 10, 2026',
    text: 'Qualified applicants may proceed to the Guidance Office for screening and interview schedule confirmation.',
  },
  {
    title: 'Faculty Consultation Week',
    date: 'August 05, 2026',
    text: 'Departments are opening consultation sessions to guide students on subject loads and academic pathways.',
  },
]

export function renderAnnouncementsPage(): string {
  return `
    <main class="ann-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: [
          { type: 'button', icon: 'search', label: 'SEARCH', attrs: 'data-overlay-open="search"' },
          { type: 'button', icon: 'menu', label: 'MENU', attrs: 'data-overlay-open="menu"' },
        ],
      })}

      <section class="home-overlay" data-overlay="menu" aria-hidden="true">
        <div class="home-overlay-backdrop" data-overlay-close></div>
        <div class="home-overlay-panel home-overlay-panel-menu">
          <div class="home-overlay-topbar">
            <a href="${ROUTES.HOME}" class="home-overlay-brand text-decoration-none" data-overlay-close>
              <img src="${gwcLogoWhite}" alt="Golden West Colleges logo" class="home-overlay-brand-logo" />
              <span class="home-overlay-brand-title home-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="home-overlay-brand-title home-overlay-brand-title-short">GWC</span>
            </a>
            <button type="button" class="home-overlay-close" data-overlay-close aria-label="Close menu">×</button>
          </div>
          <div class="home-overlay-accent-line"></div>
          <div class="home-overlay-menu-layout">
            <nav class="home-overlay-menu-col">
              <a href="#academics" data-overlay-close>ACADEMICS</a>
              <a href="${ROUTES.LOGIN}" data-overlay-close>IN CAMPUS</a>
              <a href="#community" data-overlay-close>ADMISSION AND AID</a>
              <a href="#community" data-overlay-close>MCC AND THE COMMUNITY</a>
              <a href="#partners" data-overlay-close>SUSTAINABILITY</a>
              <a href="#partners" data-overlay-close>ABOUT GWC</a>
              <a href="#partners" data-overlay-close>DOWNLOADS</a>
              <a href="#community" data-overlay-close>RESEARCH</a>
            </nav>
            <div class="home-overlay-menu-divider" aria-hidden="true"></div>
            <div class="home-overlay-menu-blank" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <section class="home-overlay" data-overlay="search" aria-hidden="true">
        <div class="home-overlay-backdrop" data-overlay-close></div>
        <div class="home-overlay-panel home-overlay-panel-search">
          <div class="home-overlay-topbar">
            <a href="${ROUTES.HOME}" class="home-overlay-brand text-decoration-none" data-overlay-close>
              <img src="${gwcLogoWhite}" alt="Golden West Colleges logo" class="home-overlay-brand-logo" />
              <span class="home-overlay-brand-title home-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="home-overlay-brand-title home-overlay-brand-title-short">GWC</span>
            </a>
            <button type="button" class="home-overlay-close" data-overlay-close aria-label="Close search">×</button>
          </div>
          <div class="home-overlay-accent-line"></div>
          <div class="home-search-center">
            <form class="home-search-form" data-search-form autocomplete="off">
              <input type="search" name="q" placeholder="type keyword(s) here" aria-label="Search announcements" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" required />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section class="ann-title-block">
        <h1>ANNOUNCEMENTS <i data-lucide="megaphone"></i></h1>
      </section>

      <section class="ann-highlight">
        <p>No Recent Announcement Found</p>
      </section>

      <section class="ann-list-wrap">
        <h2>Other Announcements:</h2>
        <div class="ann-grid">
          ${cards
            .map(
              (card) => `
            <article class="ann-card">
              <div class="ann-card-top"></div>
              <div class="ann-card-body">
                <p class="ann-card-date">${card.date}</p>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
              </div>
            </article>
          `,
            )
            .join('')}
        </div>
      </section>
    </main>
  `
}


