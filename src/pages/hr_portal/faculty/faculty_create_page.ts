import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { hydrateLocationSelects, setupProvinceCityCascade } from '../../../api/psgc'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderDepartmentCodeBadge } from '../../../components/ui/department_badge'
import { renderAdminSectionTitle } from '../../../components/ui/section_title_heading'
import { DEPARTMENTS, DEPARTMENT_SELECT_OPTIONS } from '../../../data/departments'

function renderDepartmentCodeLegend(): string {
  return DEPARTMENTS.map(
    (department) => renderDepartmentCodeBadge(department.code),
  ).join(' | ')
}

function renderFacultyFormFields(): string {
  const floatingInput = (id: string, label: string, type = 'text'): string => `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `

  const floatingSelect = (id: string, label: string, options: Array<string | { value: string; label: string }>): string => `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}">
        <option value="">Select ${label}</option>
        ${options
          .map((option) =>
            typeof option === 'string' ? `<option value="${option}">${option}</option>` : `<option value="${option.value}">${option.label}</option>`,
          )
          .join('')}
      </select>
      <label for="${id}">${label}</label>
    </div>
  `

  return `
    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Basic Faculty Information', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingInput('faculty-school-id', 'School ID')}
        ${floatingInput('faculty-first-name', 'First Name')}
        ${floatingInput('faculty-middle-name', 'Middle Name (Optional)')}
        ${floatingInput('faculty-last-name', 'Last Name')}
        ${floatingInput('faculty-suffix', 'Suffix (Optional)')}
        ${floatingSelect('faculty-gender', 'Gender', ['Male', 'Female'])}
        ${floatingInput('faculty-birth-date', 'Birth Date', 'date')}
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Contact Information', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingInput('faculty-email', 'Email', 'email')}
        ${floatingInput('faculty-mobile', 'Mobile Number')}
        ${floatingSelect('faculty-province', 'Province', [])}
        ${floatingSelect('faculty-city', 'City/Municipality', [])}
        ${floatingSelect('faculty-barangay', 'Barangay', [])}
        ${floatingInput('faculty-street', 'Street')}
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Faculty Assignment', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingSelect('faculty-department-id', 'Department', DEPARTMENT_SELECT_OPTIONS)}
      </div>
      <p class="hr-faculty-department-codes mb-0 mt-2"><strong>Department Codes:</strong> ${renderDepartmentCodeLegend()}</p>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Role Assignment', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        <div class="form-floating">
          <input type="text" class="form-control form-control-sm" id="faculty-role" value="Instructor" readonly />
          <label for="faculty-role">Role</label>
        </div>
      </div>
    </section>
  `
}

export function renderhr_faculty_create_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'faculty',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([
          { label: 'Faculty', href: ROUTES.HR_FACULTY },
          { label: 'Manage Faculty', href: ROUTES.HR_FACULTY_MANAGE },
          { label: 'Create Faculty', active: true },
        ])}

        <article class="hr-faculty-page-shell">
          <header class="hr-faculty-head">
            <h2>Create Faculty</h2>
            <p>Add a new faculty account. System-generated credentials will be sent to the faculty email.</p>
          </header>

          ${renderFacultyFormFields()}

          <footer class="hr-faculty-form-footer">
            <a href="${ROUTES.HR_FACULTY_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm">Create Faculty</button>
          </footer>
        </article>
      </section>
    `,
  )
}

export function setuphr_faculty_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const cleanupCascade = setupProvinceCityCascade(root)
  void hydrateLocationSelects(root)
  return () => {
    cleanupCascade()
    cleanupShell()
  }
}
