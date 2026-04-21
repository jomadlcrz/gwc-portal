import { ROUTES } from '../../../app/routes'
import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderregistrar_staff_schedule_page(): string {
  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar_staff-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.REGISTRAR_STAFF_DASHBOARD },
          { label: 'Schedule', active: true },
        ])}

        <article class="admin-students-home">
          <h2>Schedule</h2>
          <p>Create and manage class schedules.</p>
          <div class="admin-students-home-actions">
            <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE}" class="btn btn-outline-primary">Manage Schedule</a>
            <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_CREATE}" class="btn btn-primary">Create Schedule</a>
          </div>
        </article>
      </section>
    `,
  )
}

