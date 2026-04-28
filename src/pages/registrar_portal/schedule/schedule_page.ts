import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { DEPARTMENT_SELECT_OPTIONS, getDepartmentDisplayName } from '../../../data/departments'

type ScheduleSlot = {
  time: string
  values: Partial<Record<'M' | 'T' | 'W' | 'TH' | 'F' | 'S', string>>
}

type InstructorSchedule = {
  department: string
  name: string
  room: string
  focus: string
  slots: ScheduleSlot[]
}

const dayOrder: Array<'M' | 'T' | 'W' | 'TH' | 'F' | 'S'> = ['M', 'T', 'W', 'TH', 'F', 'S']

const instructors: InstructorSchedule[] = [
  {
    department: 'CITE',
    name: 'PAU',
    room: '303',
    focus: 'Programming Fundamentals',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'SA101 - 4C', W: 'CC102 - 1A', TH: 'CC102 - 1A', F: 'SA101 - 4C' } },
      { time: '9:30 - 12:00', values: { T: 'SA101 - 4D', W: 'CC102 - 1B', TH: 'CC102 - 1B', F: 'SA101 - 4D' } },
      { time: '12:00 - 2:30', values: { M: 'SA101 - 4A', T: 'CC102 - 1E', W: 'CC102 - 1C', TH: 'CC102 - 1C', F: 'CC102 - 1E' } },
      { time: '2:30 - 5:00', values: { M: 'SA101 - 4A', T: 'CC102 - 1F', W: 'CC102 - 1D', TH: 'CC102 - 1D', F: 'CC102 - 1F' } },
    ],
  },
  {
    department: 'CITE',
    name: 'JOY',
    room: '304',
    focus: 'Intro to Information Management',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'IM101 - 2A', T: 'CC101 - 1A', W: 'IM101 - 2E', TH: 'IM101 - 2A', F: 'CC101 - 1A' } },
      { time: '9:30 - 12:00', values: { M: 'IM101 - 2B', T: 'CC101 - 1B', W: 'CC101 - 1E', TH: 'IM101 - 2B', F: 'CC101 - 1B', S: 'IM101 - 2E' } },
      { time: '12:00 - 2:30', values: { M: 'IM101 - 2C', T: 'CC101 - 1C', W: 'CC101 - 1F', TH: 'IM101 - 2C', F: 'CC101 - 1C', S: 'CC101 - 1E' } },
      { time: '2:30 - 5:00', values: { M: 'IM101 - 2D', T: 'CC101 - 1D', TH: 'IM101 - 2D', F: 'CC101 - 1D', S: 'CC101 - 1F' } },
    ],
  },
  {
    department: 'CITE',
    name: 'JV',
    room: '302',
    focus: 'IT Electives and Research',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'ITELEC1 - 3A', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3A' } },
      { time: '9:30 - 12:00', values: { T: 'ITELEC1 - 3B', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3B' } },
      { time: '12:00 - 2:30', values: { T: 'ITELEC1 - 3C', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3C' } },
      { time: '2:30 - 5:00', values: { T: 'ITELEC1 - 3D', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3D' } },
    ],
  },
  {
    department: 'CITE',
    name: 'KAI',
    room: '402',
    focus: 'Information Management and IT Elective 4',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'IM102 - 3A', T: 'IM102 - 3E', W: 'IM102 - 3A', TH: 'IM102 - 3E', F: 'CAPS2 - 4A' } },
      { time: '9:30 - 12:00', values: { M: 'IM102 - 3B', T: 'IM102 - 3F', W: 'IM102 - 3B', TH: 'IM102 - 3F' } },
      { time: '12:00 - 2:30', values: { M: 'IM102 - 3C', T: 'ITELEC4 - 4A', W: 'IM102 - 3C', TH: 'ITELEC4 - 4A', F: 'CAPS2 - 4B' } },
      { time: '2:30 - 5:00', values: { M: 'IM102 - 3D', T: 'ITELEC4 - 4B', W: 'IM102 - 3D', TH: 'ITELEC4 - 4B' } },
    ],
  },
]

function renderScheduleGrid(instructor: InstructorSchedule): string {
  return `
    <div class="registrar-schedule-grid-wrap">
      <table class="registrar-schedule-grid">
        <thead>
          <tr>
            <th>Time</th>
            ${dayOrder.map((day) => `<th>${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${instructor.slots
            .map(
              (slot) => `
                <tr>
                  <th>${slot.time}</th>
                  ${dayOrder
                    .map((day) => {
                      const value = slot.values[day]
                      return `<td>${value ? `<span class="registrar-schedule-chip">${instructor.name} - ${value}</span>` : ''}</td>`
                    })
                    .join('')}
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="registrar-schedule-mobile-list">
      ${instructor.slots
        .map(
          (slot) => `
            <article class="registrar-schedule-mobile-card">
              <h5>${slot.time}</h5>
              <div class="registrar-schedule-mobile-days">
                ${dayOrder
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
  const departmentCodes = Array.from(new Set(instructors.map((item) => item.department)))

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
                    ${instructors
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

                  ${instructors
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
