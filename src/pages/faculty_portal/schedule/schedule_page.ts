import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { INSTRUCTOR_SCHEDULES, SCHEDULE_DAY_ORDER, type InstructorSchedule } from '../../../data/schedule'

const SCHEDULE_DISPLAY_DAYS = [
  { key: 'M', label: 'Mon' },
  { key: 'T', label: 'Tue' },
  { key: 'W', label: 'Wed' },
  { key: 'TH', label: 'Thu' },
  { key: 'F', label: 'Fri' },
  { key: 'S', label: 'Sat' },
  { key: 'SUN', label: 'Sun' },
] as const

function getScheduleChipClass(value: string, room: string): string {
  const subjectCode = value.split('-')[0]?.trim().toUpperCase() ?? ''
  const normalizedRoom = room.trim().toUpperCase()
  if (normalizedRoom.startsWith('CL')) return 'registrar-schedule-chip-comlab'
  if (!subjectCode) return 'registrar-schedule-chip-general-lecture'
  if (subjectCode.startsWith('CL') || subjectCode.includes('COMLAB')) return 'registrar-schedule-chip-comlab'
  if (subjectCode.startsWith('CAPS') || subjectCode.includes('THESIS') || subjectCode.includes('RES')) return 'registrar-schedule-chip-research'
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

function getCurrentScheduleDay(): (typeof SCHEDULE_DAY_ORDER)[number] {
  const jsDay = new Date().getDay()
  const map: Record<number, (typeof SCHEDULE_DAY_ORDER)[number]> = {
    0: 'S',
    1: 'M',
    2: 'T',
    3: 'W',
    4: 'TH',
    5: 'F',
    6: 'S',
  }
  return map[jsDay] ?? 'M'
}

function getDayLabel(day: (typeof SCHEDULE_DAY_ORDER)[number]): string {
  if (day === 'M') return 'Monday'
  if (day === 'T') return 'Tuesday'
  if (day === 'W') return 'Wednesday'
  if (day === 'TH') return 'Thursday'
  if (day === 'F') return 'Friday'
  return 'Saturday'
}

function renderScheduleGrid(schedule: InstructorSchedule): string {
  const activeDay = getCurrentScheduleDay()
  return `
    <div class="registrar-schedule-grid-wrap">
      <div class="table-responsive">
      <table class="table table-striped table-hover registrar-schedule-grid">
        <thead>
          <tr>
            <th>Time</th>
            ${SCHEDULE_DISPLAY_DAYS.map((day) => `<th>${day.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${schedule.slots
            .map(
              (slot) => `
                <tr>
                  <th>${ensureMeridiem(splitSlotTime(slot.time).start)} - ${ensureMeridiem(splitSlotTime(slot.time).end)}</th>
                  ${SCHEDULE_DISPLAY_DAYS
                    .map((day) => {
                      if (day.key === 'SUN') return '<td><span class="registrar-schedule-empty-mark">-</span></td>'
                      const value = slot.values[day.key]
                      if (!value) return '<td><span class="registrar-schedule-empty-mark">-</span></td>'
                      const chipClass = getScheduleChipClass(value, schedule.room)
                      return `<td><span class="registrar-schedule-chip ${chipClass}">${schedule.name} - ${value}</span></td>`
                    })
                    .join('')}
                </tr>
              `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <th>Total Hours</th>
            ${SCHEDULE_DISPLAY_DAYS.map((day) => `<th>${day.key === 'SUN' ? '-' : getInstructorDayHours(schedule, day.key) || '-'}</th>`).join('')}
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
    <div class="registrar-schedule-mobile-shell" data-mobile-schedule>
      <div class="registrar-schedule-mobile-day-tabs">${SCHEDULE_DAY_ORDER.map((day) => `<button type="button" data-mobile-day-tab="${day}" class="${day === activeDay ? 'is-active' : ''}" aria-pressed="${day === activeDay}">${day}</button>`).join('')}</div>
      ${SCHEDULE_DAY_ORDER.map((day) => {
        const slots = schedule.slots
          .map((slot) => {
            const value = slot.values[day]
            if (!value) return ''
            const chipClass = getScheduleChipClass(value, schedule.room)
            return `<article class="registrar-schedule-mobile-block"><div class="registrar-schedule-mobile-time"><i class="bi bi-clock"></i><div class="registrar-schedule-mobile-time-values"><span>${ensureMeridiem(splitSlotTime(slot.time).start)}</span><span>${ensureMeridiem(splitSlotTime(slot.time).end)}</span></div></div><div class="registrar-schedule-mobile-course registrar-schedule-chip ${chipClass}"><strong>${value}</strong><span>Room ${schedule.room}</span></div></article>`
          })
          .join('')

        return `
          <section class="registrar-schedule-mobile-day-board" data-mobile-day-panel="${day}" ${day === activeDay ? '' : 'hidden'}>
            <header><h6>${getDayLabel(day)}</h6><small>${day === activeDay ? 'Today' : day}</small></header>
            ${slots || '<p>No assigned class blocks.</p>'}
            <footer class="registrar-schedule-mobile-stats"><div><small>Total Classes</small><strong>${schedule.slots.filter((slot) => Boolean(slot.values[day])).length}</strong></div><div><small>Total Hours</small><strong>${getInstructorDayHours(schedule, day) || '0'}</strong></div></footer>
          </section>
        `
      }).join('')}
    </div>
  `
}

export function renderfaculty_schedule_page(): string {
  const currentInstructor = INSTRUCTOR_SCHEDULES[0]

  return renderPortalShell(
    FACULTY_SHELL_CONFIG,
    'schedule',
    `
      <section class="faculty-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="faculty-panel registrar-schedule-panel">
          <header class="registrar-schedule-head">
            <div>
              <h3>My Schedule</h3>
              <p>Weekly schedule view for your assigned classes.</p>
            </div>
          </header>

          ${currentInstructor
            ? `<section class="registrar-schedule-table-section">
                <h4><i class="bi bi-calendar3" aria-hidden="true"></i>${currentInstructor.name} - Room ${currentInstructor.room}</h4>
                ${renderScheduleGrid(currentInstructor)}
              </section>`
            : ''}
        </article>
      </section>
    `,
  )
}
