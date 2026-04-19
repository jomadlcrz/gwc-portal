import { ROUTES } from '../../app/routes'
import { REGISTRAR_STAFF_SHELL_CONFIG } from '../../components/_layout'
import { renderBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function renderregistrar_staff_schedule_page(): string {
  return renderSectionPlaceholderPage(
    REGISTRAR_STAFF_SHELL_CONFIG,
    { contentClass: 'registrar_staff-content', panelClass: 'registrar_staff-panel' },
    'schedule',
    'Schedule',
    'Review enrollment and records release schedules.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.REGISTRAR_STAFF_DASHBOARD },
        { label: 'Schedule', active: true },
      ]),
    },
  )
}


