export const ROUTES = {

  // Public routes
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',
  SEARCH: '/search',
  POSTS_BASE: '/post',
  POST_LISTS: '/post/lists',
  ABOUT_GWC: '/about-gwc',
  ABOUT_GWC_HISTORY: '/about-gwc/gwc-history',
  ABOUT_GWC_FAQS: '/about-gwc/faqs',

  // 404 route
  NOT_FOUND: '/404',

  // Registrar staff routes
  REGISTRAR_STAFF_LOGIN: '/registrar-staff/login',
  REGISTRAR_STAFF: '/registrar-staff',
  REGISTRAR_STAFF_DASHBOARD: '/registrar-staff/dashboard',
  REGISTRAR_STAFF_STUDENT_RECORDS: '/registrar-staff/student-records',
  REGISTRAR_STAFF_ENROLLMENTS: '/registrar-staff/enrollments',
  REGISTRAR_STAFF_REQUESTS: '/registrar-staff/requests',
  REGISTRAR_STAFF_SCHEDULE: '/registrar-staff/schedule',
  REGISTRAR_STAFF_SCHEDULE_MANAGE: '/registrar-staff/schedule/manage',
  REGISTRAR_STAFF_SCHEDULE_CREATE: '/registrar-staff/schedule/create',
  REGISTRAR_STAFF_SETTINGS: '/registrar-staff/settings',

  // Admin routes
  ADMINISTRATORS_LOGIN: '/administrators/login',
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
  ADMINISTRATORS_TESTIMONIALS: '/administrators/testimonials',
  ADMINISTRATORS_TESTIMONIALS_CREATE: '/administrators/testimonials/create',
  ADMINISTRATORS_DEPARTMENTS: '/administrators/departments',
  ADMINISTRATORS_REPORTS: '/administrators/reports',
  ADMINISTRATORS_SYSTEM_LOGS: '/administrators/system-logs',
  ADMINISTRATORS_SETTINGS: '/administrators/settings',

  // Faculty routes
  FACULTY_LOGIN: '/faculty-portal/login',
  FACULTY_PORTAL: '/faculty-portal',
  FACULTY_DASHBOARD: '/faculty-portal/dashboard',
  FACULTY_CLASSES: '/faculty-portal/classes',
  FACULTY_GRADEBOOK: '/faculty-portal/gradebook',
  FACULTY_SETTINGS: '/faculty-portal/settings',

  // Student routes
  STUDENT_LOGIN: '/student-portal/login',
  STUDENT_PORTAL: '/student-portal',
  STUDENT_DASHBOARD: '/student-portal/dashboard',
  STUDENT_SUBJECTS: '/student-portal/subjects',
  STUDENT_GRADES: '/student-portal/grades',
  STUDENT_SCHEDULE: '/student-portal/schedule',
  STUDENT_SETTINGS: '/student-portal/settings',

  // Department routes
  DEPARTMENT_LOGIN: '/department-portal/login',
  DEPARTMENT_PORTAL: '/department-portal',
  DEPARTMENT_DASHBOARD: '/department-portal/dashboard',
  DEPARTMENT_SCHEDULE: '/department-portal/schedule',

  // SPA route
  CHANGE_PASSWORD: '/change-password',

  // forgot password route
  FORGOT_PASSWORD: '/forgot-password',

  // HR routes
  HR_LOGIN: '/hr-portal/login',
  HR_PORTAL: '/hr-portal',
  HR_DASHBOARD: '/hr-portal/dashboard',
  HR_FACULTY: '/hr-portal/faculty',
  HR_SETTINGS: '/hr-portal/settings',
  
} as const

export function getPostListsRoute(categorySlug: string): string {
  return `${ROUTES.POST_LISTS}/${encodeURIComponent(categorySlug)}`
}




