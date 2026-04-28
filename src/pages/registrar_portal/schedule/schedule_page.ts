import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { DEPARTMENT_SELECT_OPTIONS, getDepartmentDisplayName } from '../../../data/departments'
import { INSTRUCTOR_SCHEDULES, SCHEDULE_DAY_ORDER, type InstructorSchedule } from '../../../data/schedule'

function getScheduleChipClass(value: string, room: string): string {
  const subjectCode = value.split('-')[0]?.trim().toUpperCase() ?? ''
  const normalizedRoom = room.trim().toUpperCase()
  if (normalizedRoom.startsWith('CL')) return 'registrar-schedule-chip-comlab'
  if (!subjectCode) return 'registrar-schedule-chip-general-lecture'
  if (subjectCode.startsWith('CL') || subjectCode.includes('COMLAB')) return 'registrar-schedule-chip-comlab'
  if (subjectCode.startsWith('CAPS') || subjectCode.includes('THESIS') || subjectCode.includes('RES')) {
    return 'registrar-schedule-chip-research'
  }
  return 'registrar-schedule-chip-general-lecture'
}

function parseHourValue(value: string): number {
  const [hourText, minuteText] = value.split(':')
  const hour = Number.parseInt(hourText, 10)
  const minute = Number.parseInt(minuteText, 10)
  const normalizedHour = hour >= 7 || hour === 12 ? hour : hour + 12
  return normalizedHour + (Number.isFinite(minute) ? minute / 60 : 0)
}

function getSlotDuration(slotTime: string): number {
  const [startText, endText] = slotTime.split('-').map((value) => value.trim())
  const start = parseHourValue(startText)
  const end = parseHourValue(endText)
  return end > start ? end - start : 0
}

function formatHours(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function getInstructorDayHours(instructor: InstructorSchedule, day: (typeof SCHEDULE_DAY_ORDER)[number]): string {
  const total = instructor.slots.reduce((sum, slot) => {
    if (!slot.values[day]) return sum
    return sum + getSlotDuration(slot.time)
  }, 0)

  if (total <= 0) return ''
  return formatHours(total)
}

function renderScheduleGrid(instructor: InstructorSchedule): string {
  return `
    <div class="registrar-schedule-grid-wrap">
      <table class="registrar-schedule-grid">
        <thead>
          <tr>
            <th>Time</th>
            ${SCHEDULE_DAY_ORDER.map((day) => `<th>${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${instructor.slots
            .map(
              (slot) => `
                <tr>
                  <th>${slot.time}</th>
                  ${SCHEDULE_DAY_ORDER
                    .map((day) => {
                      const value = slot.values[day]
                      if (!value) return '<td></td>'
                      const chipClass = getScheduleChipClass(value, instructor.room)
                      return `<td><span class="registrar-schedule-chip ${chipClass}">${instructor.name} - ${value}</span></td>`
                    })
                    .join('')}
                </tr>
              `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            ${SCHEDULE_DAY_ORDER.map((day) => `<th>${getInstructorDayHours(instructor, day)}</th>`).join('')}
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="registrar-schedule-mobile-list">
      ${instructor.slots
        .map(
          (slot) => `
            <article class="registrar-schedule-mobile-card">
              <h5>${slot.time}</h5>
              <div class="registrar-schedule-mobile-days">
                ${SCHEDULE_DAY_ORDER
                  .map((day) => {
                    const value = slot.values[day]
                    if (!value) return ''
                    return `
                      <div class="registrar-schedule-mobile-item">
                        <span>${day}</span>
                        <strong>${instructor.name} - ${value}</strong>
                      </div>
                    `
                  })
                  .join('')}
              </div>
            </article>
          `,
        )
        .join('')}
    </div>
  `
}

export function renderregistrar_schedule_page(): string {
  const departmentCodes = Array.from(new Set(INSTRUCTOR_SCHEDULES.map((item) => item.department)))

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="registrar-panel registrar-schedule-panel">
          <header class="registrar-schedule-head">
            <div>
              <h3>Schedule Board Access</h3>
              <p>Select a department first, then review its instructor schedules.</p>
            </div>
            <div class="registrar-dashboard-actions">
              <a href="${ROUTES.REGISTRAR_SCHEDULE_MANAGE}" class="btn btn-sm btn-outline-primary">Manage Schedule</a>
              <a href="${ROUTES.REGISTRAR_SCHEDULE_CREATE}" class="btn btn-sm btn-primary">Create Schedule</a>
            </div>
          </header>

          <section class="registrar-schedule-filter">
            <label for="registrar-schedule-department" class="form-label">Department</label>
            <select id="registrar-schedule-department" class="form-select" data-registrar-department-select>
              <option value="">Select Department</option>
              ${DEPARTMENT_SELECT_OPTIONS.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
            <p class="registrar-schedule-filter-hint">Instructor Schedule Board will appear after department selection.</p>
          </section>

          <section data-registrar-empty-state class="registrar-schedule-empty-state">
            Choose a department to view the Instructor Schedule Board.
          </section>

          ${departmentCodes
            .map(
              (departmentCode) => `
                <section class="registrar-schedule-department-board" data-registrar-department-board="${departmentCode}" hidden>
                  <h4 class="registrar-schedule-department-title">${getDepartmentDisplayName(departmentCode)}</h4>
                  <section class="registrar-schedule-instructor-list" aria-label="Instructor schedule">
                    ${INSTRUCTOR_SCHEDULES
                      .filter((instructor) => instructor.department === departmentCode)
                      .map(
                        (instructor) => `
                          <article class="registrar-schedule-instructor">
                            <strong>${instructor.name}</strong>
                            <span>Room ${instructor.room}</span>
                            <small>${instructor.focus}</small>
                          </article>
                        `,
                      )
                      .join('')}
                  </section>

                  ${INSTRUCTOR_SCHEDULES
                    .filter((instructor) => instructor.department === departmentCode)
                    .map(
                      (instructor) => `
                        <section class="registrar-schedule-table-section">
                          <h4>${instructor.name} - Room ${instructor.room}</h4>
                          ${renderScheduleGrid(instructor)}
                        </section>
                      `,
                    )
                    .join('')}
                </section>
              `,
            )
            .join('')}
        </article>
      </section>
    `,
  )
}
