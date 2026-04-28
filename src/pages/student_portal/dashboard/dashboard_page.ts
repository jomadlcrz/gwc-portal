import { ROUTES } from '../../../app/routes'
import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { schedulingService } from '../../../features/scheduling/service'

function renderKpiCard(label: string, count: number, icon: string, tone: string): string {
  return `
    <article class="student-kpi-card student-kpi-card-${tone}">
      <span class="student-kpi-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <div class="student-kpi-copy">
        <p>${label}</p>
        <strong>${count}</strong>
      </div>
    </article>
  `
}

export function renderstudent_dashboard_page(): string {
  const analytics = schedulingService.getAnalytics()
  const scheduleRows = schedulingService.listStudentSchedules()
  const notes = schedulingService.listNotifications('STUDENT').slice(0, 5)

  return renderPortalShell(
    STUDENT_SHELL_CONFIG,
    'dashboard',
    `
      <section class="student-content">
        <article class="student-panel student-dashboard">
          <header class="student-dashboard-head">
            <div>
              <h3>Student Dashboard</h3>
              <p>Overview of your schedules and latest registrar announcements.</p>
            </div>
            <div class="student-dashboard-actions">
              <a href="${ROUTES.STUDENT_SUBJECTS}" class="btn btn-sm btn-outline-primary">View Subjects</a>
              <a href="${ROUTES.STUDENT_SCHEDULE}" class="btn btn-sm btn-primary">Open Schedule</a>
            </div>
          </header>

          <section class="student-kpi-grid mt-2">
            ${renderKpiCard('Published Classes', scheduleRows.length, 'bi-collection', 'published')}
            ${renderKpiCard('Schedule Updates', notes.length, 'bi-bell', 'updates')}
            ${renderKpiCard('Approved Batches', analytics.approvedSchedules, 'bi-patch-check', 'approved')}
            ${renderKpiCard('Finalized Batches', analytics.finalizedSchedules, 'bi-check2-circle', 'finalized')}
          </section>

          <section class="student-dashboard-grid mt-3">
            <article class="student-dashboard-card">
              <h4>Latest Notifications</h4>
              <ul class="student-list">
                ${notes.length ? notes.map((note) => `<li>${note.message}</li>`).join('') : '<li>No updates yet.</li>'}
              </ul>
            </article>

            <article class="student-dashboard-card">
              <h4>Quick Access</h4>
              <div class="student-quick-links">
                <a href="${ROUTES.STUDENT_SCHEDULE}" class="btn btn-sm btn-outline-primary">My Schedule</a>
                <a href="${ROUTES.STUDENT_GRADES}" class="btn btn-sm btn-outline-primary">My Grades</a>
                <a href="${ROUTES.STUDENT_SUBJECTS}" class="btn btn-sm btn-outline-primary">My Subjects</a>
                <a href="${ROUTES.STUDENT_SETTINGS}" class="btn btn-sm btn-outline-primary">Settings</a>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
