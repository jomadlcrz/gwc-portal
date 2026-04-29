import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'

export function renderregistrar_dashboard_page(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'dashboard',
    `
      <section class="registrar-content">
        <article class="registrar-panel">
          <h3>Registrar Dashboard</h3>
          <p>Monitor daily office transactions, pending requests, and record processing status.</p>
        </article>
      </section>
    `,
  )
}






