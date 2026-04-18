import gwcLogoWhite from '../assets/gwc-logo-white.png'
import { ROUTES } from '../app/routes'

type MainSiteFooterOptions = {
  copyrightText?: string
}

type PortalSiteFooterOptions = {
  text?: string
}

export function renderMainSiteFooter(options: MainSiteFooterOptions = {}): string {
  const copyrightText = options.copyrightText ?? 'Golden West Colleges, Inc.'

  return `
      <footer class="site-footer">
        <div class="site-footer-main">
          <div class="site-footer-inner">
            <div class="site-footer-grid">
              <a href="${ROUTES.HOME}" class="site-footer-logo-link" aria-label="Go to home page">
                <img src="${gwcLogoWhite}" alt="Golden West Colleges logo" class="site-footer-logo" />
              </a>

              <section>
                <h2>Security & Brand</h2>
                <ul class="site-footer-links">
                  <li><a href="#">Data Privacy Notice</a></li>
                  <li><a href="#">Security Issue</a></li>
                  <li><a href="#">Copyright Infringement</a></li>
                </ul>
              </section>

              <section>
                <h2>Get In Touch</h2>
                <ul class="site-footer-contact">
                  <li><a href="mailto:goldenwest.colleges@yahoo.com.ph">goldenwest.colleges@yahoo.com.ph</a></li>
                  <li><a href="tel:+639165969881">0916 596 9881</a></li>
                </ul>
                <div class="site-footer-social" aria-label="Social links">
                  <a href="https://www.facebook.com/gwcalaminosofficial" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H8v3h2.4v8h3.1z" />
                    </svg>
                  </a>
                </div>
              </section>

              <section>
                <h2>Locate Us</h2>
                <ul class="site-footer-address">
                  <li>San Jose Drive, Alaminos City, Pangasinan 2404</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        <div class="site-footer-bottom">
          <div class="site-footer-bottom-inner">
            <p class="mb-0">&copy; Copyright <strong>${copyrightText}</strong></p>
            <p class="mb-0"><strong>Designed and developed by:</strong> GWC - Information Technology</p>
          </div>
        </div>
      </footer>
  `
}

export function renderPortalSiteFooter(options: PortalSiteFooterOptions = {}): string {
  const text = options.text ?? 'All rights reserved, GOLDEN WEST COLLEGES, INC.'

  return `
      <footer class="portal-footer">
        <p class="mb-0">${text}</p>
      </footer>
  `
}



