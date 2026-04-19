import { REGISTRAR_STAFF_SHELL_CONFIG } from '../../components/_layout'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function renderregistrar_staff_requests_page(): string {
  return renderSectionPlaceholderPage(
    REGISTRAR_STAFF_SHELL_CONFIG,
    { contentClass: 'registrar_staff-content', panelClass: 'registrar_staff-panel' },
    'requests',
    'Requests',
    'Track and process transcript and certification requests.',
  )
}


