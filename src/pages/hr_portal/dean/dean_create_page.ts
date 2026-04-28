import { ROUTES } from '../../../app/routes'
import { hydrateLocationSelects, setupProvinceCityCascade } from '../../../api/psgc'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderDepartmentCodeBadge } from '../../../components/ui/department_badge'
import { renderAdminSectionTitle } from '../../../components/ui/section_title_heading'
import { DEPARTMENTS, DEPARTMENT_SELECT_OPTIONS } from '../../../data/departments'

function renderDepartmentCodeLegend(): string {
  return DEPARTMENTS.map((department) => renderDepartmentCodeBadge(department.code)).join(' | ')
}

function renderDeanFormFields(): string {
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
      ${renderAdminSectionTitle('Dean Information', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingInput('dean-school-id', 'School ID')}
        ${floatingInput('dean-first-name', 'First Name')}
        ${floatingInput('dean-middle-name', 'Middle Name (Optional)')}
        ${floatingInput('dean-last-name', 'Last Name')}
        ${floatingInput('dean-suffix', 'Suffix (Optional)')}
        ${floatingSelect('dean-gender', 'Gender', ['Male', 'Female'])}
        ${floatingInput('dean-birth-date', 'Birth Date', 'date')}
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Contact Information', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingInput('dean-email', 'Email', 'email')}
        ${floatingInput('dean-mobile', 'Mobile Number')}
        ${floatingSelect('dean-province', 'Province', [])}
        ${floatingSelect('dean-city', 'City/Municipality', [])}
        ${floatingSelect('dean-barangay', 'Barangay', [])}
        ${floatingInput('dean-street', 'Street')}
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Department Assignment', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingSelect('dean-department-id', 'Department', DEPARTMENT_SELECT_OPTIONS)}
      </div>
      <p class="hr-faculty-department-codes mb-0 mt-2"><strong>Department Codes:</strong> ${renderDepartmentCodeLegend()}</p>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Role Assignment', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        <div class="form-floating">
          <input type="text" class="form-control form-control-sm" id="dean-role" value="Dean" readonly />
          <label for="dean-role">Role</label>
        </div>
      </div>
    </section>
  `
}

export function renderhr_dean_create_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'dean',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([
          { label: 'Dean', href: ROUTES.HR_DEAN },
          { label: 'Manage Dean', href: ROUTES.HR_DEAN_MANAGE },
          { label: 'Create Dean', active: true },
        ])}

        <article class="hr-faculty-page-shell">
          <header class="hr-faculty-head">
            <h2>Create Dean</h2>
            <p>Add a new dean account. System-generated credentials will be sent to the dean email.</p>
          </header>

          ${renderDeanFormFields()}

          <footer class="hr-faculty-form-footer">
            <a href="${ROUTES.HR_DEAN_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm">Create Dean</button>
          </footer>
        </article>
      </section>
    `,
  )
}

export function setuphr_dean_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const cleanupCascade = setupProvinceCityCascade(root)
  void hydrateLocationSelects(root)
  return () => {
    cleanupCascade()
    cleanupShell()
  }
}
