import '../../styles/registrar.css'
import { registrar_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'
import { setupclass_scheduling_form } from './schedule/schedule_create_page'
import { setupschedule_manage_page } from './schedule/schedule_manage_page'

export { renderregistrar_dashboard_page } from './dashboard/dashboard_page'
export { renderregistrar_student_records_page } from './student_records/student_records_page'
export { renderregistrar_enrollments_page } from './enrollments/enrollments_page'
export { renderregistrar_requests_page } from './requests/requests_page'
export { renderregistrar_schedule_page } from './schedule/schedule_page'
export { renderregistrar_schedule_manage_page } from './schedule/schedule_manage_page'
export { renderregistrar_schedule_create_page } from './schedule/schedule_create_page'
export { renderregistrar_settings_page } from './settings/settings_page'

export function setupregistrar_page(root: HTMLElement): () => void {
  return setupPortalShell(root, registrar_SHELL_CONFIG)
}

export function setupregistrar_schedule_page(root: HTMLElement): () => void {
  return setupPortalShell(root, registrar_SHELL_CONFIG)
}

export function setupregistrar_schedule_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, registrar_SHELL_CONFIG)
  const cleanupManage = setupschedule_manage_page(root)

  return () => {
    cleanupManage()
    cleanupShell()
  }
}

export function setupregistrar_schedule_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, registrar_SHELL_CONFIG)
  const cleanupSchedule = setupclass_scheduling_form(root)

  return () => {
    cleanupSchedule()
    cleanupShell()
  }
}




