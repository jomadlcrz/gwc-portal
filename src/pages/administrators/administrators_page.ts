import { ADMIN_SHELL_CONFIG, setupPortalShell } from '../../components/_layout'

export { renderadministrators_dashboard_page } from './dashboard_page'
export { renderadministrators_directory_page, setupadministrators_directory_page } from './administrators_directory_page'
export { renderfaculty_page } from './faculty_page'
export { renderstudents_page } from './students_page'
export { renderstudents_manage_page, setupstudents_manage_page } from './students_manage_page'
export { renderstudents_create_page } from './students_create_page'
export { renderstudents_bulk_page } from './students_bulk_page'
export { renderdepartments_page } from './departments_page'
export { renderreports_page } from './reports_page'
export { rendersettings_page } from './settings_page'

export function setupadministrators_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}
