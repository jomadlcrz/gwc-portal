import { ROUTES } from '../../../app/routes'
import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { STUDENT_DASHBOARD_CONTENT as content } from '../../../data/student_dashboard'
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
              <h3>${content.title}</h3>
              <p>${content.subtitle}</p>
            </div>
            <div class="student-dashboard-actions">
              <a href="${ROUTES.STUDENT_SUBJECTS}" class="btn btn-sm btn-outline-primary">${content.actions.viewSubjects}</a>
              <a href="${ROUTES.STUDENT_SCHEDULE}" class="btn btn-sm btn-primary">${content.actions.openSchedule}</a>
            </div>
          </header>

          <section class="student-kpi-grid mt-2">
            ${renderKpiCard(content.kpis.published, scheduleRows.length, 'bi-collection', 'published')}
            ${renderKpiCard(content.kpis.updates, notes.length, 'bi-bell', 'updates')}
            ${renderKpiCard(content.kpis.approved, analytics.approvedSchedules, 'bi-patch-check', 'approved')}
            ${renderKpiCard(content.kpis.finalized, analytics.finalizedSchedules, 'bi-check2-circle', 'finalized')}
          </section>

          <section class="student-dashboard-grid mt-3">
            <article class="student-dashboard-card">
              <h4>${content.panels.latestNotifications}</h4>
              <ul class="student-list">
                ${notes.length ? notes.map((note) => `<li>${note.message}</li>`).join('') : `<li>${content.emptyStates.updates}</li>`}
              </ul>
            </article>

            <article class="student-dashboard-card">
              <h4>${content.panels.quickAccess}</h4>
              <div class="student-quick-links">
                <a href="${ROUTES.STUDENT_SCHEDULE}" class="btn btn-sm btn-outline-primary">${content.links.mySchedule}</a>
                <a href="${ROUTES.STUDENT_GRADES}" class="btn btn-sm btn-outline-primary">${content.links.myGrades}</a>
                <a href="${ROUTES.STUDENT_SUBJECTS}" class="btn btn-sm btn-outline-primary">${content.links.mySubjects}</a>
                <a href="${ROUTES.STUDENT_SETTINGS}" class="btn btn-sm btn-outline-primary">${content.links.settings}</a>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
