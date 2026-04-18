import { renderAdminShell } from '../../components/admin_shell'

export function renderadministrators_dashboard_page(): string {
  return renderAdminShell(
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
