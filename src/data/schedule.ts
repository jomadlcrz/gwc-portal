import type { ScheduleItem } from '../features/scheduling/types'
import {
  getScheduleProgramFromSection,
  getScheduleUnits,
  listClassScheduleEntries,
  type ScheduleEnrollmentType,
} from './class_schedule'

export type ScheduleDay = 'M' | 'T' | 'W' | 'TH' | 'F' | 'S'

export type ScheduleSlot = {
  time: string
  values: Partial<Record<ScheduleDay, string>>
}

export type InstructorSchedule = {
  department: string
  name: string
  rooms: string[]
  focus: string
  slots: ScheduleSlot[]
}

export type ScheduleSubjectType = 'COMLAB' | 'RESEARCH_THESIS' | 'GENERAL_LECTURE' | 'CONFLICT_ISSUE'

export type ScheduleBoardScope = ScheduleEnrollmentType | 'All'

export type ScheduleCellTone = 'blue' | 'violet' | 'teal' | 'indigo'

export type SchedulePlannerEntry = {
  sourceStatus: ScheduleEnrollmentType
  day: string
  dayKey: ScheduleDay
  time: string
  startTime: string
  endTime: string
  subject: string
  meta: string
  instructor: string
  room: string
  program: string
  section: string
  tone: ScheduleCellTone
  units: number
}

export type ScheduleTimeRow = {
  startTime: string
  endTime: string
  startLabel: string
  endLabel: string
}

export type ScheduleConflictSummary = {
  type: 'Instructor Conflict' | 'Room Conflict' | 'Section Conflict'
  icon: string
  detail: string
}

export type ScheduleSubjectSummary = {
  code: string
  title: string
  category: string
}

export type ScheduleRoomSummary = {
  room: string
  capacity: number
  blocks: number
}

export const SCHEDULE_DAY_ORDER: ScheduleDay[] = ['M', 'T', 'W', 'TH', 'F', 'S']

const SCHEDULE_DAY_LABELS: Record<ScheduleDay, string> = {
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  TH: 'Thursday',
  F: 'Friday',
  S: 'Saturday',
}

const DAY_KEYS: Record<string, ScheduleDay> = {
  monday: 'M',
  tuesday: 'T',
  wednesday: 'W',
  thursday: 'TH',
  friday: 'F',
  saturday: 'S',
}

function toMinutes(time: string): number {
  const [hourText, minuteText = '0'] = time.trim().split(':')
  const hour = Number.parseInt(hourText, 10)
  const minute = Number.parseInt(minuteText, 10)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return Number.MAX_SAFE_INTEGER
  return hour * 60 + minute
}

function hasOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return Math.max(toMinutes(aStart), toMinutes(bStart)) < Math.min(toMinutes(aEnd), toMinutes(bEnd))
}

function normalizeScheduleValue(value: string): string {
  return value.trim().toLowerCase()
}

function getClassAssignmentKey(item: ScheduleItem): string {
  return [
    item.subjectCode,
    item.section,
    item.faculty,
    item.room,
    item.day,
    item.startTime,
    item.endTime,
  ]
    .map((value) => normalizeScheduleValue(value))
    .join('|')
}

function listUniqueClassAssignments(items: ScheduleItem[]): ScheduleItem[] {
  const unique = new Map<string, ScheduleItem>()
  items.forEach((item) => {
    const key = getClassAssignmentKey(item)
    if (unique.has(key)) return
    unique.set(key, item)
  })
  return Array.from(unique.values())
}

function isSameClassAssignment(a: ScheduleItem, b: ScheduleItem): boolean {
  return getClassAssignmentKey(a) === getClassAssignmentKey(b)
}

function compareScheduleItems(a: ScheduleItem, b: ScheduleItem): number {
  const dayA = getScheduleDayKey(a.day)
  const dayB = getScheduleDayKey(b.day)
  const dayDelta = (dayA ? SCHEDULE_DAY_ORDER.indexOf(dayA) : 99) - (dayB ? SCHEDULE_DAY_ORDER.indexOf(dayB) : 99)
  if (dayDelta !== 0) return dayDelta
  const timeDelta = toMinutes(a.startTime) - toMinutes(b.startTime)
  if (timeDelta !== 0) return timeDelta
  return a.subjectCode.localeCompare(b.subjectCode)
}

function comparePlannerEntries(a: SchedulePlannerEntry, b: SchedulePlannerEntry): number {
  const dayDelta = SCHEDULE_DAY_ORDER.indexOf(a.dayKey) - SCHEDULE_DAY_ORDER.indexOf(b.dayKey)
  if (dayDelta !== 0) return dayDelta
  const timeDelta = toMinutes(a.startTime) - toMinutes(b.startTime)
  if (timeDelta !== 0) return timeDelta
  return a.subject.localeCompare(b.subject)
}

function getScopeEntries(scope: ScheduleBoardScope) {
  return listClassScheduleEntries(scope === 'All' ? {} : { status: scope })
}

function getScheduleCategory(item: ScheduleItem): string {
  const code = item.subjectCode.toUpperCase()
  if (code.includes('PATHFIT')) return 'Minor'
  if (code.includes('GE') || code.startsWith('LIT') || code.startsWith('MS')) return 'GE'
  if (item.room.toUpperCase().includes('CL') || code.startsWith('PT') || code.startsWith('ITELEC')) return 'Major (with lab)'
  return 'Major'
}

function getScheduleEntryTone(item: ScheduleItem): ScheduleCellTone {
  const code = item.subjectCode.toUpperCase()
  const category = getScheduleCategory(item)
  if (category === 'Major (with lab)') return 'blue'
  if (category === 'GE' || category === 'Minor') return 'indigo'
  if (code.startsWith('CAPS') || code.includes('THESIS') || code.includes('RES')) return 'teal'
  return 'violet'
}

function buildBoardLabel(item: ScheduleItem): string {
  return `${item.subjectCode} - ${item.section} (${item.room})`
}

function buildFocus(items: ScheduleItem[]): string {
  const codes = Array.from(new Set(items.map((item) => item.subjectCode)))
  if (codes.length <= 3) return codes.join(', ')
  return `${codes.slice(0, 3).join(', ')} +${codes.length - 3}`
}

export function getScheduleSubjectType(subjectValue: string): ScheduleSubjectType {
  const subjectCode = subjectValue.split('-')[0]?.trim().toUpperCase() ?? ''

  if (subjectCode.startsWith('CL') || subjectCode.includes('COMLAB')) return 'COMLAB'
  if (subjectCode.startsWith('CAPS') || subjectCode.includes('THESIS') || subjectCode.includes('RES')) return 'RESEARCH_THESIS'
  return 'GENERAL_LECTURE'
}

export function isComlabSubject(subjectValue: string): boolean {
  return getScheduleSubjectType(subjectValue) === 'COMLAB'
}

export function getScheduleDayKey(day: string): ScheduleDay | null {
  return DAY_KEYS[day.trim().toLowerCase()] ?? null
}

export function getScheduleDayLabel(day: ScheduleDay): string {
  return SCHEDULE_DAY_LABELS[day]
}

export function toScheduleDisplayTime(time: string): string {
  const [hourText, minuteText = '00'] = time.trim().split(':')
  const hour = Number.parseInt(hourText, 10)
  const minute = Number.parseInt(minuteText, 10)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${suffix}`
}

export function listScheduleItems(scope: ScheduleBoardScope = 'All'): ScheduleItem[] {
  return getScopeEntries(scope).map((entry) => entry.row).sort(compareScheduleItems)
}

export function listInstructorSchedules(scope: ScheduleBoardScope = 'All'): InstructorSchedule[] {
  const groups = new Map<string, { department: string; name: string; items: ScheduleItem[] }>()

  listScheduleItems(scope).forEach((item) => {
    const key = [item.department, item.faculty].join('|')
    const existing = groups.get(key)
    if (existing) {
      existing.items.push(item)
      return
    }

    groups.set(key, {
      department: item.department,
      name: item.faculty,
      items: [item],
    })
  })

  return Array.from(groups.values())
    .map((group) => {
      const slotMap = new Map<string, ScheduleSlot>()
      const rooms = new Set<string>()
      group.items.forEach((item) => {
        rooms.add(item.room)
        const dayKey = getScheduleDayKey(item.day)
        if (!dayKey) return
        const time = `${item.startTime} - ${item.endTime}`
        const existingSlot = slotMap.get(time) ?? { time, values: {} }
        const existingValue = existingSlot.values[dayKey]
        const nextValue = buildBoardLabel(item)
        if (!existingValue) {
          existingSlot.values[dayKey] = nextValue
        } else {
          const labels = new Set(existingValue.split(' / ').map((value) => value.trim()).filter(Boolean))
          labels.add(nextValue)
          existingSlot.values[dayKey] = Array.from(labels).join(' / ')
        }
        slotMap.set(time, existingSlot)
      })

      const slots = Array.from(slotMap.values()).sort((a, b) => toMinutes(a.time.split('-')[0] ?? '') - toMinutes(b.time.split('-')[0] ?? ''))
      const sortedRooms = Array.from(rooms).sort((a, b) => a.localeCompare(b))

      return {
        department: group.department,
        name: group.name,
        rooms: sortedRooms,
        focus: buildFocus(group.items),
        slots,
      }
    })
    .sort((a, b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name))
}

export function listSchedulePlannerEntries(scope: ScheduleBoardScope = 'All'): SchedulePlannerEntry[] {
  return getScopeEntries(scope)
    .map((entry) => {
      const dayKey = getScheduleDayKey(entry.row.day)
      if (!dayKey) return null
      return {
        sourceStatus: entry.status,
        day: entry.row.day,
        dayKey,
        time: `${toScheduleDisplayTime(entry.row.startTime)} - ${toScheduleDisplayTime(entry.row.endTime)}`,
        startTime: entry.row.startTime,
        endTime: entry.row.endTime,
        subject: entry.row.subjectCode,
        meta: entry.row.descriptiveTitle,
        instructor: entry.row.faculty,
        room: entry.row.room,
        program: getScheduleProgramFromSection(entry.row.section),
        section: entry.row.section,
        tone: getScheduleEntryTone(entry.row),
        units: getScheduleUnits(entry.row),
      } satisfies SchedulePlannerEntry
    })
    .filter((entry): entry is SchedulePlannerEntry => Boolean(entry))
    .sort(comparePlannerEntries)
}

export function listScheduleTimeRows(scope: ScheduleBoardScope = 'All'): ScheduleTimeRow[] {
  const rows = new Map<string, ScheduleTimeRow>()
  listSchedulePlannerEntries(scope).forEach((entry) => {
    const key = `${entry.startTime}|${entry.endTime}`
    if (rows.has(key)) return
    rows.set(key, {
      startTime: entry.startTime,
      endTime: entry.endTime,
      startLabel: toScheduleDisplayTime(entry.startTime),
      endLabel: toScheduleDisplayTime(entry.endTime),
    })
  })

  return Array.from(rows.values()).sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime) || toMinutes(a.endTime) - toMinutes(b.endTime))
}

export function listSchedulePrograms(scope: ScheduleBoardScope = 'All'): string[] {
  return Array.from(new Set(listSchedulePlannerEntries(scope).map((entry) => entry.program))).sort()
}

export function listScheduleSections(scope: ScheduleBoardScope = 'All'): string[] {
  return Array.from(new Set(listSchedulePlannerEntries(scope).map((entry) => entry.section))).sort()
}

export function listScheduleConflicts(scope: ScheduleBoardScope = 'All'): ScheduleConflictSummary[] {
  const items = listUniqueClassAssignments(listScheduleItems(scope))
  const conflicts: ScheduleConflictSummary[] = []

  for (let outer = 0; outer < items.length; outer += 1) {
    for (let inner = outer + 1; inner < items.length; inner += 1) {
      const first = items[outer]
      const second = items[inner]
      if (isSameClassAssignment(first, second)) continue
      if (first.day !== second.day || !hasOverlap(first.startTime, first.endTime, second.startTime, second.endTime)) continue
      const time = `${toScheduleDisplayTime(first.startTime)} - ${toScheduleDisplayTime(first.endTime)}`

      if (first.faculty === second.faculty) {
        conflicts.push({
          type: 'Instructor Conflict',
          icon: 'bi-exclamation-circle-fill',
          detail: `${first.faculty} has ${first.subjectCode} and ${second.subjectCode} on ${first.day}, ${time}.`,
        })
      }

      if (first.room === second.room) {
        conflicts.push({
          type: 'Room Conflict',
          icon: 'bi-x-circle-fill',
          detail: `${first.room} is used by ${first.subjectCode} and ${second.subjectCode} on ${first.day}, ${time}.`,
        })
      }

      if (first.section === second.section) {
        conflicts.push({
          type: 'Section Conflict',
          icon: 'bi-exclamation-triangle-fill',
          detail: `${first.section} has overlapping ${first.subjectCode} and ${second.subjectCode} blocks on ${first.day}.`,
        })
      }
    }
  }

  return conflicts.slice(0, 3)
}

export function listScheduleSubjectSummaries(scope: ScheduleBoardScope = 'All'): ScheduleSubjectSummary[] {
  const subjects = new Map<string, ScheduleSubjectSummary>()
  listScheduleItems(scope).forEach((item) => {
    if (subjects.has(item.subjectCode)) return
    subjects.set(item.subjectCode, {
      code: item.subjectCode,
      title: item.descriptiveTitle,
      category: getScheduleCategory(item),
    })
  })
  return Array.from(subjects.values()).sort((a, b) => a.code.localeCompare(b.code))
}

export function listScheduleRoomSummaries(scope: ScheduleBoardScope = 'All'): ScheduleRoomSummary[] {
  const rooms = new Map<string, ScheduleRoomSummary>()
  listScheduleItems(scope).forEach((item) => {
    const existing = rooms.get(item.room)
    if (existing) {
      existing.capacity = Math.max(existing.capacity, item.capacity)
      existing.blocks += 1
      return
    }

    rooms.set(item.room, {
      room: item.room,
      capacity: item.capacity,
      blocks: 1,
    })
  })

  return Array.from(rooms.values()).sort((a, b) => a.room.localeCompare(b.room))
}

export const INSTRUCTOR_SCHEDULES: InstructorSchedule[] = listInstructorSchedules()
