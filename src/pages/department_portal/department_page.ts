import '../../styles/department.css'
import { DEPARTMENT_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderdepartment_dashboard_page } from './dashboard/dashboard_page'
export { renderdepartment_schedule_page } from './schedule/schedule_page'

export function setupdepartment_page(root: HTMLElement): () => void {
  return setupPortalShell(root, DEPARTMENT_SHELL_CONFIG)
}
