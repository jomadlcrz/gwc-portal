import '../../styles/dean.css'
import { DEAN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderdean_dashboard_page } from './dashboard/dashboard_page'
export { renderdean_schedule_page } from './schedule/schedule_page'

export function setupdean_page(root: HTMLElement): () => void {
  return setupPortalShell(root, DEAN_SHELL_CONFIG)
}

