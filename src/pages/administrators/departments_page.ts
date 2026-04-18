import { renderAdminPlaceholderPage } from '../../components/admin_section_placeholder'

export function renderdepartments_page(): string {
  return renderAdminPlaceholderPage('departments', 'Departments', 'Manage department structure and assigned administrators.')
}