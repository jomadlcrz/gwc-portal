import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'

export function renderregistrar_staff_dashboard_page(): string {
  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'dashboard',
    `
      <section class="registrar_staff-content">
        <article class="registrar_staff-panel">
          <h3>Registrar Staff Dashboard</h3>
          <p>Monitor daily office transactions, pending requests, and record processing status.</p>
        </article>
      </section>
    `,
  )
}





