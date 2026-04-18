import { renderAdminPlaceholderPage } from '../../components/admin_section_placeholder'

export function renderstudents_page(): string {
  return renderAdminPlaceholderPage('students', 'Students', 'Manage student profiles, status, and access.')
}