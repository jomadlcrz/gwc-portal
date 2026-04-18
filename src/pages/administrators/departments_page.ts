import { renderAdminPlaceholderPage } from '../../components/shared_placeholder'

export function renderdepartments_page(): string {
  return renderAdminPlaceholderPage('departments', 'Departments', 'Manage department structure and assigned administrators.')
}