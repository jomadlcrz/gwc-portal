import '../../styles/administrators/layout.css'
import '../../styles/administrators/shared_admin.css'
import '../../styles/administrators/students.css'
import '../../styles/administrators/posts.css'
import '../../styles/administrators/testimonials.css'
import { ADMIN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderadministrators_dashboard_page } from './dashboard/dashboard_page'
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

export function setupadministrators_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}

export function setupadministrators_dashboard_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}

