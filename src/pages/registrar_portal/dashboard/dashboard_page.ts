import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { REGISTRAR_DASHBOARD_CONTENT as content } from '../../../data/registrar_dashboard'

export function renderregistrar_dashboard_page(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'dashboard',
    `
      <section class="registrar-content">
        <article class="registrar-panel">
          <h3>${content.title}</h3>
          <p>${content.subtitle}</p>
        </article>
      </section>
    `,
  )
}






