import gwcLogo from '../../assets/gwc-logo.png'
import gwcLogoWhite from '../../assets/gwc-logo-white.png'
import coverImage from '../../assets/cover.jpg'
import { ROUTES } from '../../app/routes'

export function renderHomePage(): string {
  return `
    <main class="home-page">
      <header class="home-header">
        <div class="home-header-inner">
          <a href="${ROUTES.HOME}" class="home-brand text-decoration-none">
            <img src="${gwcLogo}" alt="Golden West Colleges logo" class="home-brand-logo" />
            <span class="home-brand-title home-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
            <span class="home-brand-title home-brand-title-short">GWC, INC.</span>
          </a>

          <nav class="home-quick-menu" aria-label="Quick links">
            <a href="#community" class="home-quick-item home-quick-item-icon-only" aria-label="Announcement">
              <span class="home-quick-icon" aria-hidden="true"><i data-lucide="megaphone"></i></span>
            </a>
            <button type="button" class="home-quick-item" data-overlay-open="search">
              <span class="home-quick-icon" aria-hidden="true"><i data-lucide="search"></i></span>
              <span class="home-quick-label">SEARCH</span>
            </button>
            <button type="button" class="home-quick-item" data-overlay-open="menu">
              <span class="home-quick-icon" aria-hidden="true"><i data-lucide="menu"></i></span>
              <span class="home-quick-label">MENU</span>
            </button>
          </nav>
        </div>
      </header>

      <section class="home-overlay" data-overlay="menu" aria-hidden="true">
        <div class="home-overlay-backdrop" data-overlay-close></div>
        <div class="home-overlay-panel home-overlay-panel-menu">
          <div class="home-overlay-topbar">
            <a href="${ROUTES.HOME}" class="home-overlay-brand text-decoration-none" data-overlay-close>
              <img src="${gwcLogoWhite}" alt="Golden West Colleges logo" class="home-overlay-brand-logo" />
              <span class="home-overlay-brand-title home-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="home-overlay-brand-title home-overlay-brand-title-short">GWC, INC.</span>
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
              <span class="home-overlay-brand-title home-overlay-brand-title-short">GWC, INC.</span>
            </a>
            <button type="button" class="home-overlay-close" data-overlay-close aria-label="Close search">×</button>
          </div>
          <div class="home-overlay-accent-line"></div>
          <div class="home-search-center">
            <form class="home-search-form" data-search-form>
              <input type="search" name="q" placeholder="type keyword(s) here" aria-label="Search site" required />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section class="home-cover" style="--home-cover-image: url('${coverImage}');" aria-label="Campus cover image"></section>

      <section class="home-hero">
        <div class="container py-5">
          <div class="row align-items-center g-4">
            <div class="col-12 col-lg-7">
              <p class="home-kicker">Future-Ready Education</p>
              <h1 class="home-hero-title">Shaping competent, service-driven, and globally prepared graduates.</h1>
              <p class="home-hero-text">
                Golden West Colleges empowers learners through academic excellence, community engagement, and
                industry-aligned programs.
              </p>
              <div class="d-flex flex-wrap gap-2">
                <a href="${ROUTES.LOGIN}" class="btn btn-warning px-4 fw-semibold">Go to Portal</a>
                <a href="#academics" class="btn btn-outline-light px-4">View Programs</a>
              </div>
            </div>
            <div class="col-12 col-lg-5">
              <article class="home-feature-card">
                <h2>Admissions 2026</h2>
                <p>Applications are now open for incoming freshmen and transferees.</p>
                <ul class="mb-0">
                  <li>Online pre-registration</li>
                  <li>Scholarship screening</li>
                  <li>On-campus enrollment support</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="academics" class="home-section home-section-light">
        <div class="container py-5">
          <h2 class="home-section-title">Academics</h2>
          <div class="row g-3">
            <div class="col-12 col-md-6 col-lg-3"><article class="home-tile"><h3>Business Education</h3><p>BSA, BSMA, and entrepreneurship pathways.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="home-tile"><h3>Computing Studies</h3><p>BSIT and practical digital skills training.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="home-tile"><h3>Teacher Education</h3><p>Strong licensure preparation and field practice.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="home-tile"><h3>Hospitality & Tourism</h3><p>Industry immersion and global-ready experience.</p></article></div>
          </div>
        </div>
      </section>

      <section id="community" class="home-section home-section-dark">
        <div class="container py-5">
          <h2 class="home-section-title text-white">Community and Extension</h2>
          <p class="home-section-copy text-white-50 mb-4">
            We strengthen local development through outreach, research collaboration, and student-led service initiatives.
          </p>
          <div class="row g-3">
            <div class="col-12 col-lg-4"><article class="home-news-card"><h3>Workforce Development</h3><p>Career readiness and partner-employer matching programs.</p></article></div>
            <div class="col-12 col-lg-4"><article class="home-news-card"><h3>Research Initiatives</h3><p>Applied studies designed to support local policy and innovation.</p></article></div>
            <div class="col-12 col-lg-4"><article class="home-news-card"><h3>Student Services</h3><p>Guidance, health, and library services for holistic growth.</p></article></div>
          </div>
        </div>
      </section>

      <section id="partners" class="home-section home-section-light">
        <div class="container py-5">
          <h2 class="home-section-title">Institutional Partners</h2>
          <div class="home-partner-grid">
            <span>Industry Partners</span>
            <span>Government Units</span>
            <span>Academic Networks</span>
            <span>International Linkages</span>
            <span>Community Organizations</span>
          </div>
        </div>
      </section>

      <footer class="home-footer">
        <div class="container py-4 d-flex flex-column flex-md-row justify-content-between gap-2">
          <p class="mb-0">© Golden West Colleges, Inc.</p>
          <p class="mb-0">Rizal St., Mabalacat City, Pampanga</p>
        </div>
      </footer>
    </main>
  `
}


