export type StudentSchedule = {
  id: string
  schoolName: string
  collegeName: string
  campusAddress: string
  scheduleHeading: string
  schoolYear: string
  name: string
  yearLevelSection: string
  course: string
  status: 'Regular' | 'Irregular'
  semesterLabel: string
  signedBy: string
  signatoryRole: string
  irregularSetDisplay?: string
}

export const STUDENT_USERS: StudentSchedule[] = [
  {
    id: 'student-regular-1',
    schoolName: 'Golden West Colleges, Inc.',
    collegeName: 'College of Information Technology Education',
    campusAddress: 'San Jose Drive, Alaminos City, Pangasinan',
    scheduleHeading: 'Student Schedule',
    schoolYear: 'School Year 2025-2026',
    name: 'Dela Cruz, Joma Manaois',
    yearLevelSection: '3rd Year - SET D',
    course: 'BSIT',
    status: 'Regular',
    semesterLabel: 'Class Schedule for 2nd Semester',
    signedBy: 'Denzel James B. Valdez',
    signatoryRole: 'OIC DEAN, CITE Department',
  },
  {
    id: 'student-irregular-1',
    schoolName: 'Golden West Colleges, Inc.',
    collegeName: 'College of Information Technology Education',
    campusAddress: 'San Jose Drive, Alaminos City, Pangasinan',
    scheduleHeading: 'Student Schedule',
    schoolYear: 'School Year 2025-2026',
    name: 'Dela Cruz, Joma Manaois',
    yearLevelSection: '3rd Year - SET D',
    course: 'BSIT',
    status: 'Irregular',
    semesterLabel: 'Class Schedule for 2nd Semester',
    signedBy: 'Denzel James B. Valdez',
    signatoryRole: 'OIC DEAN, CITE Department',
    irregularSetDisplay: 'IT-2F / IT-3D / IT-3A',
  },
]

export const ACTIVE_STUDENT_USER_ID = 'student-irregular-1'

export const STUDENT_SCHEDULE: StudentSchedule =
  STUDENT_USERS.find((student) => student.id === ACTIVE_STUDENT_USER_ID) ??
  STUDENT_USERS[0]

export function resolveStudentScheduleById(studentId: string | null | undefined): StudentSchedule {
  if (!studentId) return STUDENT_SCHEDULE
  return STUDENT_USERS.find((student) => student.id === studentId) ?? STUDENT_SCHEDULE
}
