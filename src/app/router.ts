import { renderannouncements_page } from '../pages/announcements/announcements_page'
import { renderpost_lists_page } from '../pages/post/post_lists_page'
import {
  renderadministrators_dashboard_page,
  renderadministrators_directory_page,
  renderregistrar_staff_admin_page,
  renderdepartments_page,
  renderfaculty_page,
  renderreports_page,
  rendersettings_page,
  renderstudents_bulk_page,
  renderstudents_create_page,
  renderstudents_manage_page,
  setupstudents_manage_page,
  setupadministrators_directory_page,
  renderstudents_page,
  setupadministrators_page,
} from '../pages/administrators/administrators_page'
import { setupSiteInteractions } from '../components/layout/interactions'
import { renderhome_page } from '../pages/home/home_page'
import { renderadministrators_login_page } from '../pages/login/administrators_login_page'
import { renderchange_password_page } from '../pages/login/change_password_page'
import { renderfaculty_login_page } from '../pages/login/faculty_login_page'
import {
  renderfaculty_classes_page,
  renderfaculty_dashboard_page,
  renderfaculty_gradebook_page,
  renderfaculty_settings_page,
  setupfaculty_page,
} from '../pages/faculty/faculty_page'
import { renderregistrar_staff_login_page } from '../pages/login/registrar_staff_login_page'
import { renderstudent_login_page } from '../pages/login/student_login_page'
import {
  renderstudent_dashboard_page,
  renderstudent_grades_page,
  renderstudent_schedule_page,
  renderstudent_settings_page,
  renderstudent_subjects_page,
  setupstudent_page,
} from '../pages/student/student_page'
import { rendernot_found_page } from '../pages/not-found/not_found_page'
import {
  renderregistrar_staff_dashboard_page,
  renderregistrar_staff_enrollments_page,
  renderregistrar_staff_student_records_page,
  renderregistrar_staff_requests_page,
  renderregistrar_staff_schedule_page,
  renderregistrar_staff_schedule_manage_page,
  renderregistrar_staff_schedule_create_page,
  renderregistrar_staff_settings_page,
  setupregistrar_staff_page,
  setupregistrar_staff_schedule_page,
  setupregistrar_staff_schedule_manage_page,
  setupregistrar_staff_schedule_create_page,
} from '../pages/registrar_staff/registrar_staff_page'
import { rendersearch_page } from '../pages/search/search_page'
import { renderpost_page } from '../pages/post/post_page'
import { getPostBySlug, getPostCategoryFromSlug } from '../data/posts'
import { ROUTES } from './routes'
import { setupChangePasswordPage, setupStudentLoginPage } from '../api/student_auth'

let cleanupCurrentRoute: (() => void) | null = null

export function renderRoute(app: HTMLDivElement, pathname: string): void {
  cleanupCurrentRoute?.()
  cleanupCurrentRoute = null

  if (pathname === ROUTES.HOME) {
    app.innerHTML = renderhome_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname === ROUTES.STUDENT_LOGIN) {
    app.innerHTML = renderstudent_login_page()
    cleanupCurrentRoute = setupStudentLoginPage(app)
    return
  }

  if (pathname === ROUTES.STUDENT_PORTAL || pathname === ROUTES.STUDENT_DASHBOARD) {
    app.innerHTML = renderstudent_dashboard_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.STUDENT_SUBJECTS) {
    app.innerHTML = renderstudent_subjects_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.STUDENT_GRADES) {
    app.innerHTML = renderstudent_grades_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.STUDENT_SCHEDULE) {
    app.innerHTML = renderstudent_schedule_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.STUDENT_SETTINGS) {
    app.innerHTML = renderstudent_settings_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_LOGIN) {
    app.innerHTML = renderadministrators_login_page()
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_LOGIN) {
    app.innerHTML = renderregistrar_staff_login_page()
    return
  }

  if (pathname === ROUTES.FACULTY_LOGIN) {
    app.innerHTML = renderfaculty_login_page()
    return
  }

  if (pathname === ROUTES.CHANGE_PASSWORD) {
    app.innerHTML = renderchange_password_page()
    cleanupCurrentRoute = setupChangePasswordPage(app)
    return
  }

  if (pathname === ROUTES.FACULTY_PORTAL || pathname === ROUTES.FACULTY_DASHBOARD) {
    app.innerHTML = renderfaculty_dashboard_page()
    cleanupCurrentRoute = setupfaculty_page(app)
    return
  }

  if (pathname === ROUTES.FACULTY_CLASSES) {
    app.innerHTML = renderfaculty_classes_page()
    cleanupCurrentRoute = setupfaculty_page(app)
    return
  }

  if (pathname === ROUTES.FACULTY_GRADEBOOK) {
    app.innerHTML = renderfaculty_gradebook_page()
    cleanupCurrentRoute = setupfaculty_page(app)
    return
  }

  if (pathname === ROUTES.FACULTY_SETTINGS) {
    app.innerHTML = renderfaculty_settings_page()
    cleanupCurrentRoute = setupfaculty_page(app)
    return
  }

  if (pathname === ROUTES.ANNOUNCEMENTS) {
    app.innerHTML = renderannouncements_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname.startsWith(`${ROUTES.POST_LISTS}/`)) {
    const categorySlug = pathname.slice(`${ROUTES.POST_LISTS}/`.length)
    const category = getPostCategoryFromSlug(categorySlug)

    if (category) {
      app.innerHTML = renderpost_lists_page(category)
      cleanupCurrentRoute = setupSiteInteractions(app)
      return
    }
  }

  if (pathname === ROUTES.REGISTRAR_STAFF || pathname === ROUTES.REGISTRAR_STAFF_DASHBOARD) {
    app.innerHTML = renderregistrar_staff_dashboard_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_STUDENT_RECORDS) {
    app.innerHTML = renderregistrar_staff_student_records_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_ENROLLMENTS) {
    app.innerHTML = renderregistrar_staff_enrollments_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_REQUESTS) {
    app.innerHTML = renderregistrar_staff_requests_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SCHEDULE) {
    app.innerHTML = renderregistrar_staff_schedule_page()
    cleanupCurrentRoute = setupregistrar_staff_schedule_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE) {
    app.innerHTML = renderregistrar_staff_schedule_manage_page()
    cleanupCurrentRoute = setupregistrar_staff_schedule_manage_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SCHEDULE_CREATE) {
    app.innerHTML = renderregistrar_staff_schedule_create_page()
    cleanupCurrentRoute = setupregistrar_staff_schedule_create_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SETTINGS) {
    app.innerHTML = renderregistrar_staff_settings_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.SEARCH) {
    app.innerHTML = rendersearch_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname.startsWith(`${ROUTES.POSTS_BASE}/`)) {
    const slug = decodeURIComponent(pathname.slice(`${ROUTES.POSTS_BASE}/`.length))
    const post = getPostBySlug(slug)
    const postMarkup = renderpost_page(slug)

    if (post && postMarkup) {
      app.innerHTML = postMarkup
      cleanupCurrentRoute = setupSiteInteractions(app)
      return
    }
  }

  if (pathname === ROUTES.ADMINISTRATORS) {
    app.innerHTML = renderadministrators_dashboard_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DIRECTORY) {
    app.innerHTML = renderadministrators_directory_page()
    cleanupCurrentRoute = setupadministrators_directory_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_REGISTRAR_STAFF) {
    app.innerHTML = renderregistrar_staff_admin_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_FACULTY) {
    app.innerHTML = renderfaculty_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS) {
    app.innerHTML = renderstudents_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_MANAGE) {
    app.innerHTML = renderstudents_manage_page()
    cleanupCurrentRoute = setupstudents_manage_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_CREATE) {
    app.innerHTML = renderstudents_create_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_BULK) {
    app.innerHTML = renderstudents_bulk_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DEPARTMENTS) {
    app.innerHTML = renderdepartments_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_REPORTS) {
    app.innerHTML = renderreports_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_SETTINGS) {
    app.innerHTML = rendersettings_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  app.innerHTML = rendernot_found_page()
}




