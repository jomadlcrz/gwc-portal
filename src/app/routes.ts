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
  ADMISSION: '/admission',
  ADMISSION_REGISTRATION: '/admission/registration',
  ADMISSION_STATUS: '/admission/status',
  ADMISSION_CONTACT: '/admission/contact',

  // 404 route
  NOT_FOUND: '/404',

  // Registrar routes
  REGISTRAR_LOGIN: '/registrar/login',
  REGISTRAR: '/registrar',
  REGISTRAR_DASHBOARD: '/registrar/dashboard',
  REGISTRAR_STUDENT_RECORDS: '/registrar/student-records',
  REGISTRAR_ENROLLMENTS: '/registrar/enrollments',
  REGISTRAR_ADMISSION: '/registrar/admission',
  REGISTRAR_ADMISSION_REVIEW: '/registrar/admission/review',
  REGISTRAR_ADMISSION_DETAILS: '/registrar/admission/details',
  REGISTRAR_REQUESTS: '/registrar/requests',
  REGISTRAR_SCHEDULE: '/registrar/schedule',
  REGISTRAR_SCHEDULE_MANAGE: '/registrar/schedule/manage',
  REGISTRAR_SCHEDULE_CREATE: '/registrar/schedule/create',
  REGISTRAR_SETTINGS: '/registrar/settings',

  // Admin routes
  MANAGE: '/manage',
  ADMINISTRATOR_LOGIN: '/administrator/login',
  ADMINISTRATOR: '/administrator/dashboard',
  ADMINISTRATOR_REGISTRAR: '/administrator/registrar',
  ADMINISTRATOR_FACULTY: '/administrator/faculty',
  ADMINISTRATOR_STUDENTS: '/administrator/students',
  ADMINISTRATOR_STUDENTS_MANAGE: '/administrator/students/manage',
  ADMINISTRATOR_POSTS: '/administrator/posts',
  ADMINISTRATOR_POSTS_CREATE: '/administrator/posts/create',
  ADMINISTRATOR_TESTIMONIALS: '/administrator/testimonials',
  ADMINISTRATOR_TESTIMONIALS_CREATE: '/administrator/testimonials/create',
  ADMINISTRATOR_DEPARTMENTS: '/administrator/departments',
  ADMINISTRATOR_REPORTS: '/administrator/reports',
  ADMINISTRATOR_SETTINGS: '/administrator/settings',

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
  DEAN_LOGIN: '/dean-portal/login',
  DEAN_PORTAL: '/dean-portal',
  DEAN_DASHBOARD: '/dean-portal/dashboard',
  DEAN_SCHEDULE: '/dean-portal/schedule',

  // SPA route
  CHANGE_PASSWORD: '/change-password',

  // forgot password route
  FORGOT_PASSWORD: '/forgot-password',

  // HR routes
  HR_LOGIN: '/hr-portal/login',
  HR_PORTAL: '/hr-portal',
  HR_DASHBOARD: '/hr-portal/dashboard',
  HR_FACULTY: '/hr-portal/faculty',
  HR_FACULTY_MANAGE: '/hr-portal/faculty/manage',
  HR_FACULTY_CREATE: '/hr-portal/faculty/create',
  HR_SETTINGS: '/hr-portal/settings',
  
} as const

export function getPostListsRoute(categorySlug: string): string {
  return `${ROUTES.POST_LISTS}/${encodeURIComponent(categorySlug)}`
}







