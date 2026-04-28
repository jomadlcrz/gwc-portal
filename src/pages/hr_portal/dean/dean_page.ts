import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderhr_dean_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'dean',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([{ label: 'Dean', active: true }])}

        <article class="hr-faculty-home">
          <h2>Dean</h2>
          <p>Create and manage dean accounts for departments.</p>
          <div class="hr-faculty-home-actions">
            <a href="${ROUTES.HR_DEAN_MANAGE}" class="btn btn-outline-primary">Manage Dean</a>
            <a href="${ROUTES.HR_DEAN_CREATE}" class="btn btn-primary">Create Dean</a>
          </div>
        </article>
      </section>
    `,
  )
}
