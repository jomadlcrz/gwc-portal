export const ROUTES = {
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',
  SEARCH: '/search',

  // Admin routes
  ADMINISTRATORS: '/administrators/dashboard',
  ADMINISTRATORS_DIRECTORY: '/administrators/administrators',
  ADMINISTRATORS_FACULTY: '/administrators/faculty',
  ADMINISTRATORS_STUDENTS: '/administrators/students',
  ADMINISTRATORS_STUDENTS_MANAGE: '/administrators/students/manage',
  ADMINISTRATORS_STUDENTS_CREATE: '/administrators/students/create',
  ADMINISTRATORS_STUDENTS_BULK: '/administrators/students/bulk',
  ADMINISTRATORS_ENROLLMENTS: '/administrators/enrollments',
  ADMINISTRATORS_DEPARTMENTS: '/administrators/departments',
  ADMINISTRATORS_REPORTS: '/administrators/reports',
  ADMINISTRATORS_SETTINGS: '/administrators/settings',

  // Login routes
  ADMINISTRATORS_LOGIN: '/administrators/login',
  FACULTY_LOGIN: '/faculty-portal/login',
  STUDENT_LOGIN: '/student-portal/login',
  
} as const
