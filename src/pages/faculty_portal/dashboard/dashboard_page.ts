import { ROUTES } from '../../../app/routes'
import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

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
              <h3>Faculty Dashboard</h3>
              <p>Teaching overview, schedule highlights, and latest updates.</p>
            </div>
            <div class="faculty-dashboard-actions">
              <a href="${ROUTES.FACULTY_CLASSES}" class="btn btn-sm btn-primary">Open Classes</a>
              <a href="${ROUTES.FACULTY_GRADEBOOK}" class="btn btn-sm btn-outline-primary">Open Gradebook</a>
            </div>
          </header>

          <section class="faculty-kpi-grid">
            <article class="faculty-kpi-card">
              <p>Total Assigned Classes</p>
              <strong>${myItems.length}</strong>
            </article>
            <article class="faculty-kpi-card">
              <p>${today} Classes</p>
              <strong>${todaysItems.length}</strong>
            </article>
            <article class="faculty-kpi-card">
              <p>Online / Hybrid Load</p>
              <strong>${onlineCount}</strong>
            </article>
            <article class="faculty-kpi-card">
              <p>Rooms This Term</p>
              <strong>${roomSet.size}</strong>
            </article>
          </section>

          <section class="faculty-dashboard-grid">
            <article class="faculty-dashboard-card">
              <h4>Today's Classes</h4>
              <ul class="faculty-list">
                ${
                  todaysItems.length
                    ? todaysItems
                        .map(
                          (item) => `<li><strong>${item.subjectCode}</strong> ${item.section} - ${item.startTime}-${item.endTime} - ${item.room}</li>`,
                        )
                        .join('')
                    : '<li>No classes scheduled for today.</li>'
                }
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>Upcoming Weekly Load</h4>
              <ul class="faculty-list">
                ${
                  myItems.length
                    ? myItems
                        .slice(0, 6)
                        .map((item) => `<li><strong>${item.day}</strong> - ${item.subjectCode} ${item.section} - ${item.startTime}-${item.endTime}</li>`)
                        .join('')
                    : '<li>No assigned classes yet.</li>'
                }
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>Notifications</h4>
              <ul class="faculty-list">
                ${notes.length ? notes.map((note) => `<li>${note.message}</li>`).join('') : '<li>No notifications yet.</li>'}
              </ul>
            </article>

            <article class="faculty-dashboard-card">
              <h4>Quick Actions</h4>
              <div class="faculty-quick-links">
                <a href="${ROUTES.FACULTY_CLASSES}" class="btn btn-sm btn-outline-primary">Report Schedule Issue</a>
                <a href="${ROUTES.FACULTY_GRADEBOOK}" class="btn btn-sm btn-outline-primary">Update Gradebook</a>
                <a href="${ROUTES.FACULTY_SETTINGS}" class="btn btn-sm btn-outline-primary">Portal Settings</a>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
