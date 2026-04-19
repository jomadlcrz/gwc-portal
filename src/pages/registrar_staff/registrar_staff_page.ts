import { setupregistrar_staff_shell } from '../../components/registrar_staff_layout'

export { renderregistrar_staff_dashboard_page } from './dashboard_page'
export { renderregistrar_staff_student_records_page } from './student_records_page'
export { renderregistrar_staff_enrollments_page } from './enrollments_page'
export { renderregistrar_staff_requests_page } from './requests_page'
export { renderregistrar_staff_schedule_page } from './schedule_page'
export { renderregistrar_staff_settings_page } from './settings_page'

export function setupregistrar_staff_page(root: HTMLElement): () => void {
  return setupregistrar_staff_shell(root)
}

