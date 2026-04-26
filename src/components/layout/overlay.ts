import '../../styles/overlay.css'
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
            <a href="${ROUTES.HOME}" class="site-overlay-brand text-decoration-none" data-overlay-close data-brand-variant="full">
              <img src="${options.logoSrc}" alt="${options.logoAlt}" class="site-overlay-brand-logo" />
              <span class="site-overlay-brand-title site-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-medium">GOLDEN WEST<br />COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-short">${options.shortBrand}</span>
            </a>
            <button type="button" class="site-overlay-close" data-overlay-close aria-label="Close menu">&times;</button>
          </div>
          <div class="site-overlay-accent-line"></div>
          <div class="site-overlay-menu-layout">
            <nav class="site-overlay-menu-col">
              <button type="button" class="site-overlay-menu-trigger" data-menu-target="academics">ACADEMICS</button>
              <div class="site-overlay-mobile-submenu" data-mobile-submenu-for="academics"></div>
              <button type="button" class="site-overlay-menu-trigger" data-menu-target="login">LOGIN</button>
              <div class="site-overlay-mobile-submenu" data-mobile-submenu-for="login"></div>
              <button type="button" class="site-overlay-menu-trigger" data-menu-target="about-gwc">ABOUT GWC</button>
              <div class="site-overlay-mobile-submenu" data-mobile-submenu-for="about-gwc"></div>
            </nav>
            <div class="site-overlay-menu-divider" aria-hidden="true"></div>
            <div class="site-overlay-submenu-panel" data-submenu-panel aria-live="polite"></div>
          </div>
          <template data-submenu-template="academics">
            <ul class="site-overlay-submenu-list">
              <li><a href="#programs">PROGRAMS</a></li>
              <li><a href="#special-programs">SPECIAL PROGRAMS</a></li>
              <li><a href="#faculty">FACULTY</a></li>
            </ul>
          </template>
          <template data-submenu-template="login">
            <ul class="site-overlay-submenu-list">
              <li><a href="${ROUTES.STUDENT_LOGIN}">STUDENT PORTAL</a></li>
              <li><a href="${ROUTES.FACULTY_LOGIN}">FACULTY PORTAL</a></li>
            </ul>
          </template>
          <template data-submenu-template="about-gwc">
            <ul class="site-overlay-submenu-list">
              <li><a href="${ROUTES.ABOUT_GWC_HISTORY}">GWC HISTORY</a></li>
              <li><a href="${ROUTES.ABOUT_GWC_FAQS}">FAQs</a></li>
            </ul>
          </template>
        </div>
      </section>

      <section class="site-overlay" data-overlay="search" aria-hidden="true">
        <div class="site-overlay-backdrop" data-overlay-close></div>
        <div class="site-overlay-panel site-overlay-panel-search">
          <div class="site-overlay-topbar">
            <a href="${ROUTES.HOME}" class="site-overlay-brand text-decoration-none" data-overlay-close data-brand-variant="full">
              <img src="${options.logoSrc}" alt="${options.logoAlt}" class="site-overlay-brand-logo" />
              <span class="site-overlay-brand-title site-overlay-brand-title-full">GOLDEN WEST COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-medium">GOLDEN WEST<br />COLLEGES, INC.</span>
              <span class="site-overlay-brand-title site-overlay-brand-title-short">${options.shortBrand}</span>
            </a>
            <button type="button" class="site-overlay-close" data-overlay-close aria-label="Close search">&times;</button>
          </div>
          <div class="site-overlay-accent-line"></div>
          <div class="site-search-center">
            <form class="site-search-form" data-search-form autocomplete="off">
              <input type="search" name="q" placeholder="type keyword(s) here" aria-label="${options.searchAriaLabel}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" required />
              <button type="submit" aria-label="Search">
                Search
                <i class="bi bi-search" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        </div>
      </section>
  `
}





