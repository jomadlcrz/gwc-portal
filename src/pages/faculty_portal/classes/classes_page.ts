import { ROUTES } from '../../../app/routes'
import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedModal } from '../../../components/ui/modal'
import { schedulingService } from '../../../features/scheduling/service'

export function renderfaculty_classes_page(): string {
  const classes = schedulingService
    .listSchedules()
    .filter((schedule) => ['APPROVED', 'FINALIZED'].includes(schedule.status))
    .flatMap((schedule) => {
      const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
      return current.snapshot
        .filter((item) => item.faculty === 'Prof. Maria Dela Cruz')
        .map((item) => ({ scheduleId: schedule.id, item }))
    })

  return renderPortalShell(
    FACULTY_SHELL_CONFIG,
    'classes',
    `
      <section class="faculty-content">
        ${renderBreadcrumbNav([
          { label: 'Classes', active: true },
        ])}
        <article class="faculty-panel">
          <h3>My Weekly Timetable</h3>
          <p>Review assigned classes and report scheduling issues for registrar action.</p>
          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${classes
                  .map(
                    ({ scheduleId, item }) => `
                      <tr>
                        <td>${item.subjectCode} - ${item.title}</td>
                        <td>${item.section}</td>
                        <td>${item.day}</td>
                        <td>${item.startTime}-${item.endTime}</td>
                        <td>${item.room}</td>
                        <td><button class="btn btn-sm btn-outline-warning" data-faculty-request data-schedule-id="${scheduleId}">Report Issue</button></td>
                      </tr>
                    `,
                  )
                  .join('') || '<tr><td colspan="6" class="text-center py-3">No assigned classes in approved schedules.</td></tr>'}
              </tbody>
            </table>
          </div>
        </article>
      </section>
      ${renderSharedModal('faculty-request-modal')}
    `,
  )
}
