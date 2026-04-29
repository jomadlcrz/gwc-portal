import '../../styles/administrator/layout.css'
import '../../styles/administrator/shared_ui.css'
import '../../styles/administrator/students.css'
import '../../styles/administrator/posts.css'
import '../../styles/administrator/testimonials.css'
import { ADMIN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderadministrator_dashboard_page } from './dashboard/dashboard_page'
export { renderregistrar_admin_page } from './registrar/registrar_page'
export { renderfaculty_page } from './faculty/faculty_page'
export { renderstudents_page } from './students/students_page'
export { renderstudents_manage_page, setupstudents_manage_page } from './students/students_manage_page'
export { renderposts_page } from './posts/posts_page'
export { renderposts_create_page, setupposts_create_page } from './posts/posts_create_page'
export { rendertestimonials_page } from './testimonials/testimonials_page'
export { rendertestimonials_create_page, setuptestimonials_create_page } from './testimonials/testimonials_create_page'
export { renderdepartments_page } from './departments/departments_page'
export { renderreports_page } from './reports/reports_page'
export { rendersettings_page } from './settings/settings_page'

export function setupadministrator_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}

export function setupadministrator_dashboard_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}


