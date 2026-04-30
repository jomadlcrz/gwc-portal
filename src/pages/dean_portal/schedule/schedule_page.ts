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

function getScheduleChipClass(value: string, room: string): string {
  const subjectCode = value.split('-')[0]?.trim().toUpperCase() ?? ''
  const normalizedRoom = room.trim().toUpperCase()
  if (normalizedRoom.startsWith('CL')) return 'dean-schedule-chip-comlab'
  if (!subjectCode) return 'dean-schedule-chip-general-lecture'
  if (subjectCode.startsWith('CL') || subjectCode.includes('COMLAB')) return 'dean-schedule-chip-comlab'
  if (subjectCode.startsWith('CAPS') || subjectCode.includes('THESIS') || subjectCode.includes('RES')) return 'dean-schedule-chip-research'
  return 'dean-schedule-chip-general-lecture'
}

const instructors: InstructorSchedule[] = [
  {
    name: 'PAU',
    room: 'CL1',
    focus: 'Programming Fundamentals',
    slots: [
      { time: '07:00 - 09:30', values: { T: 'SA101 - 4C', W: 'CC102 - 1A', TH: 'CC102 - 1A', F: 'SA101 - 4C' } },
      { time: '09:30 - 12:00', values: { T: 'SA101 - 4D', W: 'CC102 - 1B', TH: 'CC102 - 1B', F: 'SA101 - 4D' } },
      { time: '12:00 - 15:00', values: { M: 'SA101 - 4A', T: 'CC102 - 1E', W: 'CC102 - 1C', TH: 'CC102 - 1C', F: 'CC102 - 1E' } },
      { time: '15:00 - 18:00', values: { M: 'SA101 - 4A', T: 'CC102 - 1F', W: 'CC102 - 1D', TH: 'CC102 - 1D', F: 'CC102 - 1F' } },
    ],
  },
  {
    name: 'JOY',
    room: 'CL2',
    focus: 'Intro to Information Management',
    slots: [
      { time: '07:00 - 09:30', values: { M: 'IM101 - 2A', T: 'CC101 - 1A', W: 'IM101 - 2E', TH: 'IM101 - 2A', F: 'CC101 - 1A' } },
      { time: '09:30 - 12:00', values: { M: 'IM101 - 2B', T: 'CC101 - 1B', W: 'CC101 - 1E', TH: 'IM101 - 2B', F: 'CC101 - 1B', S: 'IM101 - 2E' } },
      { time: '12:00 - 15:00', values: { M: 'IM101 - 2C', T: 'CC101 - 1C', W: 'CC101 - 1F', TH: 'IM101 - 2C', F: 'CC101 - 1C', S: 'CC101 - 1E' } },
      { time: '15:00 - 18:00', values: { M: 'IM101 - 2D', T: 'CC101 - 1D', TH: 'IM101 - 2D', F: 'CC101 - 1D', S: 'CC101 - 1F' } },
    ],
  },
  {
    name: 'JV',
    room: '302',
    focus: 'IT Electives and Research',
    slots: [
      { time: '07:00 - 09:30', values: { T: 'ITELEC1 - 3A', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3A' } },
      { time: '09:30 - 12:00', values: { T: 'ITELEC1 - 3B', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3B' } },
      { time: '12:00 - 15:00', values: { T: 'ITELEC1 - 3C', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3C' } },
      { time: '15:00 - 18:00', values: { T: 'ITELEC1 - 3D', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3D' } },
    ],
  },
  {
    name: 'KAI',
    room: '402',
    focus: 'Information Management and IT Elective 4',
    slots: [
      { time: '07:00 - 09:30', values: { M: 'IM102 - 3A', T: 'IM102 - 3E', W: 'IM102 - 3A', TH: 'IM102 - 3E', F: 'CAPS2 - 4A' } },
      { time: '09:30 - 12:00', values: { M: 'IM102 - 3B', T: 'IM102 - 3F', W: 'IM102 - 3B', TH: 'IM102 - 3F' } },
      { time: '12:00 - 15:00', values: { M: 'IM102 - 3C', T: 'ITELEC4 - 4A', W: 'IM102 - 3C', TH: 'ITELEC4 - 4A', F: 'CAPS2 - 4B' } },
      { time: '15:00 - 18:00', values: { M: 'IM102 - 3D', T: 'ITELEC4 - 4B', W: 'IM102 - 3D', TH: 'ITELEC4 - 4B' } },
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

function getCurrentScheduleDay(): (typeof dayOrder)[number] {
  const jsDay = new Date().getDay()
  const map: Record<number, (typeof dayOrder)[number]> = { 0: 'S', 1: 'M', 2: 'T', 3: 'W', 4: 'TH', 5: 'F', 6: 'S' }
  return map[jsDay] ?? 'M'
}
function getDayLabel(day: (typeof dayOrder)[number]): string {
  if (day === 'M') return 'Monday'
  if (day === 'T') return 'Tuesday'
  if (day === 'W') return 'Wednesday'
  if (day === 'TH') return 'Thursday'
  if (day === 'F') return 'Friday'
  return 'Saturday'
}
function splitSlotTime(slotTime: string): { start: string; end: string } {
  const [start = '', end = ''] = slotTime.split('-').map((value) => value.trim())
  return { start, end }
}
function ensureMeridiem(timeText: string): string {
  if (!timeText) return timeText
  if (/\bAM\b|\bPM\b/i.test(timeText)) return timeText.toUpperCase()
  const match = timeText.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return timeText
  const hour = Number.parseInt(match[1], 10)
  const minute = match[2]
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute} ${suffix}`
}

function renderScheduleGrid(instructor: InstructorSchedule): string {
  const activeDay = getCurrentScheduleDay()
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
                  <th>${ensureMeridiem(splitSlotTime(slot.time).start)} - ${ensureMeridiem(splitSlotTime(slot.time).end)}</th>
                  ${dayOrder
                    .map((day) => {
                      const value = slot.values[day]
                      if (!value) return '<td></td>'
                      const chipClass = getScheduleChipClass(value, instructor.room)
                      return `<td><span class="dean-schedule-chip ${chipClass}">${instructor.name} - ${value}</span></td>`
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
    <div class="dean-schedule-mobile-shell" data-mobile-schedule>
      <div class="dean-schedule-mobile-day-tabs">${dayOrder.map((day) => `<button type="button" data-mobile-day-tab="${day}" class="${day === activeDay ? 'is-active' : ''}" aria-pressed="${day === activeDay}">${day}</button>`).join('')}</div>
      ${dayOrder.map((day) => `
        <section class="dean-schedule-mobile-day-board" data-mobile-day-panel="${day}" ${day === activeDay ? '' : 'hidden'}>
          <header><h6>${getDayLabel(day)}</h6><small>${day === activeDay ? 'Today' : day}</small></header>
          ${instructor.slots.map((slot) => {
            const value = slot.values[day]
            if (!value) return ''
            const chipClass = getScheduleChipClass(value, instructor.room)
            const split = splitSlotTime(slot.time)
            return `<article class="dean-schedule-mobile-block"><div class="dean-schedule-mobile-time"><i class="bi bi-clock"></i><div class="dean-schedule-mobile-time-values"><span>${ensureMeridiem(split.start)}</span><span>${ensureMeridiem(split.end)}</span></div></div><div class="dean-schedule-mobile-course dean-schedule-chip ${chipClass}"><strong>${value}</strong><span>Room ${instructor.room}</span></div></article>`
          }).join('') || '<p>No assigned class blocks.</p>'}
          <footer class="dean-schedule-mobile-stats"><div><small>Total Classes</small><strong>${instructor.slots.filter((slot) => Boolean(slot.values[day])).length}</strong></div><div><small>Total Hours</small><strong>${getInstructorDayHours(instructor, day) || '0'}</strong></div></footer>
        </section>
      `).join('')}
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


