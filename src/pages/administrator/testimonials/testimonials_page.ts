import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { getTestimonials } from '../../../api/testimonials'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderRows(): string {
  return getTestimonials()
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.role)}</td>
        <td>${escapeHtml(item.message)}</td>
        <td>${item.image ? `<a href="${escapeHtml(item.image)}" target="_blank" rel="noopener noreferrer">View</a>` : '-'}</td>
      </tr>
    `,
    )
    .join('')
}

export function rendertestimonials_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'testimonials',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Testimonials', active: true },
        ])}

        <article class="admin-panel admin-posts-panel">
          <header class="admin-posts-panel-head admin-posts-list-head">
            <div>
              <h3>All Testimonials</h3>
              <p>Manage and review all testimonials.</p>
            </div>
            <a class="admin-posts-create-link" href="${ROUTES.ADMINISTRATOR_TESTIMONIALS_CREATE}">Add New</a>
          </header>
          <div class="admin-post-table-wrap">
            <table class="admin-post-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Message</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>${renderRows()}</tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}

