import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderhr_faculty_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'faculty',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([{ label: 'Faculty', active: true }])}

        <article class="hr-faculty-home">
          <h2>Faculty</h2>
          <p>Create and manage faculty accounts for departments.</p>
          <div class="hr-faculty-home-actions">
            <a href="${ROUTES.HR_FACULTY_MANAGE}" class="btn btn-outline-primary">Manage Faculty</a>
            <a href="${ROUTES.HR_FACULTY_CREATE}" class="btn btn-primary">Create Faculty</a>
          </div>
        </article>
      </section>
    `,
  )
}
