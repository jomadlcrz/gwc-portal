import { renderannouncements_page } from '../pages/announcements/announcements_page'
import {
  renderadministrators_dashboard_page,
  renderadministrators_directory_page,
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
import { setupsite_interactions } from '../components/site_interactions'
import { renderhome_page } from '../pages/home/home_page'
import { renderadministrators_login_page } from '../pages/login/administrators_login_page'
import { renderfaculty_login_page } from '../pages/login/faculty_login_page'
import { renderregistrar_staff_login_page } from '../pages/login/registrar_staff_login_page'
import { renderstudent_login_page } from '../pages/login/student_login_page'
import { rendernot_found_page } from '../pages/not-found/not_found_page'
import {
  renderregistrar_staff_dashboard_page,
  renderregistrar_staff_enrollments_page,
  renderregistrar_staff_student_records_page,
  renderregistrar_staff_requests_page,
  renderregistrar_staff_schedule_page,
  renderregistrar_staff_settings_page,
  setupregistrar_staff_page,
} from '../pages/registrar_staff/registrar_staff_page'
import { rendersearch_page } from '../pages/search/search_page'
import { ROUTES } from './routes'

let cleanupCurrentRoute: (() => void) | null = null

export function renderRoute(app: HTMLDivElement, pathname: string): void {
  cleanupCurrentRoute?.()
  cleanupCurrentRoute = null

  if (pathname === ROUTES.HOME) {
    document.title = 'Golden West Colleges, Inc.'
    app.innerHTML = renderhome_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.STUDENT_LOGIN) {
    document.title = 'Student Portal Login | Golden West Colleges, Inc.'
    app.innerHTML = renderstudent_login_page()
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_LOGIN) {
    document.title = 'Administrator Login | Golden West Colleges, Inc.'
    app.innerHTML = renderadministrators_login_page()
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_LOGIN) {
    document.title = 'Registrar Staff Login | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_login_page()
    return
  }

  if (pathname === ROUTES.FACULTY_LOGIN) {
    document.title = 'Faculty Login | Golden West Colleges, Inc.'
    app.innerHTML = renderfaculty_login_page()
    return
  }

  if (pathname === ROUTES.ANNOUNCEMENTS) {
    document.title = 'Announcements | Golden West Colleges, Inc.'
    app.innerHTML = renderannouncements_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF || pathname === ROUTES.REGISTRAR_STAFF_DASHBOARD) {
    document.title = 'Registrar Staff Dashboard | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_dashboard_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_STUDENT_RECORDS) {
    document.title = 'Student Records | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_student_records_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_ENROLLMENTS) {
    document.title = 'Enrollments | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_enrollments_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_REQUESTS) {
    document.title = 'Requests | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_requests_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SCHEDULE) {
    document.title = 'Schedule | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_schedule_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STAFF_SETTINGS) {
    document.title = 'Registrar Staff Settings | Golden West Colleges, Inc.'
    app.innerHTML = renderregistrar_staff_settings_page()
    cleanupCurrentRoute = setupregistrar_staff_page(app)
    return
  }

  if (pathname === ROUTES.SEARCH) {
    document.title = 'Search | Golden West Colleges, Inc.'
    app.innerHTML = rendersearch_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS) {
    document.title = 'Dashboard | Golden West Colleges, Inc.'
    app.innerHTML = renderadministrators_dashboard_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DIRECTORY) {
    document.title = 'Administrators | Golden West Colleges, Inc.'
    app.innerHTML = renderadministrators_directory_page()
    cleanupCurrentRoute = setupadministrators_directory_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_FACULTY) {
    document.title = 'Faculty | Golden West Colleges, Inc.'
    app.innerHTML = renderfaculty_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS) {
    document.title = 'Students | Golden West Colleges, Inc.'
    app.innerHTML = renderstudents_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_MANAGE) {
    document.title = 'Manage Students | Golden West Colleges, Inc.'
    app.innerHTML = renderstudents_manage_page()
    cleanupCurrentRoute = setupstudents_manage_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_CREATE) {
    document.title = 'Create Student | Golden West Colleges, Inc.'
    app.innerHTML = renderstudents_create_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_STUDENTS_BULK) {
    document.title = 'Bulk Upload | Golden West Colleges, Inc.'
    app.innerHTML = renderstudents_bulk_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DEPARTMENTS) {
    document.title = 'Departments | Golden West Colleges, Inc.'
    app.innerHTML = renderdepartments_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_REPORTS) {
    document.title = 'Reports | Golden West Colleges, Inc.'
    app.innerHTML = renderreports_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_SETTINGS) {
    document.title = 'Settings | Golden West Colleges, Inc.'
    app.innerHTML = rendersettings_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  document.title = 'Page Not Found | Golden West Colleges, Inc.'
  app.innerHTML = rendernot_found_page()
}


