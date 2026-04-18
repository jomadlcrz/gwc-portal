import { ROUTES } from '../app/routes'

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
              <a href="#academics" data-overlay-close>ACADEMICS</a>
              <a href="${ROUTES.STUDENT_LOGIN}" data-overlay-close>STUDENT PORTAL</a>
              <a href="${ROUTES.ADMINISTRATORS_LOGIN}" data-overlay-close>ADMINISTRATION</a>
              <a href="#partners" data-overlay-close>ABOUT GWC</a>
            </nav>
            <div class="site-overlay-menu-divider" aria-hidden="true"></div>
            <div class="site-overlay-menu-blank" aria-hidden="true"></div>
          </div>
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

