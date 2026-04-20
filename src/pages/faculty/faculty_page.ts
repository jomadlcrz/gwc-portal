import { FACULTY_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderfaculty_dashboard_page } from './dashboard/dashboard_page'
export { renderfaculty_classes_page } from './classes/classes_page'
export { renderfaculty_gradebook_page } from './gradebook/gradebook_page'
export { renderfaculty_settings_page } from './settings/settings_page'

export function setupfaculty_page(root: HTMLElement): () => void {
  return setupPortalShell(root, FACULTY_SHELL_CONFIG)
}


