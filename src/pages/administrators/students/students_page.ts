import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderstudents_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Students', active: true },
        ])}

        <article class="admin-students-home">
          <h2>Students</h2>
          <p>View and manage student records.</p>
          <div class="admin-students-home-actions">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-outline-primary">Student List</a>
          </div>
        </article>
      </section>
    `,
  )
}


