import '../../styles/student.css'
import { STUDENT_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'
import { setupstudent_schedule_page as setupSchedulePrint } from './schedule/schedule_page'

export { renderstudent_dashboard_page } from './dashboard/dashboard_page'
export { renderstudent_subjects_page } from './subjects/subjects_page'
export { renderstudent_grades_page } from './grades/grades_page'
export { renderstudent_schedule_page } from './schedule/schedule_page'
export { renderstudent_settings_page } from './settings/settings_page'

export function setupstudent_page(root: HTMLElement): () => void {
  return setupPortalShell(root, STUDENT_SHELL_CONFIG)
}

export function setupstudent_schedule_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, STUDENT_SHELL_CONFIG)
  const cleanupSchedulePrint = setupSchedulePrint(root)

  return () => {
    cleanupSchedulePrint()
    cleanupShell()
  }
}
