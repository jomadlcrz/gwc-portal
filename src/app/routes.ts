export const ROUTES = {
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',
  POSTS_BASE: '/post',
  POST_LISTS: '/post/lists',

  // Registrar staff routes
  REGISTRAR_STAFF: '/registrar-staff',
  REGISTRAR_STAFF_DASHBOARD: '/registrar-staff/dashboard',
  REGISTRAR_STAFF_STUDENT_RECORDS: '/registrar-staff/student-records',
  REGISTRAR_STAFF_ENROLLMENTS: '/registrar-staff/enrollments',
  REGISTRAR_STAFF_REQUESTS: '/registrar-staff/requests',
  REGISTRAR_STAFF_SCHEDULE: '/registrar-staff/schedule',
  REGISTRAR_STAFF_SCHEDULE_MANAGE: '/registrar-staff/schedule/manage',
  REGISTRAR_STAFF_SCHEDULE_CREATE: '/registrar-staff/schedule/create',
  REGISTRAR_STAFF_SETTINGS: '/registrar-staff/settings',
  SEARCH: '/search',

  // Admin routes
  ADMINISTRATORS: '/administrators/dashboard',
  ADMINISTRATORS_DIRECTORY: '/administrators/administrators',
  ADMINISTRATORS_REGISTRAR_STAFF: '/administrators/registrar-staff',
  ADMINISTRATORS_FACULTY: '/administrators/faculty',
  ADMINISTRATORS_STUDENTS: '/administrators/students',
  ADMINISTRATORS_STUDENTS_MANAGE: '/administrators/students/manage',
  ADMINISTRATORS_STUDENTS_CREATE: '/administrators/students/create',
  ADMINISTRATORS_STUDENTS_BULK: '/administrators/students/bulk',
  ADMINISTRATORS_POSTS: '/administrators/posts',
  ADMINISTRATORS_POSTS_CREATE: '/administrators/posts/create',
  ADMINISTRATORS_DEPARTMENTS: '/administrators/departments',
  ADMINISTRATORS_REPORTS: '/administrators/reports',
  ADMINISTRATORS_SETTINGS: '/administrators/settings',

  // Login routes
  ADMINISTRATORS_LOGIN: '/administrators/login',
  REGISTRAR_STAFF_LOGIN: '/registrar-staff/login',
  FACULTY_LOGIN: '/faculty-portal/login',
  FACULTY_PORTAL: '/faculty-portal',
  FACULTY_DASHBOARD: '/faculty-portal/dashboard',
  FACULTY_CLASSES: '/faculty-portal/classes',
  FACULTY_GRADEBOOK: '/faculty-portal/gradebook',
  FACULTY_SETTINGS: '/faculty-portal/settings',
  STUDENT_LOGIN: '/student-portal/login',
  STUDENT_PORTAL: '/student-portal',
  STUDENT_DASHBOARD: '/student-portal/dashboard',
  STUDENT_SUBJECTS: '/student-portal/subjects',
  STUDENT_GRADES: '/student-portal/grades',
  STUDENT_SCHEDULE: '/student-portal/schedule',
  STUDENT_SETTINGS: '/student-portal/settings',
  CHANGE_PASSWORD: '/change-password',
  
} as const

export function getPostListsRoute(categorySlug: string): string {
  return `${ROUTES.POST_LISTS}/${encodeURIComponent(categorySlug)}`
}



