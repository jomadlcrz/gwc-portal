import { renderAdminPlaceholderPage } from '../../components/admin_section_placeholder'

export function renderenrollments_page(): string {
  return renderAdminPlaceholderPage('enrollments', 'Enrollments', 'Track and process enrollment records and queues.')
}