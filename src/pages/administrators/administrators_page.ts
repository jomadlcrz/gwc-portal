import { setupAdminShell } from '../../components/admin_shell'

export { renderadministrators_dashboard_page } from './dashboard_page'
export { renderadministrators_directory_page } from './administrators_directory_page'
export { renderfaculty_page } from './faculty_page'
export { renderstudents_page } from './students_page'
export { renderenrollments_page } from './enrollments_page'
export { renderdepartments_page } from './departments_page'
export { renderreports_page } from './reports_page'
export { rendersettings_page } from './settings_page'

export function setupadministrators_page(root: HTMLElement): () => void {
  return setupAdminShell(root)
}
