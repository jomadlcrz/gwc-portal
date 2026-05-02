import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { DEPARTMENT_SELECT_OPTIONS, getDepartmentDisplayName } from '../../../data/departments'
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

function getScheduleChipClass(value: string): string {
  const subjectCode = value.split('-')[0]?.trim().toUpperCase() ?? ''
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

function getInstructorWeeklyHours(instructor: InstructorSchedule): string {
  const total = SCHEDULE_DAY_ORDER.reduce((sum, day) => {
    const hours = Number.parseFloat(getInstructorDayHours(instructor, day) || '0')
    return sum + (Number.isFinite(hours) ? hours : 0)
  }, 0)

  return formatHours(total)
}

function getInstructorRoomLabel(instructor: InstructorSchedule): string {
  if (!instructor.rooms.length) return 'Room not assigned'
  if (instructor.rooms.length === 1) return `Room ${instructor.rooms[0]}`
  return `Rooms ${instructor.rooms.join(', ')}`
}

function getInstructorAvatarInitial(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (!tokens.length) return '?'
  const ignoredTitles = new Set(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'professor', 'asst', 'assistant'])
  const firstNameToken =
    tokens.find((token) => {
      const normalized = token.toLowerCase().replace(/[^a-z]/g, '')
      return normalized && !ignoredTitles.has(normalized)
    }) ?? tokens[0]

  const alphanumeric = firstNameToken.replace(/[^a-z0-9]/gi, '')
  return (alphanumeric[0] ?? firstNameToken[0] ?? '?').toUpperCase()
}

function getDepartmentStats(instructors: InstructorSchedule[]): {
  instructorCount: number
  roomCount: number
  timeSlotCount: number
  subjectCount: number
} {
  const rooms = new Set<string>()
  const timeSlots = new Set<string>()
  const subjects = new Set<string>()

  instructors.forEach((instructor) => {
    instructor.rooms.forEach((room) => rooms.add(room))
    instructor.slots.forEach((slot) => {
      Object.values(slot.values).forEach((value) => {
        if (!value) return
        timeSlots.add(`${instructor.name}-${slot.time}-${value}`)
        subjects.add(value.split('-')[0]?.trim() || value.trim())
      })
    })
  })

  return {
    instructorCount: instructors.length,
    roomCount: rooms.size,
    timeSlotCount: timeSlots.size,
    subjectCount: subjects.size,
  }
}

function renderScheduleMetric(label: string, value: number, note: string, icon: string, tone: string): string {
  return `
    <article class="registrar-schedule-metric registrar-schedule-metric-${tone}">
      <span class="registrar-schedule-metric-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <span class="registrar-schedule-metric-copy">
        <small>${label}</small>
        <strong>${value}</strong>
        <em>${note}</em>
      </span>
    </article>
  `
}

function renderScheduleGrid(instructor: InstructorSchedule): string {
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
          ${instructor.slots
            .map(
              (slot) => `
                <tr>
                  <th>${ensureMeridiem(splitSlotTime(slot.time).start)} - ${ensureMeridiem(splitSlotTime(slot.time).end)}</th>
                  ${SCHEDULE_DISPLAY_DAYS
                    .map((day) => {
                      if (day.key === 'SUN') return '<td><span class="registrar-schedule-empty-mark">-</span></td>'
                      const value = slot.values[day.key]
                      if (!value) return '<td><span class="registrar-schedule-empty-mark">-</span></td>'
                      const chipClass = getScheduleChipClass(value)
                      return `<td><span class="registrar-schedule-chip ${chipClass}">${value}</span></td>`
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
            ${SCHEDULE_DISPLAY_DAYS.map((day) => `<th>${day.key === 'SUN' ? '-' : getInstructorDayHours(instructor, day.key) || '-'}</th>`).join('')}
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
    <div class="registrar-schedule-mobile-shell" data-mobile-schedule>
      <div class="registrar-schedule-mobile-day-tabs" role="tablist" aria-label="Schedule days">
        ${SCHEDULE_DAY_ORDER.map((day) => `<button type="button" data-mobile-day-tab="${day}" class="${day === activeDay ? 'is-active' : ''}" aria-pressed="${day === activeDay}">${day}</button>`).join('')}
      </div>
      ${SCHEDULE_DAY_ORDER.map((day) => {
        const slots = instructor.slots
          .map((slot) => {
            const value = slot.values[day]
            if (!value) return ''
            const chipClass = getScheduleChipClass(value)
            return `
              <article class="registrar-schedule-mobile-block">
                <div class="registrar-schedule-mobile-time">
                  <i class="bi bi-clock" aria-hidden="true"></i>
                  <div class="registrar-schedule-mobile-time-values">
                    <span>${ensureMeridiem(splitSlotTime(slot.time).start)}</span>
                    <span>${ensureMeridiem(splitSlotTime(slot.time).end)}</span>
                  </div>
                </div>
                <div class="registrar-schedule-mobile-course registrar-schedule-chip ${chipClass}">
                  <strong>${value}</strong>
                  <span>${getInstructorRoomLabel(instructor)}</span>
                </div>
              </article>
            `
          })
          .join('')
        return `
          <section class="registrar-schedule-mobile-day-board" data-mobile-day-panel="${day}" ${day === activeDay ? '' : 'hidden'}>
            <header><h6>${getDayLabel(day)}</h6><small>${day === activeDay ? 'Today' : day}</small></header>
            ${slots || '<p>No assigned class blocks.</p>'}
            <footer class="registrar-schedule-mobile-stats">
              <div><small>Total Classes</small><strong>${instructor.slots.filter((slot) => Boolean(slot.values[day])).length}</strong></div>
              <div><small>Total Hours</small><strong>${getInstructorDayHours(instructor, day) || '0'}</strong></div>
            </footer>
          </section>
        `
      }).join('')}
    </div>
  `
}

export function renderregistrar_schedule_page(): string {
  const departmentCodes = Array.from(new Set(INSTRUCTOR_SCHEDULES.map((item) => item.department)))
  const getInstructorTargetId = (departmentCode: string, instructor: InstructorSchedule): string =>
    `registrar-schedule-${departmentCode.toLowerCase()}-${instructor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}
        <article class="registrar-panel registrar-schedule-panel">
          <header class="registrar-schedule-head">
            <div>
              <h3>Schedule Board Access</h3>
              <p>Select a department first, then review its instructor schedules.</p>
            </div>
            <label class="registrar-schedule-search">
              <i class="bi bi-search" aria-hidden="true"></i>
              <span class="visually-hidden">Search instructor</span>
              <input type="search" placeholder="Search instructor..." data-registrar-schedule-search />
            </label>
          </header>

          <section class="registrar-schedule-toolbar" aria-label="Schedule controls">
            <div class="registrar-schedule-filter">
              <label for="registrar-schedule-department" class="form-label">Department</label>
              <div class="registrar-schedule-select-wrap">
                <i class="bi bi-calendar3" aria-hidden="true"></i>
                <select id="registrar-schedule-department" class="form-select" data-registrar-department-select>
                  <option value="">Select Department</option>
                  ${DEPARTMENT_SELECT_OPTIONS.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="registrar-schedule-actions">
              <a href="${ROUTES.REGISTRAR_SCHEDULE_MANAGE}" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-gear" aria-hidden="true"></i>
                Manage Schedule
              </a>
              <a href="${ROUTES.REGISTRAR_SCHEDULE_CREATE}" class="btn btn-sm btn-primary">
                <i class="bi bi-plus-lg" aria-hidden="true"></i>
                Create Schedule
              </a>
            </div>
          </section>

          <section data-registrar-empty-state class="registrar-schedule-empty-state" hidden>
            Choose a department to view the Instructor Schedule Board.
          </section>

          ${departmentCodes
            .map((departmentCode) => {
              const instructors = INSTRUCTOR_SCHEDULES.filter((instructor) => instructor.department === departmentCode)
              const stats = getDepartmentStats(instructors)
              return `
                <section class="registrar-schedule-department-board" data-registrar-department-board="${departmentCode}" hidden>
                  <section class="registrar-schedule-metric-grid" aria-label="${getDepartmentDisplayName(departmentCode)} schedule summary">
                    ${renderScheduleMetric('Total Instructors', stats.instructorCount, 'Active', 'bi-people', 'instructors')}
                    ${renderScheduleMetric('Total Rooms', stats.roomCount, 'Assigned', 'bi-calendar3', 'rooms')}
                    ${renderScheduleMetric('Total Time Slots', stats.timeSlotCount, 'Scheduled', 'bi-clock', 'slots')}
                    ${renderScheduleMetric('Total Subjects', stats.subjectCount, 'This Department', 'bi-book', 'subjects')}
                  </section>
                  <section class="registrar-schedule-instructor-list" aria-label="Instructor schedule">
                    ${instructors
                      .map(
                        (instructor) => `
                          <button type="button" class="registrar-schedule-instructor" data-registrar-schedule-jump="${getInstructorTargetId(departmentCode, instructor)}" data-registrar-schedule-item data-search-value="${`${instructor.name} ${instructor.rooms.join(' ')} ${instructor.focus}`.toLowerCase()}">
                            <span class="registrar-schedule-instructor-avatar">${getInstructorAvatarInitial(instructor.name)}</span>
                            <span class="registrar-schedule-instructor-copy">
                              <strong>${instructor.name}</strong>
                              <span>${getInstructorRoomLabel(instructor)}</span>
                              <small>${instructor.focus}</small>
                              <em><i class="bi bi-calendar3" aria-hidden="true"></i>${getInstructorWeeklyHours(instructor)} hrs/week</em>
                            </span>
                            <i class="bi bi-chevron-right" aria-hidden="true"></i>
                          </button>
                        `,
                      )
                      .join('')}
                  </section>

                  ${instructors
                    .map(
                      (instructor) => `
                        <section id="${getInstructorTargetId(departmentCode, instructor)}" class="registrar-schedule-table-section" data-registrar-schedule-item data-search-value="${`${instructor.name} ${instructor.rooms.join(' ')} ${instructor.focus}`.toLowerCase()}">
                          <h4><i class="bi bi-calendar3" aria-hidden="true"></i>${instructor.name} - ${getInstructorRoomLabel(instructor)}</h4>
                          ${renderScheduleGrid(instructor)}
                        </section>
                      `,
                    )
                    .join('')}
                  <p class="registrar-schedule-no-results" data-registrar-schedule-no-results hidden>No instructors match your search.</p>
                </section>
              `
            })
            .join('')}
        </article>
      </section>
    `,
  )
}


