import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { STUDENT_SCHEDULE } from '../../../data/student_schedule'
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
  const studentProfile = STUDENT_SCHEDULE
  const totalUnits = rows.reduce((sum, item) => sum + (item.capacity >= 40 ? 3 : 2), 0)

  return renderPortalShell(
    STUDENT_SHELL_CONFIG,
    'schedule',
    `
      <section class="student-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="student-panel student-schedule-panel">
          <header class="student-schedule-school-head">
            <h2>${studentProfile.schoolName}</h2>
            <h3>${studentProfile.collegeName}</h3>
            <p>${studentProfile.campusAddress}</p>
            <h4>${studentProfile.scheduleHeading}</h4>
            <small>${studentProfile.schoolYear}</small>
          </header>

          <section class="student-schedule-info-row">
            <div class="student-schedule-meta">
              <p><span>Name of Student:</span> <strong>${studentProfile.name}</strong></p>
              <p><span>Year Level and Section:</span> <strong>${studentProfile.yearLevelSection}</strong></p>
              <p><span>Program:</span> <strong>${studentProfile.course}</strong></p>
              <p><span>Status:</span> <strong class="student-schedule-status-badge is-regular">${studentProfile.status}</strong></p>
            </div>
            <button type="button" class="btn btn-primary student-schedule-print-btn">
              <i class="bi bi-printer-fill" aria-hidden="true"></i>
              <span>Print Schedule</span>
            </button>
          </section>

          <h3 class="student-schedule-title">${studentProfile.semesterLabel}</h3>

          <div class="student-schedule-table-wrap">
            <table class="student-schedule-table">
              <colgroup>
                <col class="student-schedule-col-code" />
                <col class="student-schedule-col-title" />
                <col class="student-schedule-col-units" />
                <col class="student-schedule-col-instructor" />
                <col class="student-schedule-col-day" />
                <col class="student-schedule-col-time" />
                <col class="student-schedule-col-room" />
                <col class="student-schedule-col-set" />
              </colgroup>
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Descriptive Title</th>
                  <th>Units</th>
                  <th>Instructor</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Set</th>
                </tr>
              </thead>
              <tbody data-student-schedule-body>
                ${
                  rows.length
                    ? rows
                        .map(
                          (item) => `
                            <tr>
                              <td>${item.subjectCode}</td>
                              <td>${item.title}</td>
                              <td>${item.capacity >= 40 ? 3 : 2}</td>
                              <td>${item.faculty}</td>
                              <td>${formatDay(item.day)}</td>
                              <td>${item.startTime}-${item.endTime}</td>
                              <td>${item.room}</td>
                              <td>${item.section}</td>
                            </tr>
                          `,
                        )
                        .join('')
                    : '<tr><td colspan="8" class="text-center py-3">No schedules published yet.</td></tr>'
                }
              </tbody>
            </table>
          </div>
          <p class="student-schedule-total-units">Total Units: <strong>${totalUnits}</strong></p>

          <footer class="student-schedule-signature">
            <p>Signed:</p>
            <strong>${studentProfile.signedBy}</strong>
            <span>${studentProfile.signatoryRole}</span>
          </footer>
        </article>
      </section>
    `,
  )
}

export function setupstudent_schedule_page(root: HTMLElement): () => void {
  const printButton = root.querySelector<HTMLButtonElement>('.student-schedule-print-btn')
  if (!printButton) return () => {}

  const onPrint = (): void => {
    window.print()
  }

  printButton.addEventListener('click', onPrint)

  return () => {
    printButton.removeEventListener('click', onPrint)
  }
}
