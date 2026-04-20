import { ROUTES } from '../../app/routes'

type HomeOverlayOptions = {
  logoSrc: string
  logoAlt: string
  shortBrand: string
  searchAriaLabel: string
}

export function renderHomeOverlays(options: HomeOverlayOptions): string {
  return `
      <section class="site-overlay" data-overlay="menu" aria-hidden="true">
        <div class="site-overlay-backdrop" data-overlay-close></div>
        <div class="site-overlay-panel site-overlay-panel-menu">
          <div class="site-overlay-topbar">
            <a href="${ROUTES.HOME}" class="site-overlay-brand text-decoration-none" data-overlay-close>
              <img src="${options.logoSrc}" alt="${options.logoAlt}" class="site-overlay-brand-logo" />
              <span class="site-overlay-brand-title site-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-short">${options.shortBrand}</span>
            </a>
            <button type="button" class="site-overlay-close" data-overlay-close aria-label="Close menu">&times;</button>
          </div>
          <div class="site-overlay-accent-line"></div>
          <div class="site-overlay-menu-layout">
            <nav class="site-overlay-menu-col">
              <button type="button" class="site-overlay-menu-trigger" data-menu-target="academics" style="--menu-delay: 0.1s;">ACADEMICS</button>
              <div class="site-overlay-mobile-submenu" data-mobile-submenu-panel></div>
              <a href="${ROUTES.STUDENT_LOGIN}" data-overlay-close style="--menu-delay: 0.2s;">STUDENT PORTAL</a>
              <a href="${ROUTES.FACULTY_LOGIN}" data-overlay-close style="--menu-delay: 0.3s;">FACULTY PORTAL</a>
              <a href="${ROUTES.REGISTRAR_STAFF_LOGIN}" data-overlay-close style="--menu-delay: 0.4s;">REGISTRAR STAFF PORTAL</a>
              <a href="${ROUTES.ADMINISTRATORS_LOGIN}" data-overlay-close style="--menu-delay: 0.5s;">ADMINISTRATION</a>
              <a href="#partners" data-overlay-close style="--menu-delay: 0.6s;">ABOUT GWC</a>
            </nav>
            <div class="site-overlay-menu-divider" aria-hidden="true"></div>
            <div class="site-overlay-submenu-panel" data-submenu-panel aria-live="polite"></div>
          </div>
          <template data-submenu-template="academics">
            <ul class="site-overlay-submenu-list">
              <li><a href="#programs">PROGRAMS</a></li>
              <li><a href="#strand">STRAND</a></li>
              <li><a href="#faculty">FACULTY</a></li>
              <li><a href="#special-programs">SPECIAL PROGRAMS</a></li>
            </ul>
          </template>
        </div>
      </section>

      <section class="site-overlay" data-overlay="search" aria-hidden="true">
        <div class="site-overlay-backdrop" data-overlay-close></div>
        <div class="site-overlay-panel site-overlay-panel-search">
          <div class="site-overlay-topbar">
            <a href="${ROUTES.HOME}" class="site-overlay-brand text-decoration-none" data-overlay-close>
              <img src="${options.logoSrc}" alt="${options.logoAlt}" class="site-overlay-brand-logo" />
              <span class="site-overlay-brand-title site-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-short">${options.shortBrand}</span>
            </a>
            <button type="button" class="site-overlay-close" data-overlay-close aria-label="Close search">&times;</button>
          </div>
          <div class="site-overlay-accent-line"></div>
          <div class="site-search-center">
            <form class="site-search-form" data-search-form autocomplete="off">
              <input type="search" name="q" placeholder="type keyword(s) here" aria-label="${options.searchAriaLabel}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" required />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>
  `
}




