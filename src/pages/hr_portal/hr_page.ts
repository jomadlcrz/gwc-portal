import '../../styles/hr.css'
import { HR_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderhr_dashboard_page } from './dashboard/dashboard_page'
export { renderhr_faculty_page } from './faculty/faculty_page'
export { renderhr_settings_page } from './settings/settings_page'

export function setuphr_page(root: HTMLElement): () => void {
  return setupPortalShell(root, HR_SHELL_CONFIG)
}
