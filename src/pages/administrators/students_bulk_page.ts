import { ROUTES } from '../../app/routes'
import { renderAdminShell } from '../../components/admin_layout'
import { renderAdminBreadcrumbNav } from '../../components/admin_breadcrumb_nav'

function renderBulkCard(index: number): string {
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
  const floatingParentInput = (id: string, label: string): string => `
    <div class="form-floating">
      <input class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `

  return `
    <article class="admin-bulk-card">
      <header>
        <h4>Student ${index}</h4>
        <button type="button" class="btn btn-outline-secondary btn-sm">Remove</button>
      </header>
      <p>Fill out the student details below.</p>

      <section class="admin-student-section">
        <h3>Student Information</h3>
        <div class="admin-student-form-grid">
          ${floatingInput(`bulk-${index}-student-id`, 'Student ID')}
          ${floatingInput(`bulk-${index}-first-name`, 'First Name')}
          ${floatingInput(`bulk-${index}-middle-name`, 'Middle Name (Optional)')}
          ${floatingInput(`bulk-${index}-last-name`, 'Last Name')}
          ${floatingInput(`bulk-${index}-email`, 'Email Address', 'email')}
          ${floatingSelect(`bulk-${index}-course`, 'Course')}
          ${floatingSelect(`bulk-${index}-year-level`, 'Year Level')}
          ${floatingSelect(`bulk-${index}-student-type`, 'Student Type')}
          ${floatingInput(`bulk-${index}-section`, 'Section')}
          ${floatingSelect(`bulk-${index}-gender`, 'Gender')}
          ${floatingInput(`bulk-${index}-birth-date`, 'Birth Date', 'date')}
          ${floatingSelect(`bulk-${index}-province`, 'Province')}
          ${floatingSelect(`bulk-${index}-city`, 'City/Municipality')}
          ${floatingSelect(`bulk-${index}-barangay`, 'Barangay')}
          ${floatingInput(`bulk-${index}-street`, 'Street')}
        </div>
      </section>

      <section class="admin-student-section">
        <h3>Parent and Guardian's Information</h3>
        <h4>Father</h4>
        <div class="admin-student-form-grid admin-student-form-grid-4">
          ${floatingParentInput(`bulk-${index}-father-first-name`, 'First Name')}
          ${floatingParentInput(`bulk-${index}-father-middle-name`, 'Middle Name (Optional)')}
          ${floatingParentInput(`bulk-${index}-father-last-name`, 'Last Name')}
          ${floatingParentInput(`bulk-${index}-father-contact-number`, 'Contact Number')}
        </div>
      </section>
    </article>
  `
}

export function renderstudents_bulk_page(): string {
  return renderAdminShell(
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS_STUDENTS },
          { label: 'Manage Students', href: ROUTES.ADMINISTRATORS_STUDENTS_MANAGE },
          { label: 'Bulk Upload', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Bulk Student Upload</h2>
            <p>Import multiple students using a CSV file.</p>
          </header>

          <section class="admin-student-toolbar admin-student-toolbar-start">
            <button type="button" class="btn btn-outline-primary btn-sm">Upload CSV</button>
            <button type="button" class="btn btn-outline-primary btn-sm">Paste Data</button>
            <button type="button" class="btn btn-outline-primary btn-sm">+ Add Student Card</button>
          </section>

          ${renderBulkCard(1)}

          <footer class="admin-student-form-footer">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm">Create Accounts</button>
          </footer>
        </article>
      </section>
    `,
  )
}
