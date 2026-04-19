import gwcLogo from '../../assets/gwc_logo\.avif'
import gwcLogoWhite from '../../assets/gwc_logo_white\.avif'
import coverImage from '../../assets/cover\.avif'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

export function renderhome_page(): string {
  return `
    <main class="site-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS),
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search site',
      })}

      <section class="site-cover" style="--site-cover-image: url('${coverImage}');" aria-label="Campus cover image"></section>

      <section class="site-hero">
        <div class="container py-5">
          <div class="row align-items-center g-4">
            <div class="col-12 col-lg-7">
              <p class="site-kicker">Future-Ready Education</p>
              <h1 class="site-hero-title">Shaping competent, service-driven, and globally prepared graduates.</h1>
              <p class="site-hero-text">
                Golden West Colleges empowers learners through academic excellence, community engagement, and
                industry-aligned programs.
              </p>
              <div class="d-flex flex-wrap gap-2">
                <a href="${ROUTES.STUDENT_LOGIN}" class="btn btn-warning px-4 fw-semibold">Go to Portal</a>
                <a href="#academics" class="btn btn-outline-light px-4">View Programs</a>
              </div>
            </div>
            <div class="col-12 col-lg-5">
              <article class="site-feature-card">
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

      <section id="academics" class="site-section site-section-light">
        <div class="container py-5">
          <h2 class="site-section-title">Academics</h2>
          <div class="row g-3">
            <div class="col-12 col-md-6 col-lg-3"><article class="site-tile"><h3>Business Education</h3><p>BSA, BSMA, and entrepreneurship pathways.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="site-tile"><h3>Computing Studies</h3><p>BSIT and practical digital skills training.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="site-tile"><h3>Teacher Education</h3><p>Strong licensure preparation and field practice.</p></article></div>
            <div class="col-12 col-md-6 col-lg-3"><article class="site-tile"><h3>Hospitality & Tourism</h3><p>Industry immersion and global-ready experience.</p></article></div>
          </div>
        </div>
      </section>

      <section id="community" class="site-section site-section-dark">
        <div class="container py-5">
          <h2 class="site-section-title text-white">Community and Extension</h2>
          <p class="site-section-copy text-white-50 mb-4">
            We strengthen local development through outreach, research collaboration, and student-led service initiatives.
          </p>
          <div class="row g-3">
            <div class="col-12 col-lg-4"><article class="site-news-card"><h3>Workforce Development</h3><p>Career readiness and partner-employer matching programs.</p></article></div>
            <div class="col-12 col-lg-4"><article class="site-news-card"><h3>Research Initiatives</h3><p>Applied studies designed to support local policy and innovation.</p></article></div>
            <div class="col-12 col-lg-4"><article class="site-news-card"><h3>Student Services</h3><p>Guidance, health, and library services for holistic growth.</p></article></div>
          </div>
        </div>
      </section>

      <section id="partners" class="site-section site-section-light">
        <div class="container py-5">
          <h2 class="site-section-title">Institutional Partners</h2>
          <div class="site-partner-grid">
            <span>Industry Partners</span>
            <span>Government Units</span>
            <span>Academic Networks</span>
            <span>International Linkages</span>
            <span>Community Organizations</span>
          </div>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}






