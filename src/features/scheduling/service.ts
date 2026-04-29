import type {
  ActivityLog,
  Analytics,
  ApprovalRecord,
  ConflictRecord,
  ConflictType,
  ModificationRequest,
  Notification,
  Role,
  Schedule,
  ScheduleExportRow,
  ScheduleItem,
  ScheduleStatus,
  ScheduleVersion,
} from './types'
import { DEFAULT_DEPARTMENT_CODE } from '../../data/departments'

type CreateScheduleInput = {
  term: string
  department: string
  registrarNotes: string
  items: ScheduleItem[]
}

type DecisionInput = {
  scheduleId: string
  reviewerId: string
  comment: string
  tags: string[]
}

type ModificationInput = {
  scheduleId: string
  requesterRole: 'DEPARTMENT' | 'FACULTY'
  requesterId: string
  reason: string
  proposedChange: string
}

type CsvImportSummary = {
  imported: number
  rejected: number
  rejectedLines: number[]
}

const nowIso = (): string => new Date().toISOString()

const createId = (prefix: string): string => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const toMinutes = (value: string): number => {
  const [h, m] = value.split(':').map((part) => Number(part))
  return h * 60 + m
}

const hasOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  const aS = toMinutes(aStart)
  const aE = toMinutes(aEnd)
  const bS = toMinutes(bStart)
  const bE = toMinutes(bEnd)
  return Math.max(aS, bS) < Math.min(aE, bE)
}

const statusLabel: Record<ScheduleStatus, string> = {
  DRAFT: 'Draft',
  CONFLICT_DETECTED: 'Conflict Detected',
  SUBMITTED_FOR_APPROVAL: 'Submitted for Approval',
  UNDER_ADMIN_REVIEW: 'Under Admin Review',
  REJECTED_BY_ADMIN: 'Rejected by Admin',
  APPROVED: 'Approved',
  MODIFICATION_REQUESTED: 'Modification Requested',
  FINALIZED: 'Finalized',
  COMPLETED: 'Completed',
}

class SchedulingService {
  private schedules: Schedule[] = []

  private conflicts: ConflictRecord[] = []

  private approvals: ApprovalRecord[] = []

  private modificationRequests: ModificationRequest[] = []

  private notifications: Notification[] = []

  private activityLogs: ActivityLog[] = []

  constructor() {
    this.seed()
  }

  private seed(): void {
    if (this.schedules.length) return

    const buildItems = (suffix: string, section: string, faculty: string, room: string): ScheduleItem[] => [
      {
        id: createId('item'),
        subjectCode: `CC10${suffix}`,
        title: `Introduction to Computing ${suffix}`,
        section,
        faculty,
        department: DEFAULT_DEPARTMENT_CODE,
        room,
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:30',
        deliveryMode: 'Face-to-Face',
        capacity: 40,
      },
      {
        id: createId('item'),
        subjectCode: `CC20${suffix}`,
        title: `Data Structures ${suffix}`,
        section: `${section}-LAB`,
        faculty: `Asst. ${faculty.replace('Prof. ', '')}`,
        department: DEFAULT_DEPARTMENT_CODE,
        room: `${room} Lab`,
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '11:30',
        deliveryMode: 'Face-to-Face',
        capacity: 35,
      },
      {
        id: createId('item'),
        subjectCode: `CC30${suffix}`,
        title: `Computer Networks ${suffix}`,
        section,
        faculty,
        department: DEFAULT_DEPARTMENT_CODE,
        room,
        day: 'Wednesday',
        startTime: '13:00',
        endTime: '14:30',
        deliveryMode: 'Face-to-Face',
        capacity: 40,
      },
      {
        id: createId('item'),
        subjectCode: `CC40${suffix}`,
        title: `Systems Analysis ${suffix}`,
        section,
        faculty,
        department: DEFAULT_DEPARTMENT_CODE,
        room,
        day: 'Thursday',
        startTime: '15:00',
        endTime: '16:30',
        deliveryMode: 'Hybrid',
        capacity: 40,
      },
      {
        id: createId('item'),
        subjectCode: `CC50${suffix}`,
        title: `Capstone Preparation ${suffix}`,
        section,
        faculty,
        department: DEFAULT_DEPARTMENT_CODE,
        room,
        day: 'Friday',
        startTime: '09:00',
        endTime: '10:30',
        deliveryMode: 'Face-to-Face',
        capacity: 40,
      },
    ]

    const createSeedSchedule = (label: string, items: ScheduleItem[]): Schedule =>
      this.createSchedule(
        {
          term: '1st Semester AY 2026-2027',
          department: DEFAULT_DEPARTMENT_CODE,
          registrarNotes: label,
          items,
        },
        'registrar-1',
        false,
      )

    const approved = createSeedSchedule('Seed: approved schedule', buildItems('1', 'BSIT-1A', 'Prof. Maria Dela Cruz', 'Room 301'))
    approved.status = 'REJECTED_BY_ADMIN'
    this.submitForApproval(approved.id, 'registrar-1', 'Seed: submitted for approval')
    this.approveSchedule({ scheduleId: approved.id, reviewerId: 'admin-1', comment: 'Seed approved', tags: ['seed'] })

    const finalized = createSeedSchedule('Seed: finalized schedule', buildItems('2', 'BSIT-2A', 'Prof. John Santos', 'Room 302'))
    finalized.status = 'REJECTED_BY_ADMIN'
    this.submitForApproval(finalized.id, 'registrar-1', 'Seed: submitted for finalization flow')
    this.approveSchedule({ scheduleId: finalized.id, reviewerId: 'admin-1', comment: 'Seed approved', tags: ['seed'] })
    this.finalizeSchedule(finalized.id, 'admin-1')

    const underReview = createSeedSchedule('Seed: under admin review', buildItems('3', 'BSIT-3A', 'Prof. Angela Reyes', 'Room 303'))
    underReview.status = 'REJECTED_BY_ADMIN'
    this.submitForApproval(underReview.id, 'registrar-1', 'Seed: pending admin review')
    this.moveToAdminReview(underReview.id, 'admin-1')

    const submitted = createSeedSchedule('Seed: submitted for approval', buildItems('4', 'BSIT-4A', 'Prof. Carlo Mendoza', 'Room 304'))
    submitted.status = 'REJECTED_BY_ADMIN'
    this.submitForApproval(submitted.id, 'registrar-1', 'Seed: waiting in queue')

    const rejected = createSeedSchedule('Seed: rejected by admin', buildItems('5', 'BSIT-1B', 'Prof. Liza Ramos', 'Room 305'))
    rejected.status = 'REJECTED_BY_ADMIN'

    const draft = createSeedSchedule('Seed: draft schedule', buildItems('6', 'BSIT-2B', 'Prof. Kevin Flores', 'Room 306'))
    draft.status = 'DRAFT'

    const completed = createSeedSchedule('Seed: completed schedule', buildItems('8', 'BSIT-4B', 'Prof. Hazel Garcia', 'Room 308'))
    completed.status = 'COMPLETED'
    completed.finalizedAt = nowIso()

    const withModification = createSeedSchedule(
      'Seed: modification requested',
      buildItems('7', 'BSIT-3B', 'Prof. Nina Torres', 'Room 307'),
    )
    withModification.status = 'REJECTED_BY_ADMIN'
    this.submitForApproval(withModification.id, 'registrar-1', 'Seed: mod request setup')
    this.approveSchedule({ scheduleId: withModification.id, reviewerId: 'admin-1', comment: 'Seed approved', tags: ['seed'] })
    this.createModificationRequest({
      scheduleId: withModification.id,
      requesterRole: 'DEPARTMENT',
      requesterId: DEFAULT_DEPARTMENT_CODE,
      reason: 'Adjust room due to maintenance',
      proposedChange: 'Move Tuesday block to Room 210',
    })

    this.createSchedule(
      {
        term: '1st Semester AY 2026-2027',
        department: DEFAULT_DEPARTMENT_CODE,
        registrarNotes: 'Initial publishing batch',
        items: [
          {
            id: createId('item'),
            subjectCode: 'CC101',
            title: 'Introduction to Computing',
            section: 'BSIT-1A',
            faculty: 'Prof. Maria Dela Cruz',
            department: DEFAULT_DEPARTMENT_CODE,
            room: 'Room 301',
            day: 'Monday',
            startTime: '08:00',
            endTime: '09:30',
            deliveryMode: 'Face-to-Face',
            capacity: 40,
          },
          {
            id: createId('item'),
            subjectCode: 'CC201',
            title: 'Data Structures',
            section: 'BSIT-2A',
            faculty: 'Prof. John Santos',
            department: DEFAULT_DEPARTMENT_CODE,
            room: 'Computer Lab 2',
            day: 'Tuesday',
            startTime: '10:00',
            endTime: '11:30',
            deliveryMode: 'Face-to-Face',
            capacity: 35,
          },
        ],
      },
      'registrar-1',
      true,
    )

    const conflictItems: ScheduleItem[] = [
      {
        id: createId('item'),
        subjectCode: 'CC301',
        title: 'Operating Systems',
        section: 'BSIT-3A',
        faculty: 'Prof. Angela Reyes',
        department: DEFAULT_DEPARTMENT_CODE,
        room: 'Room 305',
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:30',
        deliveryMode: 'Face-to-Face',
        capacity: 40,
      },
      {
        id: createId('item'),
        subjectCode: 'CC302',
        title: 'Computer Networks',
        section: 'BSIT-3B',
        faculty: 'Prof. Angela Reyes',
        department: DEFAULT_DEPARTMENT_CODE,
        room: 'Room 305',
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '11:30',
        deliveryMode: 'Hybrid',
        capacity: 40,
      },
    ]

    this.createSchedule(
      {
        term: '1st Semester AY 2026-2027',
        department: DEFAULT_DEPARTMENT_CODE,
        registrarNotes: 'Detected overlap for admin review',
        items: conflictItems,
      },
      'registrar-1',
      false,
    )
  }

  listSchedules(): Schedule[] {
    return this.schedules.map((schedule) => ({ ...schedule }))
  }

  listPendingApprovals(): Schedule[] {
    return this.schedules.filter((schedule) => ['SUBMITTED_FOR_APPROVAL', 'UNDER_ADMIN_REVIEW'].includes(schedule.status))
  }

  listSchedulesByStatus(statuses: ScheduleStatus[]): Schedule[] {
    return this.schedules.filter((schedule) => statuses.includes(schedule.status))
  }

  listApprovedByDepartment(department: string): Schedule[] {
    return this.schedules.filter((schedule) => schedule.department === department && ['APPROVED', 'FINALIZED'].includes(schedule.status))
  }

  listFacultySchedules(facultyName: string): ScheduleItem[] {
    return this.schedules
      .filter((schedule) => ['APPROVED', 'FINALIZED'].includes(schedule.status))
      .flatMap((schedule) => this.getCurrentVersion(schedule).snapshot)
      .filter((item) => item.faculty === facultyName)
  }

  listStudentSchedules(): ScheduleItem[] {
    return this.schedules
      .filter((schedule) => ['APPROVED', 'FINALIZED'].includes(schedule.status))
      .flatMap((schedule) => this.getCurrentVersion(schedule).snapshot)
      .map((item) => ({ ...item, section: 'BSIT-3D' }))
  }

  listConflicts(scheduleId?: string): ConflictRecord[] {
    if (!scheduleId) return [...this.conflicts]
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return []
    const versionId = this.getCurrentVersion(schedule).id
    return this.conflicts.filter((conflict) => conflict.scheduleVersionId === versionId)
  }

  listModificationRequests(scope?: { requesterRole?: 'DEPARTMENT' | 'FACULTY' }): ModificationRequest[] {
    if (!scope?.requesterRole) return [...this.modificationRequests]
    return this.modificationRequests.filter((req) => req.requesterRole === scope.requesterRole)
  }

  listNotifications(role: Role): Notification[] {
    return this.notifications.filter((note) => note.recipientRole === role)
  }

  listActivityLogs(): ActivityLog[] {
    return [...this.activityLogs].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  }

  getAnalytics(): Analytics {
    const totalSchedules = this.schedules.length
    const approvedSchedules = this.schedules.filter((s) => s.status === 'APPROVED').length
    const finalizedSchedules = this.schedules.filter((s) => s.status === 'FINALIZED').length
    const pendingApprovals = this.listPendingApprovals().length
    const unresolvedConflicts = this.conflicts.filter((c) => !c.resolved).length
    const completionRate = totalSchedules ? ((approvedSchedules + finalizedSchedules) / totalSchedules) * 100 : 0

    const approvalDurations = this.schedules
      .filter((schedule) => schedule.submittedAt && schedule.approvedAt)
      .map((schedule) => {
        const submitted = new Date(schedule.submittedAt as string).getTime()
        const approved = new Date(schedule.approvedAt as string).getTime()
        return (approved - submitted) / (1000 * 60 * 60)
      })

    const avgApprovalHours = approvalDurations.length
      ? approvalDurations.reduce((sum, value) => sum + value, 0) / approvalDurations.length
      : 0

    const conflictFrequency = totalSchedules ? (this.conflicts.length / totalSchedules) * 100 : 0

    return {
      totalSchedules,
      approvedSchedules,
      finalizedSchedules,
      pendingApprovals,
      unresolvedConflicts,
      avgApprovalHours,
      completionRate,
      conflictFrequency,
    }
  }

  createSchedule(input: CreateScheduleInput, actorId: string, approveImmediately = false): Schedule {
    const firstVersion: ScheduleVersion = {
      id: createId('version'),
      versionNumber: 1,
      snapshot: input.items,
      changeSummary: 'Initial schedule version',
      createdBy: actorId,
      createdAt: nowIso(),
    }

    const schedule: Schedule = {
      id: createId('sched'),
      term: input.term,
      department: input.department,
      status: 'DRAFT',
      registrarNotes: input.registrarNotes,
      adminFeedback: '',
      adminTags: [],
      currentVersion: 1,
      versions: [firstVersion],
      createdBy: actorId,
    }

    this.schedules.unshift(schedule)
    this.audit('REGISTRAR', actorId, 'SCHEDULE', schedule.id, 'CREATE', `Created schedule in ${input.department}`)

    const detected = this.detectConflicts(schedule.id)
    if (detected.length > 0) {
      schedule.status = 'CONFLICT_DETECTED'
    }

    if (approveImmediately) {
      this.submitForApproval(schedule.id, actorId, 'Auto seeded and submitted')
      this.approveSchedule({ scheduleId: schedule.id, reviewerId: 'admin-1', comment: 'Approved', tags: ['seed'] })
    }

    return schedule
  }

  updateSchedule(scheduleId: string, items: ScheduleItem[], changeSummary: string, actorId: string): Schedule | null {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return null

    const nextVersion = schedule.currentVersion + 1
    schedule.currentVersion = nextVersion
    schedule.versions.push({
      id: createId('version'),
      versionNumber: nextVersion,
      snapshot: items,
      changeSummary,
      createdBy: actorId,
      createdAt: nowIso(),
    })

    schedule.status = 'DRAFT'
    this.resolveCurrentConflicts(schedule)
    const conflicts = this.detectConflicts(schedule.id)
    if (conflicts.length > 0) {
      schedule.status = 'CONFLICT_DETECTED'
    }

    this.audit('REGISTRAR', actorId, 'SCHEDULE', schedule.id, 'UPDATE_VERSION', `Created v${nextVersion}`)
    return schedule
  }

  submitForApproval(scheduleId: string, actorId: string, notes: string): Schedule | null {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return null
    if (!['CONFLICT_DETECTED', 'REJECTED_BY_ADMIN'].includes(schedule.status)) return null

    schedule.registrarNotes = notes
    schedule.status = 'SUBMITTED_FOR_APPROVAL'
    schedule.submittedAt = nowIso()

    this.notify('ADMIN', 'admin-1', 'SCHEDULE_SUBMITTED', `Schedule ${schedule.id} submitted for approval.`)
    this.audit('REGISTRAR', actorId, 'SCHEDULE', schedule.id, 'SUBMIT_FOR_APPROVAL', notes)
    return schedule
  }

  moveToAdminReview(scheduleId: string, actorId: string): Schedule | null {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return null
    schedule.status = 'UNDER_ADMIN_REVIEW'
    this.audit('ADMIN', actorId, 'SCHEDULE', schedule.id, 'START_REVIEW', 'Admin review started')
    return schedule
  }

  approveSchedule(input: DecisionInput): Schedule | null {
    const schedule = this.findSchedule(input.scheduleId)
    if (!schedule) return null

    schedule.status = 'APPROVED'
    schedule.adminFeedback = input.comment
    schedule.adminTags = input.tags
    schedule.approvedAt = nowIso()

    this.approvals.unshift({
      id: createId('approve'),
      scheduleId: schedule.id,
      reviewerId: input.reviewerId,
      decision: 'APPROVED',
      comment: input.comment,
      tags: input.tags,
      createdAt: nowIso(),
    })

    this.notify('REGISTRAR', schedule.createdBy, 'SCHEDULE_APPROVED', `Schedule ${schedule.id} has been approved.`)
    this.notify('DEPARTMENT', schedule.department, 'NEW_APPROVED_SCHEDULE', `New approved schedule ${schedule.id} is available.`)
    this.notify('FACULTY', 'faculty-1', 'SCHEDULE_UPDATED', `Approved schedule ${schedule.id} affected faculty load.`)
    this.notify('STUDENT', 'all', 'SCHEDULE_UPDATED', `Schedule updates are now available for viewing.`)

    this.resolveCurrentConflicts(schedule)
    this.audit('ADMIN', input.reviewerId, 'APPROVAL', schedule.id, 'APPROVE', input.comment)
    return schedule
  }

  addAdminFeedback(scheduleId: string, reviewerId: string, comment: string): Schedule | null {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return null
    if (!comment.trim()) return null

    schedule.adminFeedback = comment
    if (schedule.status === 'SUBMITTED_FOR_APPROVAL') {
      schedule.status = 'UNDER_ADMIN_REVIEW'
    }

    this.notify('REGISTRAR', schedule.createdBy, 'ADMIN_FEEDBACK', `Feedback on ${schedule.id}: ${comment}`)
    this.audit('ADMIN', reviewerId, 'SCHEDULE', schedule.id, 'ADD_FEEDBACK', comment)
    return schedule
  }

  rejectSchedule(input: DecisionInput): Schedule | null {
    const schedule = this.findSchedule(input.scheduleId)
    if (!schedule) return null
    if (!input.comment.trim()) return null

    schedule.status = 'REJECTED_BY_ADMIN'
    schedule.adminFeedback = input.comment
    schedule.adminTags = input.tags

    this.approvals.unshift({
      id: createId('approve'),
      scheduleId: schedule.id,
      reviewerId: input.reviewerId,
      decision: 'REJECTED',
      comment: input.comment,
      tags: input.tags,
      createdAt: nowIso(),
    })

    this.notify('REGISTRAR', schedule.createdBy, 'SCHEDULE_REJECTED', `Schedule ${schedule.id} rejected: ${input.comment}`)
    this.audit('ADMIN', input.reviewerId, 'APPROVAL', schedule.id, 'REJECT', input.comment)
    return schedule
  }

  finalizeSchedule(scheduleId: string, actorId: string): Schedule | null {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return null
    if (schedule.status !== 'APPROVED') return null

    schedule.status = 'FINALIZED'
    schedule.finalizedAt = nowIso()
    this.notify('STUDENT', 'all', 'SCHEDULE_FINALIZED', `Schedule ${schedule.id} finalized.`)
    this.audit('ADMIN', actorId, 'SCHEDULE', schedule.id, 'FINALIZE', 'Schedule finalized')
    return schedule
  }

  createModificationRequest(input: ModificationInput): ModificationRequest | null {
    const schedule = this.findSchedule(input.scheduleId)
    if (!schedule) return null
    if (!['APPROVED', 'FINALIZED', 'MODIFICATION_REQUESTED'].includes(schedule.status)) return null

    const request: ModificationRequest = {
      id: createId('mod'),
      scheduleId: schedule.id,
      requesterRole: input.requesterRole,
      requesterId: input.requesterId,
      reason: input.reason,
      proposedChange: input.proposedChange,
      status: 'PENDING',
    }

    this.modificationRequests.unshift(request)
    schedule.status = 'MODIFICATION_REQUESTED'

    this.notify('REGISTRAR', schedule.createdBy, 'MODIFICATION_REQUESTED', `Modification requested for ${schedule.id}: ${input.reason}`)
    this.audit(input.requesterRole, input.requesterId, 'MOD_REQUEST', request.id, 'REQUEST_CHANGE', input.proposedChange)
    return request
  }

  resolveModificationRequest(requestId: string, accept: boolean, reviewerId: string): ModificationRequest | null {
    const request = this.modificationRequests.find((item) => item.id === requestId)
    if (!request) return null

    request.status = accept ? 'ACCEPTED' : 'REJECTED'
    request.reviewedBy = reviewerId
    request.reviewedAt = nowIso()

    const schedule = this.findSchedule(request.scheduleId)
    if (schedule) {
      if (accept) {
        schedule.status = 'DRAFT'
      } else if (schedule.status === 'MODIFICATION_REQUESTED') {
        schedule.status = 'APPROVED'
      }
    }

    this.audit('REGISTRAR', reviewerId, 'MOD_REQUEST', request.id, 'RESOLVE_REQUEST', request.status)
    return request
  }

  compareVersions(scheduleId: string, fromVersion: number, toVersion: number): string[] {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return []

    const from = schedule.versions.find((version) => version.versionNumber === fromVersion)
    const to = schedule.versions.find((version) => version.versionNumber === toVersion)
    if (!from || !to) return []

    const normalize = (item: ScheduleItem): string =>
      [item.subjectCode, item.section, item.faculty, item.room, item.day, item.startTime, item.endTime].join('|')

    const fromSet = new Set(from.snapshot.map(normalize))
    const toSet = new Set(to.snapshot.map(normalize))

    const added = Array.from(toSet).filter((entry) => !fromSet.has(entry)).map((entry) => `Added: ${entry}`)
    const removed = Array.from(fromSet).filter((entry) => !toSet.has(entry)).map((entry) => `Removed: ${entry}`)

    return [...added, ...removed]
  }

  buildSmartSuggestions(scheduleId: string): string[] {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return []

    const items = this.getCurrentVersion(schedule).snapshot
    const roomUsage = new Map<string, number>()

    items.forEach((item) => {
      const key = `${item.room}:${item.day}`
      roomUsage.set(key, (roomUsage.get(key) ?? 0) + 1)
    })

    return this.listConflicts(scheduleId).map((conflict) => {
      if (conflict.type === 'ROOM_OVERLAP') {
        const available = roomUsage.get('Room 204:Wednesday') ? 'Room 302' : 'Room 204'
        return `Conflict ${conflict.id}: move one class to ${available}.`
      }
      if (conflict.type === 'FACULTY_OVERLAP') {
        return `Conflict ${conflict.id}: reassign one block to an available instructor.`
      }
      return `Conflict ${conflict.id}: move section to a non-overlapping slot.`
    })
  }

  exportRows(): ScheduleExportRow[] {
    return this.schedules.flatMap((schedule) => {
      const current = this.getCurrentVersion(schedule)
      return current.snapshot.map((item) => ({
        scheduleId: schedule.id,
        version: current.versionNumber,
        term: schedule.term,
        department: schedule.department,
        subjectCode: item.subjectCode,
        title: item.title,
        section: item.section,
        faculty: item.faculty,
        room: item.room,
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        status: schedule.status,
      }))
    })
  }

  exportCsv(): string {
    const headers = [
      'scheduleId',
      'version',
      'term',
      'department',
      'subjectCode',
      'title',
      'section',
      'faculty',
      'room',
      'day',
      'startTime',
      'endTime',
      'status',
    ]

    const rows = this.exportRows().map((row) =>
      [
        row.scheduleId,
        String(row.version),
        row.term,
        row.department,
        row.subjectCode,
        row.title,
        row.section,
        row.faculty,
        row.room,
        row.day,
        row.startTime,
        row.endTime,
        statusLabel[row.status],
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    )

    return [headers.join(','), ...rows].join('\n')
  }

  importCsv(content: string, actorId: string): CsvImportSummary {
    const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    if (lines.length <= 1) {
      return { imported: 0, rejected: 0, rejectedLines: [] }
    }

    const rejectedLines: number[] = []
    let imported = 0

    for (let index = 1; index < lines.length; index += 1) {
      const columns = lines[index].split(',').map((col) => col.replace(/^"|"$/g, '').trim())
      if (columns.length < 13) {
        rejectedLines.push(index + 1)
        continue
      }

      const [, , term, department, subjectCode, title, section, faculty, room, day, startTime, endTime] = columns
      if (!term || !department || !subjectCode || !section || !faculty || !room || !day || !startTime || !endTime) {
        rejectedLines.push(index + 1)
        continue
      }

      this.createSchedule(
        {
          term,
          department,
          registrarNotes: 'Imported from CSV',
          items: [
            {
              id: createId('item'),
              subjectCode,
              title,
              section,
              faculty,
              department,
              room,
              day,
              startTime,
              endTime,
              deliveryMode: 'Face-to-Face',
              capacity: 40,
            },
          ],
        },
        actorId,
      )
      imported += 1
    }

    this.audit('REGISTRAR', actorId, 'SCHEDULE', 'bulk', 'CSV_IMPORT', `Imported ${imported} rows`)
    return {
      imported,
      rejected: rejectedLines.length,
      rejectedLines,
    }
  }

  private detectConflicts(scheduleId: string): ConflictRecord[] {
    const schedule = this.findSchedule(scheduleId)
    if (!schedule) return []

    const version = this.getCurrentVersion(schedule)
    const items = version.snapshot
    const found: ConflictRecord[] = []

    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i]
        const b = items[j]
        if (a.day !== b.day) continue
        if (!hasOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) continue

        const pushConflict = (type: ConflictType, details: string, severity: 'LOW' | 'MEDIUM' | 'HIGH'): void => {
          found.push({
            id: createId('conflict'),
            scheduleVersionId: version.id,
            type,
            severity,
            details,
            resolved: false,
          })
        }

        if (a.room === b.room) {
          pushConflict('ROOM_OVERLAP', `${a.subjectCode}/${b.subjectCode} overlap in ${a.room}.`, 'HIGH')
        }
        if (a.faculty === b.faculty) {
          pushConflict('FACULTY_OVERLAP', `${a.faculty} assigned to overlapping blocks.`, 'HIGH')
        }
        if (a.section === b.section) {
          pushConflict('SECTION_OVERLAP', `${a.section} has overlapping blocks.`, 'MEDIUM')
        }
      }
    }

    this.conflicts = [...this.conflicts.filter((item) => item.scheduleVersionId !== version.id), ...found]
    return found
  }

  private resolveCurrentConflicts(schedule: Schedule): void {
    const currentVersionId = this.getCurrentVersion(schedule).id
    this.conflicts = this.conflicts.map((conflict) =>
      conflict.scheduleVersionId === currentVersionId ? { ...conflict, resolved: true } : conflict,
    )
  }

  private findSchedule(scheduleId: string): Schedule | undefined {
    return this.schedules.find((schedule) => schedule.id === scheduleId)
  }

  private getCurrentVersion(schedule: Schedule): ScheduleVersion {
    return schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
  }

  private notify(recipientRole: Role, recipientId: string, type: string, message: string): void {
    this.notifications.unshift({
      id: createId('note'),
      recipientRole,
      recipientId,
      type,
      message,
      createdAt: nowIso(),
    })
  }

  private audit(
    actorRole: Role,
    actorId: string,
    entityType: 'SCHEDULE' | 'MOD_REQUEST' | 'APPROVAL',
    entityId: string,
    action: string,
    metadata: string,
  ): void {
    this.activityLogs.unshift({
      id: createId('log'),
      actorRole,
      actorId,
      entityType,
      entityId,
      action,
      metadata,
      createdAt: nowIso(),
    })
  }
}

export const schedulingService = new SchedulingService()

export const formatDateTime = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const statusToBadgeClass = (status: ScheduleStatus): string => {
  if (status === 'APPROVED' || status === 'FINALIZED') return 'is-active'
  if (status === 'REJECTED_BY_ADMIN') return 'is-inactive'
  return 'is-warning'
}

export const statusToLabel = (status: ScheduleStatus): string => statusLabel[status]
