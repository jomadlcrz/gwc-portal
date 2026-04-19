import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../components/ui/nav_breadcrumb'

function renderSectionFields(): string {
  const floatingInput = (id: string, label: string, type = 'text'): string => `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `
  const floatingSelect = (id: string, label: string): string => `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}">
        <option value="">Select ${label}</option>
      </select>
      <label for="${id}">${label}</label>
    </div>
  `

  return `
    <div class="admin-student-form-grid">
      ${floatingInput('student-id', 'Student ID')}
      ${floatingInput('student-first-name', 'First Name')}
      ${floatingInput('student-middle-name', 'Middle Name (Optional)')}
      ${floatingInput('student-last-name', 'Last Name')}
      ${floatingInput('student-email', 'Email Address', 'email')}
      ${floatingSelect('student-course', 'Course')}
      ${floatingSelect('student-year-level', 'Year Level')}
      ${floatingSelect('student-type', 'Student Type')}
      ${floatingInput('student-section', 'Section')}
      ${floatingSelect('student-gender', 'Gender')}
      ${floatingInput('student-birth-date', 'Birth Date', 'date')}
      ${floatingSelect('student-province', 'Province')}
      ${floatingSelect('student-city', 'City/Municipality')}
      ${floatingSelect('student-barangay', 'Barangay')}
      ${floatingInput('student-street', 'Street')}
    </div>
  `
}

function renderGuardianFields(title: string): string {
  const key = title.toLowerCase()
  const floatingInput = (id: string, label: string): string => `
    <div class="form-floating">
      <input class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `

  return `
    <h4>${title}</h4>
    <div class="admin-student-form-grid admin-student-form-grid-4">
      ${floatingInput(`${key}-first-name`, 'First Name')}
      ${floatingInput(`${key}-middle-name`, 'Middle Name (Optional)')}
      ${floatingInput(`${key}-last-name`, 'Last Name')}
      ${floatingInput(`${key}-contact-number`, 'Contact Number')}
    </div>
  `
}

export function renderstudents_create_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS },
          { label: 'Students', href: ROUTES.ADMINISTRATORS_STUDENTS },
          { label: 'Manage Students', href: ROUTES.ADMINISTRATORS_STUDENTS_MANAGE },
          { label: 'Create Student', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Create Student</h2>
            <p>Add a new student account to the system.</p>
          </header>

          <section class="admin-student-section">
            <h3><span class="admin-student-section-title">Student Information</span></h3>
            ${renderSectionFields()}
          </section>

          <section class="admin-student-section">
            <h3><span class="admin-student-section-title">Parent and Guardian's Information</span></h3>
            <div class="admin-student-guardian-stack">
              ${renderGuardianFields('Father')}
              ${renderGuardianFields('Mother')}
              ${renderGuardianFields('Guardian')}
              <div class="admin-student-form-grid admin-student-form-grid-4">
                <div class="form-floating">
                  <input class="form-control form-control-sm" id="guardian-relation" placeholder="Relation" />
                  <label for="guardian-relation">Relation</label>
                </div>
              </div>
            </div>
          </section>

          <footer class="admin-student-form-footer">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm">Create Student</button>
          </footer>
        </article>
      </section>
    `,
  )
}
