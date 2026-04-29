import { ROUTES } from '../../../app/routes'
import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { FACULTY_DASHBOARD_CONTENT as content } from '../../../data/faculty_dashboard'
import { schedulingService } from '../../../features/scheduling/service'

function renderKpiCard(label: string, count: number, icon: string, tone: string): string {
  return `
    <article class="faculty-kpi-card faculty-kpi-card-${tone}">
      <span class="faculty-kpi-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <div class="faculty-kpi-copy">
        <p>${label}</p>
        <strong>${count}</strong>
      </div>
    </article>
  `
}

export function renderfaculty_dashboard_page(): string {
  const myItems = schedulingService.listFacultySchedules('Prof. Maria Dela Cruz')
  const notes = schedulingService.listNotifications('FACULTY').slice(0, 5)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaysItems = myItems.filter((item) => item.day === today)
  const onlineCount = myItems.filter((item) => item.deliveryMode !== 'Face-to-Face').length
  const roomSet = new Set(myItems.map((item) => item.room))

  return renderPortalShell(
    FACULTY_SHELL_CONFIG,
    'dashboard',
    `
      <section class="faculty-content">
        ${renderBreadcrumbNav([
          { label: 'Dashboard', active: true },
        ])}

        <article class="faculty-panel faculty-dashboard">
          <header class="faculty-dashboard-head">
            <div>
              <h3>${content.title}</h3>
              <p>${content.subtitle}</p>
            </div>
            <div class="faculty-dashboard-actions">
              <a href="${ROUTES.FACULTY_CLASSES}" class="btn btn-sm btn-primary">${content.actions.openClasses}</a>
              <a href="${ROUTES.FACULTY_GRADEBOOK}" class="btn btn-sm btn-outline-primary">${content.actions.openGradebook}</a>
            </div>
          </header>

          <section class="faculty-kpi-grid mt-2">
            ${renderKpiCard(content.kpis.totalAssigned, myItems.length, 'bi-collection', 'total')}
            ${renderKpiCard(`${today} ${content.kpis.todaySuffix}`, todaysItems.length, 'bi-calendar-day', 'today')}
            ${renderKpiCard(content.kpis.onlineHybrid, onlineCount, 'bi-wifi', 'online')}
            ${renderKpiCard(content.kpis.roomsThisTerm, roomSet.size, 'bi-door-open', 'rooms')}
          </section>

          <section class="faculty-dashboard-grid">
            <article class="faculty-dashboard-card">
              <h4>${content.panels.todayClasses}</h4>
              <ul class="faculty-list">
                ${
                  todaysItems.length
                    ? todaysItems
                        .map(
                          (item) => `<li><strong>${item.subjectCode}</strong> ${item.section} - ${item.startTime}-${item.endTime} - ${item.room}</li>`,
                        )
                        .join('')
                    : `<li>${content.emptyStates.today}</li>`
                }
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>${content.panels.weeklyLoad}</h4>
              <ul class="faculty-list">
                ${
                  myItems.length
                    ? myItems
                        .slice(0, 6)
                        .map((item) => `<li><strong>${item.day}</strong> - ${item.subjectCode} ${item.section} - ${item.startTime}-${item.endTime}</li>`)
                        .join('')
                    : `<li>${content.emptyStates.weekly}</li>`
                }
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>${content.panels.notifications}</h4>
              <ul class="faculty-list">
                ${notes.length ? notes.map((note) => `<li>${note.message}</li>`).join('') : `<li>${content.emptyStates.notifications}</li>`}
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>${content.panels.quickActions}</h4>
              <div class="faculty-quick-links">
                <a href="${ROUTES.FACULTY_CLASSES}" class="btn btn-sm btn-outline-primary">${content.links.reportIssue}</a>
                <a href="${ROUTES.FACULTY_GRADEBOOK}" class="btn btn-sm btn-outline-primary">${content.links.updateGradebook}</a>
                <a href="${ROUTES.FACULTY_SETTINGS}" class="btn btn-sm btn-outline-primary">${content.links.settings}</a>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
