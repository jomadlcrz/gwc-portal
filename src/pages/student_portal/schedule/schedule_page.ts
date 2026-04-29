import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { resolveStudentScheduleById } from '../../../data/student_schedule'
import { BSIT_CURRICULUM_MOCK, schedulingService } from '../../../features/scheduling/service'
import type { ScheduleItem } from '../../../features/scheduling/types'

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

function formatDayCompact(days: string[]): string {
  const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const unique = Array.from(new Set(days))
  const sorted = unique.sort((a, b) => order.indexOf(a) - order.indexOf(b))
  return sorted.map((day) => formatDay(day)).join('')
}

function isTodayScheduleDay(day: string): boolean {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return day.trim().toLowerCase() === today.toLowerCase()
}

function sortScheduleRowsTodayFirst<T extends { day: string }>(items: T[]): T[] {
  const withIndex = items.map((item, index) => ({ item, index }))
  withIndex.sort((a, b) => {
    const aToday = isTodayScheduleDay(a.item.day) ? 1 : 0
    const bToday = isTodayScheduleDay(b.item.day) ? 1 : 0
    if (aToday !== bToday) return bToday - aToday
    return a.index - b.index
  })
  return withIndex.map((entry) => entry.item)
}

function to12Hour(time: string): string {
  const [hourText, minuteText = '00'] = time.trim().split(':')
  const hour = Number.parseInt(hourText, 10)
  const minute = Number.parseInt(minuteText, 10)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time
  const meridiem = hour >= 12 ? 'PM' : 'AM'
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12
  return `${normalizedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${meridiem}`
}

type StudentScheduleDisplayItem = ScheduleItem & {
  displaySet: string
  days: string[]
  sets: string[]
}

function mergeScheduleRows(items: ScheduleItem[], isRegular: boolean, irregularSetOptions: string[]): StudentScheduleDisplayItem[] {
  const grouped = new Map<string, StudentScheduleDisplayItem>()
  items.forEach((item, index) => {
    const displaySet = isRegular ? item.section : irregularSetOptions[index % irregularSetOptions.length]
    const key = isRegular
      ? [
          item.subjectCode,
          item.title,
          item.startTime,
          item.endTime,
          item.capacity >= 40 ? '3' : '2',
        ].join('|')
      : [
          item.subjectCode,
          item.title,
          item.faculty,
          item.room,
          item.startTime,
          item.endTime,
          item.capacity >= 40 ? '3' : '2',
        ].join('|')

    const existing = grouped.get(key)
    if (existing) {
      if (!existing.days.includes(item.day)) existing.days.push(item.day)
      if (!existing.sets.includes(displaySet)) existing.sets.push(displaySet)
      existing.displaySet = isRegular ? displaySet : existing.sets.join('/')
      return
    }

    grouped.set(key, { ...item, displaySet, days: [item.day], sets: [displaySet] })
  })

  return Array.from(grouped.values())
}

function buildThirdYearSecondSemMockRows(section: string): ScheduleItem[] {
  const term = BSIT_CURRICULUM_MOCK.find((item) => item.yearLabel === 'Third Year' && item.semesterLabel === '2nd Semester')
  if (!term) return []

  const dayPatterns = [
    { day: 'Monday', startTime: '08:00', endTime: '09:30' },
    { day: 'Tuesday', startTime: '10:00', endTime: '11:30' },
    { day: 'Wednesday', startTime: '08:00', endTime: '09:30' },
    { day: 'Thursday', startTime: '10:00', endTime: '11:30' },
    { day: 'Friday', startTime: '13:00', endTime: '14:30' },
    { day: 'Monday', startTime: '15:00', endTime: '16:30' },
    { day: 'Wednesday', startTime: '15:00', endTime: '16:30' },
  ]

  return term.subjects.map((subject, index) => ({
    id: `mock-3y2s-${index + 1}`,
    subjectCode: subject.code,
    title: subject.title,
    section,
    faculty: index % 2 === 0 ? 'Prof. Maria Dela Cruz' : 'Prof. John Santos',
    department: 'CITE',
    room: index % 2 === 0 ? 'Room 301' : 'Room 302',
    day: dayPatterns[index]?.day ?? 'Friday',
    startTime: dayPatterns[index]?.startTime ?? '10:00',
    endTime: dayPatterns[index]?.endTime ?? '11:30',
    deliveryMode: 'Face-to-Face',
    capacity: subject.units >= 9 ? 80 : subject.units >= 3 ? 40 : 35,
  }))
}

export function renderstudent_schedule_page(): string {
  const params = new URLSearchParams(window.location.search)
  const studentProfile = resolveStudentScheduleById(params.get('student'))
  const isRegular = studentProfile.status === 'Regular'
  const baseRows = isRegular
    ? buildThirdYearSecondSemMockRows('BSIT-3D')
    : schedulingService.listStudentSchedules()
  const irregularSetOptions = ['N/A', 'BSIT-3A', 'BSIT-3B', 'BSIT-3C']
  const mergedRows = mergeScheduleRows(baseRows, isRegular, irregularSetOptions)
  const rows = sortScheduleRowsTodayFirst(mergedRows.map((item) => ({ ...item, day: item.days.find((day) => isTodayScheduleDay(day)) ?? item.days[0] })))
  const totalUnits = mergedRows.reduce((sum, item) => sum + (item.capacity >= 40 ? 3 : 2), 0)

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
              <p><i class="bi bi-person" aria-hidden="true"></i><span>Name of Student:</span> <strong>${studentProfile.name}</strong></p>
              <p><i class="bi bi-mortarboard" aria-hidden="true"></i><span>Year Level and Section:</span> <strong>${studentProfile.yearLevelSection}</strong></p>
              <p><i class="bi bi-journal-text" aria-hidden="true"></i><span>Program:</span> <strong>${studentProfile.course}</strong></p>
              <p><i class="bi bi-gear" aria-hidden="true"></i><span>Status:</span> <strong class="student-schedule-status-badge ${isRegular ? 'is-regular' : 'is-irregular'}">${studentProfile.status}</strong></p>
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
                            <tr class="${isTodayScheduleDay(item.day) ? 'student-schedule-row-today' : ''}">
                              <td>${item.subjectCode}</td>
                              <td>${item.title}</td>
                              <td>${item.capacity >= 40 ? 3 : 2}</td>
                              <td>${item.faculty}</td>
                              <td class="${item.days.some((day) => isTodayScheduleDay(day)) ? 'student-schedule-day-today' : ''}">${formatDayCompact(item.days)}</td>
                              <td>${to12Hour(item.startTime)} - ${to12Hour(item.endTime)}</td>
                              <td>${item.room}</td>
                              <td>${item.displaySet}</td>
                            </tr>
                          `,
                        )
                        .join('')
                    : '<tr><td colspan="8" class="text-center py-3">No schedules published yet.</td></tr>'
                }
              </tbody>
            </table>
          </div>
          <div class="student-schedule-mobile-list" data-student-schedule-mobile>
            ${
              rows.length
                ? rows
                    .map(
                      (item) => `
                        <article class="student-schedule-mobile-card ${item.days.some((day) => isTodayScheduleDay(day)) ? 'is-today' : ''}">
                          <div class="student-schedule-mobile-subject">
                            <h4>${item.subjectCode}${item.days.some((day) => isTodayScheduleDay(day)) ? ' <small>Today</small>' : ''}</h4>
                            <p>${item.title}</p>
                            <span>Units: ${item.capacity >= 40 ? 3 : 2}</span>
                          </div>
                          <div class="student-schedule-mobile-details">
                            <p><i class="bi bi-person" aria-hidden="true"></i><span>${item.faculty}</span></p>
                            <p><i class="bi bi-calendar3" aria-hidden="true"></i><span>${formatDayCompact(item.days)}</span></p>
                            <p><i class="bi bi-clock" aria-hidden="true"></i><span>${to12Hour(item.startTime)} - ${to12Hour(item.endTime)}</span></p>
                            <p><i class="bi bi-geo-alt" aria-hidden="true"></i><span>${item.room}</span></p>
                            <p><i class="bi bi-collection" aria-hidden="true"></i><span>Set: ${item.displaySet}</span></p>
                          </div>
                        </article>
                      `,
                    )
                    .join('')
                : '<p class="student-schedule-mobile-empty">No schedules published yet.</p>'
            }
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
