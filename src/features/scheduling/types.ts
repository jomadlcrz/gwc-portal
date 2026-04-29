export type Role = 'REGISTRAR' | 'ADMIN' | 'DEPARTMENT' | 'FACULTY' | 'STUDENT' | 'SYSTEM'

export type ScheduleStatus =
  | 'DRAFT'
  | 'CONFLICT_DETECTED'
  | 'SUBMITTED_FOR_APPROVAL'
  | 'UNDER_ADMIN_REVIEW'
  | 'REJECTED_BY_ADMIN'
  | 'APPROVED'
  | 'MODIFICATION_REQUESTED'
  | 'FINALIZED'
  | 'COMPLETED'

export type ConflictType = 'ROOM_OVERLAP' | 'FACULTY_OVERLAP' | 'SECTION_OVERLAP'

export type ConflictRecord = {
  id: string
  scheduleVersionId: string
  type: ConflictType
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  details: string
  resolved: boolean
}

export type ScheduleItem = {
  id: string
  subjectCode: string
  descriptiveTitle: string
  section: string
  faculty: string
  department: string
  room: string
  day: string
  startTime: string
  endTime: string
  deliveryMode: 'Face-to-Face' | 'Online' | 'Hybrid'
  capacity: number
}

export type ScheduleVersion = {
  id: string
  versionNumber: number
  snapshot: ScheduleItem[]
  changeSummary: string
  createdBy: string
  createdAt: string
}

export type Schedule = {
  id: string
  term: string
  department: string
  status: ScheduleStatus
  registrarNotes: string
  adminFeedback: string
  adminTags: string[]
  currentVersion: number
  versions: ScheduleVersion[]
  createdBy: string
  submittedAt?: string
  approvedAt?: string
  finalizedAt?: string
}

export type ApprovalRecord = {
  id: string
  scheduleId: string
  reviewerId: string
  decision: 'APPROVED' | 'REJECTED'
  comment: string
  tags: string[]
  createdAt: string
}

export type ModificationRequest = {
  id: string
  scheduleId: string
  requesterRole: 'DEPARTMENT' | 'FACULTY'
  requesterId: string
  reason: string
  proposedChange: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  reviewedBy?: string
  reviewedAt?: string
}

export type Notification = {
  id: string
  recipientRole: Role
  recipientId: string
  type: string
  message: string
  createdAt: string
  readAt?: string
}

export type ActivityLog = {
  id: string
  actorRole: Role
  actorId: string
  entityType: 'SCHEDULE' | 'MOD_REQUEST' | 'APPROVAL'
  entityId: string
  action: string
  metadata: string
  createdAt: string
}

export type Analytics = {
  totalSchedules: number
  approvedSchedules: number
  finalizedSchedules: number
  pendingApprovals: number
  unresolvedConflicts: number
  avgApprovalHours: number
  completionRate: number
  conflictFrequency: number
}

export type ScheduleExportRow = {
  scheduleId: string
  version: number
  term: string
  department: string
  subjectCode: string
  descriptiveTitle: string
  section: string
  faculty: string
  room: string
  day: string
  startTime: string
  endTime: string
  status: ScheduleStatus
}
