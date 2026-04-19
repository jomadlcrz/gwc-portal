export const ROUTES = {
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',

  // Registrar staff routes
  REGISTRAR_STAFF: '/registrar-staff',
  REGISTRAR_STAFF_DASHBOARD: '/registrar-staff/dashboard',
  REGISTRAR_STAFF_STUDENT_RECORDS: '/registrar-staff/student-records',
  REGISTRAR_STAFF_ENROLLMENTS: '/registrar-staff/enrollments',
  REGISTRAR_STAFF_REQUESTS: '/registrar-staff/requests',
  REGISTRAR_STAFF_SCHEDULE: '/registrar-staff/schedule',
  REGISTRAR_STAFF_SETTINGS: '/registrar-staff/settings',
  SEARCH: '/search',

  // Admin routes
  ADMINISTRATORS: '/administrators/dashboard',
  ADMINISTRATORS_DIRECTORY: '/administrators/administrators',
  ADMINISTRATORS_FACULTY: '/administrators/faculty',
  ADMINISTRATORS_STUDENTS: '/administrators/students',
  ADMINISTRATORS_STUDENTS_MANAGE: '/administrators/students/manage',
  ADMINISTRATORS_STUDENTS_CREATE: '/administrators/students/create',
  ADMINISTRATORS_STUDENTS_BULK: '/administrators/students/bulk',
  ADMINISTRATORS_DEPARTMENTS: '/administrators/departments',
  ADMINISTRATORS_REPORTS: '/administrators/reports',
  ADMINISTRATORS_SETTINGS: '/administrators/settings',

  // Login routes
  ADMINISTRATORS_LOGIN: '/administrators/login',
  REGISTRAR_STAFF_LOGIN: '/registrar-staff/login',
  FACULTY_LOGIN: '/faculty-portal/login',
  STUDENT_LOGIN: '/student-portal/login',
  
} as const

