import { HR_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'
import { ROUTES } from '../../../app/routes'

export function renderhr_dashboard_page(): string {
  const schedules = schedulingService.listSchedules()
  const allItems = schedules.flatMap((schedule) => {
    const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
    return current.snapshot
  })

  const uniqueFaculty = new Set(allItems.map((item) => item.faculty))
  const departments = new Set(allItems.map((item) => item.department))
  const pendingApprovals = schedules.filter((schedule) =>
    ['SUBMITTED_FOR_APPROVAL', 'UNDER_ADMIN_REVIEW', 'MODIFICATION_REQUESTED'].includes(schedule.status),
  ).length

  return renderPortalShell(
    HR_SHELL_CONFIG,
    'dashboard',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([{ label: 'Dashboard', active: true }])}

        <article class="hr-panel hr-dashboard">
          <header class="hr-dashboard-head">
            <div>
              <h3>HR Dashboard</h3>
              <p>Track faculty deployment, schedule activity, and workforce-related updates.</p>
            </div>
            <div class="hr-dashboard-actions">
              <a href="${ROUTES.HR_FACULTY}" class="btn btn-sm btn-primary">Open Faculty</a>
              <a href="${ROUTES.HR_SETTINGS}" class="btn btn-sm btn-outline-primary">Open Settings</a>
            </div>
          </header>

          <section class="hr-kpi-grid">
            <article class="hr-kpi-card">
              <p>Total Faculty on Schedules</p>
              <strong>${uniqueFaculty.size}</strong>
            </article>
            <article class="hr-kpi-card">
              <p>Total Schedule Items</p>
              <strong>${allItems.length}</strong>
            </article>
            <article class="hr-kpi-card">
              <p>Departments Covered</p>
              <strong>${departments.size}</strong>
            </article>
            <article class="hr-kpi-card">
              <p>Records Needing Attention</p>
              <strong>${pendingApprovals}</strong>
            </article>
          </section>

          <section class="hr-dashboard-grid">
            <article class="hr-dashboard-card">
              <h4>Faculty Snapshot</h4>
              <ul class="hr-list">
                ${
                  Array.from(uniqueFaculty)
                    .slice(0, 6)
                    .map((name) => `<li>${name}</li>`)
                    .join('') || '<li>No faculty entries yet.</li>'
                }
              </ul>
            </article>

            <article class="hr-dashboard-card">
              <h4>Schedule Status Overview</h4>
              <ul class="hr-list">
                ${
                  schedules.length
                    ? schedules
                        .slice(0, 6)
                        .map((schedule) => `<li><strong>${schedule.id}</strong> - ${schedule.status.replaceAll('_', ' ')}</li>`)
                        .join('')
                    : '<li>No schedule records yet.</li>'
                }
              </ul>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
