import type { ScheduleItem } from '../features/scheduling/types'

export type StudentScheduleSource = {
  studentId: string
  status: 'Regular' | 'Irregular'
  rows: ScheduleItem[]
}

const REGULAR_ROWS: ScheduleItem[] = [
  { id: '3y2s-1', subjectCode: 'LIT2', descriptiveTitle: 'Literatures of the World', section: 'BSIT-3D', faculty: 'Caburao', department: 'CITE', room: 'Room 304', day: 'Monday', startTime: '09:00', endTime: '10:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-2', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Monday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-3', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Monday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-4', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Monday', startTime: '16:30', endTime: '18:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-5', subjectCode: 'IT312', descriptiveTitle: 'Computer Accounting (with SAP)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: 'Room 305', day: 'Tuesday', startTime: '10:30', endTime: '11:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-6', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Tuesday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-7', subjectCode: 'LIT2', descriptiveTitle: 'Literatures of the World', section: 'BSIT-3D', faculty: 'Caburao', department: 'CITE', room: 'Room 304', day: 'Wednesday', startTime: '09:00', endTime: '10:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-8', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Wednesday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-9', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Wednesday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-10', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Wednesday', startTime: '16:30', endTime: '18:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-11', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Thursday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-12', subjectCode: 'CAPS101', descriptiveTitle: 'Capstone Project and Research 1', section: 'BSIT-3D', faculty: 'Mr. Willmher John Regaspi', department: 'CITE', room: 'Room 306', day: 'Thursday', startTime: '13:00', endTime: '16:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-13', subjectCode: 'LIT2', descriptiveTitle: 'Literatures of the World', section: 'BSIT-3D', faculty: 'Caburao', department: 'CITE', room: 'Room 304', day: 'Friday', startTime: '09:00', endTime: '10:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-14', subjectCode: 'IT312', descriptiveTitle: 'Computer Accounting (with SAP)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: 'Room 305', day: 'Friday', startTime: '10:30', endTime: '11:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-15', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Friday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-16', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Friday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-17', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Friday', startTime: '16:30', endTime: '18:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-18', subjectCode: 'IT312', descriptiveTitle: 'Computer Accounting (with SAP)', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: 'Room 305', day: 'Saturday', startTime: '10:30', endTime: '11:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: '3y2s-19', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Saturday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
]

const IRREGULAR_ROWS: ScheduleItem[] = [
  { id: 'irr-1a', subjectCode: 'MS102', descriptiveTitle: 'Quantitative Methods (incl. Modeling & Simulation)', section: 'BSIT-2F', faculty: 'Ms. Luilyn Raguindin', department: 'CITE', room: 'SHS-304', day: 'Tuesday', startTime: '10:00', endTime: '11:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-1b', subjectCode: 'MS102', descriptiveTitle: 'Quantitative Methods (incl. Modeling & Simulation)', section: 'BSIT-2F', faculty: 'Ms. Luilyn Raguindin', department: 'CITE', room: 'SHS-304', day: 'Thursday', startTime: '10:00', endTime: '11:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-2a', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Monday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-2b', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Wednesday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-2c', subjectCode: 'PT102', descriptiveTitle: "Platform-based Dev't (Multimedia Systems)", section: 'BSIT-3D', faculty: 'Mr. John Vianney Manuel', department: 'CITE', room: '402/CL1', day: 'Friday', startTime: '12:00', endTime: '13:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-3a', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Tuesday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-3b', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Thursday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-3c', subjectCode: 'PT103', descriptiveTitle: 'Platform-based Development (Android Programming)', section: 'BSIT-3D', faculty: 'Mr. Paulo Balgua', department: 'CITE', room: '303/CL2', day: 'Saturday', startTime: '12:00', endTime: '14:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-4a', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Monday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-4b', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Wednesday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-4c', subjectCode: 'SE101', descriptiveTitle: 'Software Engineering 1', section: 'BSIT-3D', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '303/CL2', day: 'Friday', startTime: '15:00', endTime: '16:30', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-5a', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3A', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Tuesday', startTime: '14:00', endTime: '16:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-5b', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3A', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Thursday', startTime: '14:00', endTime: '16:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-5c', subjectCode: 'ITELEC2', descriptiveTitle: 'IT Major Elective 2 (Data Warehousing)', section: 'BSIT-3A', faculty: 'Ms. Joyce Raon', department: 'CITE', room: '403/CL2', day: 'Saturday', startTime: '14:00', endTime: '16:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-6', subjectCode: 'GE ELECTIVE 4', descriptiveTitle: 'Philippine Popular Culture', section: 'BSBA-3B', faculty: 'Bryan Necessito', department: 'CITE', room: '404/403', day: 'Wednesday', startTime: '09:00', endTime: '10:00', deliveryMode: 'Face-to-Face', capacity: 40 },
  { id: 'irr-7a', subjectCode: 'PATHFIT 4', descriptiveTitle: 'Group Exercise - Aerobics', section: 'BSIT-2D', faculty: 'Dether Domaoal', department: 'CITE', room: 'SHS-502', day: 'Tuesday', startTime: '11:00', endTime: '12:00', deliveryMode: 'Face-to-Face', capacity: 35 },
  { id: 'irr-7b', subjectCode: 'PATHFIT 4', descriptiveTitle: 'Group Exercise - Aerobics', section: 'BSIT-2D', faculty: 'Dether Domaoal', department: 'CITE', room: 'SHS-502', day: 'Thursday', startTime: '11:00', endTime: '12:00', deliveryMode: 'Face-to-Face', capacity: 35 },
]

const STUDENT_SCHEDULE_SOURCES: StudentScheduleSource[] = [
  { studentId: 'student-regular-1', status: 'Regular', rows: REGULAR_ROWS },
  { studentId: 'student-irregular-1', status: 'Irregular', rows: IRREGULAR_ROWS },
]

export function resolveStudentScheduleRows(studentId: string, status: 'Regular' | 'Irregular'): ScheduleItem[] {
  return (
    STUDENT_SCHEDULE_SOURCES.find((source) => source.studentId === studentId && source.status === status)?.rows.map((row) => ({ ...row })) ??
    []
  )
}
