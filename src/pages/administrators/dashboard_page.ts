import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../components/layout/_layout'

export function renderadministrators_dashboard_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'dashboard',
    `
      <section class="admin-content">
        <article class="admin-panel">
          <h3>Administration Dashboard</h3>
          <p>This is the overview page for administrators.</p>
        </article>
      </section>
    `,
  )
}
