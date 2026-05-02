import type { ScheduleItem } from '../features/scheduling/types'
import { resolveClassScheduleRows, type ScheduleEnrollmentType } from './class_schedule'

export type StudentScheduleSource = {
  studentId: string
  status: ScheduleEnrollmentType
  rows: ScheduleItem[]
}

export function resolveStudentScheduleRows(studentId: string, status: ScheduleEnrollmentType): ScheduleItem[] {
  return resolveClassScheduleRows(studentId, status)
}
