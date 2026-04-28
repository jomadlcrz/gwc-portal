import { DEAN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
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

const instructors: InstructorSchedule[] = [
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

function getInstructorDayHours(instructor: InstructorSchedule, day: (typeof dayOrder)[number]): string {
  const total = instructor.slots.reduce((sum, slot) => {
    if (!slot.values[day]) return sum
    return sum + getSlotDuration(slot.time)
  }, 0)

  if (total <= 0) return ''
  return formatHours(total)
}

function renderScheduleGrid(instructor: InstructorSchedule): string {
  return `
    <div class="dean-schedule-grid-wrap">
      <table class="dean-schedule-grid">
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
                      return `<td>${value ? `<span class="dean-schedule-chip">${instructor.name} - ${value}</span>` : ''}</td>`
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
            ${dayOrder.map((day) => `<th>${getInstructorDayHours(instructor, day)}</th>`).join('')}
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="dean-schedule-mobile-list">
      ${instructor.slots
        .map(
          (slot) => `
            <article class="dean-schedule-mobile-card">
              <h5>${slot.time}</h5>
              <div class="dean-schedule-mobile-days">
                ${dayOrder
                  .map((day) => {
                    const value = slot.values[day]
                    if (!value) return ''
                    return `
                      <div class="dean-schedule-mobile-item">
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

export function renderdean_schedule_page(): string {
  return renderPortalShell(
    DEAN_SHELL_CONFIG,
    'schedule',
    `
      <section class="dean-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="dean-panel dean-schedule-panel">
          <header class="dean-schedule-head">
            <div>
              <h3>Instructor Schedule Board</h3>
              <p>Dean view for all instructor weekly schedules.</p>
            </div>
          </header>

          <section class="dean-schedule-instructor-list" aria-label="Instructor schedule">
            ${instructors
              .map(
                (instructor) => `
                  <article class="dean-schedule-instructor">
                    <strong>${instructor.name}</strong>
                    <span>Room ${instructor.room}</span>
                    <small>${instructor.focus}</small>
                  </article>
                `,
              )
              .join('')}
          </section>

          ${instructors
            .map(
              (instructor) => `
                <section class="dean-schedule-table-section">
                  <h4>${instructor.name} - Room ${instructor.room}</h4>
                  ${renderScheduleGrid(instructor)}
                </section>
              `,
            )
            .join('')}
        </article>
      </section>
    `,
  )
}
