import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

type ScheduleSlot = {
  time: string
  values: Partial<Record<'M' | 'T' | 'W' | 'TH' | 'F' | 'S', string>>
}

type InstructorSchedule = {
  name: string
  room: string
  focus: string
  slots: ScheduleSlot[]
}

const dayOrder: Array<'M' | 'T' | 'W' | 'TH' | 'F' | 'S'> = ['M', 'T', 'W', 'TH', 'F', 'S']

const instructorSchedules: InstructorSchedule[] = [
  {
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

function renderInstructorCard(schedule: InstructorSchedule): string {
  return `
    <article class="faculty-schedule-instructor">
      <strong>${schedule.name}</strong>
      <span>Room ${schedule.room}</span>
      <small>${schedule.focus}</small>
    </article>
  `
}

function renderScheduleGrid(schedule: InstructorSchedule): string {
  return `
    <div class="faculty-schedule-grid-wrap">
      <table class="faculty-schedule-grid">
        <thead>
          <tr>
            <th>Time</th>
            ${dayOrder.map((day) => `<th>${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${schedule.slots
            .map(
              (slot) => `
                <tr>
                  <th>${slot.time}</th>
                  ${dayOrder
                    .map((day) => {
                      const value = slot.values[day]
                      return `<td>${value ? `<span class="faculty-schedule-chip">${schedule.name} - ${value}</span>` : ''}</td>`
                    })
                    .join('')}
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="faculty-schedule-mobile-list">
      ${schedule.slots
        .map(
          (slot) => `
            <article class="faculty-schedule-mobile-card">
              <h5>${slot.time}</h5>
              <div class="faculty-schedule-mobile-days">
                ${dayOrder
                  .map((day) => {
                    const value = slot.values[day]
                    if (!value) return ''
                    return `
                      <div class="faculty-schedule-mobile-item">
                        <span>${day}</span>
                        <strong>${schedule.name} - ${value}</strong>
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

export function renderfaculty_schedule_page(): string {
  return renderPortalShell(
    FACULTY_SHELL_CONFIG,
    'schedule',
    `
      <section class="faculty-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="faculty-panel faculty-schedule-panel">
          <header class="faculty-schedule-head">
            <div>
              <h3>Instructor Schedule Board</h3>
              <p>Weekly schedule view grouped per instructor using registrar-aligned entries.</p>
            </div>
            <div class="faculty-schedule-meta">
              <span>Academic Term: 2nd Semester</span>
              <span>Source: Registrar Schedule Board</span>
            </div>
          </header>

          <section class="faculty-schedule-instructor-list" aria-label="Instructor selection">
            ${instructorSchedules.map((schedule) => renderInstructorCard(schedule)).join('')}
          </section>

          ${instructorSchedules
            .map(
              (schedule) => `
                <section class="faculty-schedule-table-section">
                  <h4>${schedule.name} - Room ${schedule.room}</h4>
                  ${renderScheduleGrid(schedule)}
                </section>
              `,
            )
            .join('')}
        </article>
      </section>
    `,
  )
}
