import { ROUTES } from '../../../app/routes'
import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

function formatDay(day: string): string {
  const map: Record<string, string> = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'TH',
    Friday: 'F',
    Saturday: 'S',
  }

  return map[day] || day
}

export function renderstudent_schedule_page(): string {
  const rows = schedulingService.listStudentSchedules()

  return renderPortalShell(
    STUDENT_SHELL_CONFIG,
    'schedule',
    `
      <section class="student-content">
        ${renderBreadcrumbNav([
          { label: 'Home', href: ROUTES.STUDENT_DASHBOARD },
          { label: 'Schedule', active: true },
        ])}
        <article class="student-panel">
          <h3>Class Schedule</h3>
          <p>Published schedule view with subject, section, instructor, room, and meeting time.</p>
          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Subject Code - Descriptive Title</th>
                  <th>Section</th>
                  <th>Instructor</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody data-student-schedule-body>
                ${
                  rows.length
                    ? rows
                        .map(
                          (item) => `
                            <tr>
                              <td>${item.subjectCode} - ${item.title}</td>
                              <td>${item.section}</td>
                              <td>${item.faculty}</td>
                              <td>${formatDay(item.day)}</td>
                              <td>${item.startTime}-${item.endTime}</td>
                              <td>${item.room}</td>
                            </tr>
                          `,
                        )
                        .join('')
                    : '<tr><td colspan="6" class="text-center py-3">No schedules published yet.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}