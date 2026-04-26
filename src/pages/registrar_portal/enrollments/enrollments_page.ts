import { registrar_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderregistrar_enrollments_page(): string {
  return renderSectionPlaceholderPage(
    registrar_SHELL_CONFIG,
    { contentClass: 'registrar-content', panelClass: 'registrar-panel' },
    'enrollments',
    'Enrollments',
    'Track and process enrollment records and queues.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Enrollments', active: true },
      ]),
    },
  )
}





