import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderAdminSectionTitle } from '../../../components/ui/section_title_heading'

function renderFacultyFormFields(): string {
  const floatingInput = (id: string, label: string, type = 'text'): string => `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `

  const floatingSelect = (id: string, label: string, options: string[]): string => `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}">
        <option value="">Select ${label}</option>
        ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
      </select>
      <label for="${id}">${label}</label>
    </div>
  `

  return `
    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Faculty Information', { titleClass: 'hr-faculty-section-title' })}
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
        <div class="form-floating hr-faculty-col-span-2">
          <textarea class="form-control form-control-sm" id="faculty-address" placeholder="Address" style="height: 95px;"></textarea>
          <label for="faculty-address">Address</label>
        </div>
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Account Setup', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingInput('faculty-password', 'Password', 'password')}
        ${floatingInput('faculty-confirm-password', 'Confirm Password', 'password')}
        <div class="hr-faculty-toggle-wrap">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="faculty-temporary-password" />
            <label class="form-check-label" for="faculty-temporary-password">Temporary Password</label>
          </div>
        </div>
      </div>
    </section>

    <section class="hr-faculty-section">
      ${renderAdminSectionTitle('Faculty Assignment', { titleClass: 'hr-faculty-section-title' })}
      <div class="hr-faculty-form-grid">
        ${floatingSelect('faculty-department-id', 'Department', [
          'CCS',
          'CBA',
          'College of Education',
          'College of Hospitality Management',
        ])}
      </div>
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
            <p>Add a new faculty account with HR-managed credentials.</p>
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
  return setupPortalShell(root, HR_SHELL_CONFIG)
}
