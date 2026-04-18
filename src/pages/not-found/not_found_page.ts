import { ROUTES } from '../../app/routes'

export function rendernot_found_page(): string {
  return `
    <main class="fallback-page">
      <section class="fallback-card">
        <p class="fallback-code">404</p>
        <h1 class="fallback-title">Page not found</h1>
        <a class="fallback-btn" href="${ROUTES.HOME}">Go to home_page</a>
      </section>
    </main>
  `
}
