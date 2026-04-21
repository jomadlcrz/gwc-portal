import '../../styles/administrators/layout.css'
import '../../styles/administrators/directory.css'
import '../../styles/administrators/students.css'
import { ADMIN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderadministrators_dashboard_page } from './dashboard/dashboard_page'
export { renderadministrators_directory_page, setupadministrators_directory_page } from './administrators/administrators_directory_page'
export { renderregistrar_staff_admin_page } from './registrar_staff/registrar_staff_page'
export { renderfaculty_page } from './faculty/faculty_page'
export { renderstudents_page } from './students/students_page'
export { renderstudents_manage_page, setupstudents_manage_page } from './students/students_manage_page'
export { renderstudents_create_page } from './students/students_create_page'
export { renderstudents_bulk_page, setupstudents_bulk_page } from './students/students_bulk_page'
export { renderdepartments_page } from './departments/departments_page'
export { renderreports_page } from './reports/reports_page'
export { rendersettings_page } from './settings/settings_page'

export function setupadministrators_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}


