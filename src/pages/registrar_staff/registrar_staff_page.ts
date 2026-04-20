import { REGISTRAR_STAFF_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderregistrar_staff_dashboard_page } from './dashboard/dashboard_page'
export { renderregistrar_staff_student_records_page } from './student_records/student_records_page'
export { renderregistrar_staff_enrollments_page } from './enrollments/enrollments_page'
export { renderregistrar_staff_requests_page } from './requests/requests_page'
export { renderregistrar_staff_schedule_page } from './schedule/schedule_page'
export { renderregistrar_staff_settings_page } from './settings/settings_page'

export function setupregistrar_staff_page(root: HTMLElement): () => void {
  return setupPortalShell(root, REGISTRAR_STAFF_SHELL_CONFIG)
}



