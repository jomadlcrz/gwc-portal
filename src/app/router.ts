import { renderannouncements_page } from '../pages/announcements/announcements_page'
import { renderabout_gwc_faqs_page, renderabout_gwc_history_page } from '../pages/about_gwc/about_gwc_page'
import {
  renderadmission_contact_page,
  renderadmission_page,
  renderadmission_status_page,
  renderadmission_status_details_page,
  renderadmission_status_verify_page,
  setupadmission_status_details_page,
  setupadmission_status_page,
  setupadmission_status_verify_page,
} from '../pages/admission/admission_page'
import {
  renderadmission_registration_page as renderadmission_registration_form_page,
  setupadmission_registration_page,
} from '../pages/admission/admission_registration_page'
import { renderpost_lists_page } from '../pages/post/post_lists_page'
import {
  renderadministrators_dashboard_page,
  renderregistrar_admin_page,
  renderdepartments_page,
  renderfaculty_page,
  renderreports_page,
  rendersettings_page,
  renderstudents_manage_page,
  setupstudents_manage_page,
  renderposts_page,
  renderposts_create_page,
  setupposts_create_page,
  rendertestimonials_page,
  rendertestimonials_create_page,
  setuptestimonials_create_page,
  setupadministrators_page,
  setupadministrators_dashboard_page,
  setupdepartments_page,
} from '../pages/administrators/administrators_page'
import { setupSiteInteractions } from '../components/layout/interactions'
import { renderhome_page } from '../pages/home/home_page'
import { renderadministrators_login_page } from '../pages/login/administrators_login_page'
import { renderchange_password_page } from '../pages/login/set_new_password_page'
import { renderfaculty_login_page } from '../pages/login/faculty_login_page'
import { renderdepartment_login_page } from '../pages/login/department_login_page'
import {
  renderfaculty_classes_page,
  renderfaculty_dashboard_page,
  renderfaculty_gradebook_page,
  renderfaculty_settings_page,
  setupfaculty_page,
  setupfaculty_classes_page,
} from '../pages/faculty_portal/faculty_page'
import { renderregistrar_login_page } from '../pages/login/registrar_login_page'
import { renderstudent_login_page } from '../pages/login/student_login_page'
import {
  renderstudent_dashboard_page,
  renderstudent_grades_page,
  renderstudent_schedule_page,
  renderstudent_settings_page,
  renderstudent_subjects_page,
  setupstudent_page,
  setupstudent_schedule_page,
} from '../pages/student_portal/student_page'
import {
  renderdepartment_dashboard_page,
  renderdepartment_schedule_page,
  setupdepartment_page,
  setupdepartment_schedule_page,
} from '../pages/department_portal/department_page'
import {
  renderhr_dashboard_page,
  renderhr_faculty_page,
  renderhr_faculty_create_page,
  renderhr_faculty_manage_page,
  renderhr_settings_page,
  setuphr_faculty_create_page,
  setuphr_faculty_manage_page,
  setuphr_page,
} from '../pages/hr_portal/hr_page'
import { rendernot_found_page } from '../pages/not-found/not_found_page'
import {
  renderregistrar_dashboard_page,
  renderregistrar_enrollments_page,
  renderregistrar_admission_page,
  renderregistrar_admission_review_page,
  renderregistrar_admission_details_page,
  setupregistrar_admission_page,
  setupregistrar_admission_review_page,
  setupregistrar_admission_details_page,
  renderregistrar_student_records_page,
  renderregistrar_requests_page,
  renderregistrar_schedule_page,
  renderregistrar_schedule_manage_page,
  renderregistrar_schedule_create_page,
  renderregistrar_settings_page,
  setupregistrar_page,
  setupregistrar_schedule_page,
  setupregistrar_schedule_manage_page,
  setupregistrar_schedule_create_page,
} from '../pages/registrar_portal/registrar_page'
import { rendersearch_page } from '../pages/search/search_page'
import { renderpost_page } from '../pages/post/post_page'
import { getPostBySlug, getPostCategoryFromSlug } from '../data/posts'
import { ROUTES } from './routes'
import { setupChangePasswordPage, setupStudentLoginPage } from '../api/student_auth'
import { renderForgotPasswordPage } from '../pages/login/forgot_password_page'
import { renderHRPortalPage } from '../pages/login/hr_portal_page'
import { setupLoginPageShortcuts } from '../pages/login/login_shortcuts'

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
    const cleanupStudentLogin = setupStudentLoginPage(app)
    const cleanupLoginShortcuts = setupLoginPageShortcuts()
    cleanupCurrentRoute = () => {
      cleanupStudentLogin()
      cleanupLoginShortcuts()
    }
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
    cleanupCurrentRoute = setupstudent_schedule_page(app)
    return
  }

  if (pathname === ROUTES.STUDENT_SETTINGS) {
    app.innerHTML = renderstudent_settings_page()
    cleanupCurrentRoute = setupstudent_page(app)
    return
  }

  if (pathname === ROUTES.DEPARTMENT_PORTAL || pathname === ROUTES.DEPARTMENT_DASHBOARD) {
    app.innerHTML = renderdepartment_dashboard_page()
    cleanupCurrentRoute = setupdepartment_page(app)
    return
  }

  if (pathname === ROUTES.DEPARTMENT_SCHEDULE) {
    app.innerHTML = renderdepartment_schedule_page()
    cleanupCurrentRoute = setupdepartment_schedule_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_LOGIN) {
    app.innerHTML = renderadministrators_login_page()
    cleanupCurrentRoute = setupLoginPageShortcuts()
    return
  }

  if (pathname === ROUTES.REGISTRAR_LOGIN) {
    app.innerHTML = renderregistrar_login_page()
    cleanupCurrentRoute = setupLoginPageShortcuts()
    return
  }

  // faculty routes
  if (pathname === ROUTES.FACULTY_LOGIN) {
    app.innerHTML = renderfaculty_login_page()
    cleanupCurrentRoute = setupLoginPageShortcuts()
    return
  }

  if (pathname === ROUTES.DEPARTMENT_LOGIN) {
    app.innerHTML = renderdepartment_login_page()
    cleanupCurrentRoute = setupLoginPageShortcuts()
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
    cleanupCurrentRoute = setupfaculty_classes_page(app)
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

  // announcements route
  if (pathname === ROUTES.ANNOUNCEMENTS) {
    app.innerHTML = renderannouncements_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  // about GWC routes
  if (pathname === ROUTES.ABOUT_GWC_HISTORY) {
    app.innerHTML = renderabout_gwc_history_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname === ROUTES.ABOUT_GWC_FAQS) {
    app.innerHTML = renderabout_gwc_faqs_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname === ROUTES.ADMISSION) {
    app.innerHTML = renderadmission_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname === ROUTES.ADMISSION_REGISTRATION) {
    app.innerHTML = renderadmission_registration_form_page()
    const cleanupSiteInteractions = setupSiteInteractions(app)
    const cleanupAdmissionRegistration = setupadmission_registration_page(app)
    cleanupCurrentRoute = () => {
      cleanupSiteInteractions()
      cleanupAdmissionRegistration()
    }
    return
  }

  if (pathname.startsWith(`${ROUTES.ADMISSION_STATUS}/verify/`)) {
    const applicationNo = decodeURIComponent(pathname.slice(`${ROUTES.ADMISSION_STATUS}/verify/`.length))
    app.innerHTML = renderadmission_status_verify_page(applicationNo)
    const removeSiteInteractions = setupSiteInteractions(app)
    const removeStatusVerificationHandlers = setupadmission_status_verify_page(app, applicationNo)
    cleanupCurrentRoute = () => {
      removeSiteInteractions()
      removeStatusVerificationHandlers()
    }
    return
  }

  if (pathname.startsWith(`${ROUTES.ADMISSION_STATUS}/`)) {
    const applicationNo = decodeURIComponent(pathname.slice(`${ROUTES.ADMISSION_STATUS}/`.length))
    app.innerHTML = renderadmission_status_details_page(applicationNo)
    const removeSiteInteractions = setupSiteInteractions(app)
    const removeStatusDetailsHandlers = setupadmission_status_details_page(app)
    cleanupCurrentRoute = () => {
      removeSiteInteractions()
      removeStatusDetailsHandlers()
    }
    return
  }

  if (pathname === ROUTES.ADMISSION_STATUS) {
    app.innerHTML = renderadmission_status_page()
    const removeSiteInteractions = setupSiteInteractions(app)
    const removeAdmissionStatusHandlers = setupadmission_status_page(app)
    cleanupCurrentRoute = () => {
      removeSiteInteractions()
      removeAdmissionStatusHandlers()
    }
    return
  }

  if (pathname === ROUTES.ADMISSION_CONTACT) {
    app.innerHTML = renderadmission_contact_page()
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

  // registrar routes
  if (pathname === ROUTES.REGISTRAR || pathname === ROUTES.REGISTRAR_DASHBOARD) {
    app.innerHTML = renderregistrar_dashboard_page()
    cleanupCurrentRoute = setupregistrar_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_STUDENT_RECORDS) {
    app.innerHTML = renderregistrar_student_records_page()
    cleanupCurrentRoute = setupregistrar_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_ENROLLMENTS) {
    app.innerHTML = renderregistrar_enrollments_page()
    cleanupCurrentRoute = setupregistrar_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_ADMISSION) {
    app.innerHTML = renderregistrar_admission_page()
    const cleanupRegistrarShell = setupregistrar_page(app)
    const cleanupAdmissionControl = setupregistrar_admission_page(app)
    cleanupCurrentRoute = () => {
      cleanupAdmissionControl()
      cleanupRegistrarShell()
    }
    return
  }

  if (pathname === ROUTES.REGISTRAR_ADMISSION_REVIEW) {
    app.innerHTML = renderregistrar_admission_review_page()
    const cleanupRegistrarShell = setupregistrar_page(app)
    const cleanupAdmissionReview = setupregistrar_admission_review_page(app)
    cleanupCurrentRoute = () => {
      cleanupAdmissionReview()
      cleanupRegistrarShell()
    }
    return
  }

  if (pathname.startsWith(`${ROUTES.REGISTRAR_ADMISSION_DETAILS}/`)) {
    const applicationNo = decodeURIComponent(pathname.slice(`${ROUTES.REGISTRAR_ADMISSION_DETAILS}/`.length))
    app.innerHTML = renderregistrar_admission_details_page(applicationNo)
    const cleanupRegistrarShell = setupregistrar_page(app)
    const cleanupAdmissionDetails = setupregistrar_admission_details_page(app)
    cleanupCurrentRoute = () => {
      cleanupAdmissionDetails()
      cleanupRegistrarShell()
    }
    return
  }

  if (pathname === ROUTES.REGISTRAR_REQUESTS) {
    app.innerHTML = renderregistrar_requests_page()
    cleanupCurrentRoute = setupregistrar_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_SCHEDULE) {
    app.innerHTML = renderregistrar_schedule_page()
    cleanupCurrentRoute = setupregistrar_schedule_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_SCHEDULE_MANAGE) {
    app.innerHTML = renderregistrar_schedule_manage_page()
    cleanupCurrentRoute = setupregistrar_schedule_manage_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_SCHEDULE_CREATE) {
    app.innerHTML = renderregistrar_schedule_create_page()
    cleanupCurrentRoute = setupregistrar_schedule_create_page(app)
    return
  }

  if (pathname === ROUTES.REGISTRAR_SETTINGS) {
    app.innerHTML = renderregistrar_settings_page()
    cleanupCurrentRoute = setupregistrar_page(app)
    return
  }

  // search route
  if (pathname === ROUTES.SEARCH) {
    app.innerHTML = rendersearch_page()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  // post routes
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

  // Admin routes
  if (pathname === ROUTES.ADMINISTRATORS) {
    app.innerHTML = renderadministrators_dashboard_page()
    cleanupCurrentRoute = setupadministrators_dashboard_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_REGISTRAR) {
    app.innerHTML = renderregistrar_admin_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_FACULTY) {
    app.innerHTML = renderfaculty_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (
    pathname === ROUTES.MANAGE
    || pathname === ROUTES.ADMINISTRATORS_STUDENTS
    || pathname === ROUTES.ADMINISTRATORS_STUDENTS_MANAGE
  ) {
    app.innerHTML = renderstudents_manage_page()
    cleanupCurrentRoute = setupstudents_manage_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_POSTS) {
    app.innerHTML = renderposts_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_POSTS_CREATE) {
    app.innerHTML = renderposts_create_page()
    cleanupCurrentRoute = setupposts_create_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_TESTIMONIALS) {
    app.innerHTML = rendertestimonials_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_TESTIMONIALS_CREATE) {
    app.innerHTML = rendertestimonials_create_page()
    cleanupCurrentRoute = setuptestimonials_create_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DEPARTMENTS) {
    app.innerHTML = renderdepartments_page()
    cleanupCurrentRoute = setupdepartments_page(app)
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

  // HR routes
  if (pathname === ROUTES.HR_LOGIN) {
    app.innerHTML = renderHRPortalPage()
    cleanupCurrentRoute = setupLoginPageShortcuts()
    return
  }

  if (pathname === ROUTES.HR_PORTAL || pathname === ROUTES.HR_DASHBOARD) {
    app.innerHTML = renderhr_dashboard_page()
    cleanupCurrentRoute = setuphr_page(app)
    return
  }

  if (pathname === ROUTES.HR_FACULTY) {
    app.innerHTML = renderhr_faculty_page()
    cleanupCurrentRoute = setuphr_page(app)
    return
  }

  if (pathname === ROUTES.HR_FACULTY_MANAGE) {
    app.innerHTML = renderhr_faculty_manage_page()
    cleanupCurrentRoute = setuphr_faculty_manage_page(app)
    return
  }

  if (pathname === ROUTES.HR_FACULTY_CREATE) {
    app.innerHTML = renderhr_faculty_create_page()
    cleanupCurrentRoute = setuphr_faculty_create_page(app)
    return
  }

  if (pathname === ROUTES.HR_SETTINGS) {
    app.innerHTML = renderhr_settings_page()
    cleanupCurrentRoute = setuphr_page(app)
    return
  }

  // forgot password route
  if (pathname === ROUTES.FORGOT_PASSWORD) {
    app.innerHTML = renderForgotPasswordPage()
    return
  }

  app.innerHTML = rendernot_found_page()
}









