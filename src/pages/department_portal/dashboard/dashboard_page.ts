import { ROUTES } from '../../../app/routes'
import { DEPARTMENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

export function renderdepartment_dashboard_page(): string {
  const approved = schedulingService.listApprovedByDepartment('College of Computer Studies')
  const requests = schedulingService.listModificationRequests({ requesterRole: 'DEPARTMENT' }).slice(0, 5)
  const notes = schedulingService.listNotifications('DEPARTMENT').slice(0, 5)
  const accepted = requests.filter((item) => item.status === 'ACCEPTED').length
  const pending = requests.filter((item) => item.status === 'PENDING').length
  const rejected = requests.filter((item) => item.status === 'REJECTED').length

  return renderPortalShell(
    DEPARTMENT_SHELL_CONFIG,
    'dashboard',
    `
      <section class="department-content">
        ${renderBreadcrumbNav([
          { label: 'Dashboard', active: true },
        ])}
        <article class="department-panel department-dashboard">
          <header class="department-dashboard-head">
            <div>
              <h3>Department Dashboard</h3>
              <p>Track approved schedules, modification requests, and update notifications.</p>
            </div>
            <div class="department-dashboard-actions">
              <a href="${ROUTES.DEPARTMENT_SCHEDULE}" class="btn btn-primary">Open Schedule Review</a>
            </div>
          </header>

          <section class="department-kpi-grid">
            <article class="department-kpi-card"><p>Approved Schedules</p><strong>${approved.length}</strong></article>
            <article class="department-kpi-card"><p>Pending Requests</p><strong>${pending}</strong></article>
            <article class="department-kpi-card"><p>Accepted Requests</p><strong>${accepted}</strong></article>
            <article class="department-kpi-card"><p>Rejected Requests</p><strong>${rejected}</strong></article>
          </section>

          <section class="department-dashboard-grid">
            <article class="department-dashboard-card">
              <h4>Recent Requests</h4>
              <ul class="department-list">
                ${
                  requests.length
                    ? requests.map((request) => `<li><strong>${request.scheduleId}</strong> - ${request.status} - ${request.reason}</li>`).join('')
                    : '<li>No requests yet.</li>'
                }
              </ul>
            </article>

            <article class="department-dashboard-card">
              <h4>Latest Notifications</h4>
              <ul class="department-list">
                ${notes.length ? notes.map((note) => `<li>${note.message}</li>`).join('') : '<li>No notifications yet.</li>'}
              </ul>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
