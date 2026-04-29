import { renderSectionSubheading, renderSectionTitle } from '../ui/section_title_heading'

function floatingInput(id: string, label: string, type = 'text'): string {
  return `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${label}" />
      <label for="${id}">${label}</label>
    </div>
  `
}

function floatingSelect(id: string, label: string): string {
  return `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}">
        <option value="">Select ${label}</option>
      </select>
      <label for="${id}">${label}</label>
    </div>
  `
}

function renderStudentInfoFields(prefix: string): string {
  return `
    <div class="admin-student-form-grid">
      ${floatingInput(`${prefix}-student-id`, 'Student ID')}
      ${floatingInput(`${prefix}-first-name`, 'First Name')}
      ${floatingInput(`${prefix}-middle-name`, 'Middle Name (Optional)')}
      ${floatingInput(`${prefix}-last-name`, 'Last Name')}
      ${floatingInput(`${prefix}-email`, 'Email Address', 'email')}
      ${floatingSelect(`${prefix}-course`, 'Course')}
      ${floatingSelect(`${prefix}-year-level`, 'Year Level')}
      ${floatingSelect(`${prefix}-student-type`, 'Student Type')}
      ${floatingInput(`${prefix}-section`, 'Section')}
      ${floatingSelect(`${prefix}-gender`, 'Gender')}
      ${floatingInput(`${prefix}-birth-date`, 'Birth Date', 'date')}
      ${floatingSelect(`${prefix}-province`, 'Province')}
      ${floatingSelect(`${prefix}-city`, 'City/Municipality')}
      ${floatingSelect(`${prefix}-barangay`, 'Barangay')}
      ${floatingInput(`${prefix}-street`, 'Street')}
    </div>
  `
}

function renderGuardianFields(prefix: string, title: string): string {
  const key = title.toLowerCase()
  const isGuardian = key === 'guardian'
  return `
    ${renderSectionSubheading(title)}
    <div class="admin-student-form-grid admin-student-form-grid-4">
      ${floatingInput(`${prefix}-${key}-first-name`, 'First Name')}
      ${floatingInput(`${prefix}-${key}-middle-name`, 'Middle Name (Optional)')}
      ${floatingInput(`${prefix}-${key}-last-name`, 'Last Name')}
      ${floatingInput(`${prefix}-${key}-contact-number`, 'Contact Number')}
      ${
        isGuardian
          ? floatingInput(`${prefix}-guardian-relation`, 'Relation')
          : ''
      }
    </div>
  `
}

export function renderStudentAccountForm(prefix: string): string {
  return `
    <section class="admin-student-section">
      ${renderSectionTitle('Student Information')}
      ${renderStudentInfoFields(prefix)}
    </section>

    <section class="admin-student-section">
      ${renderSectionTitle("Parent and Guardian's Information")}
      <div class="admin-student-guardian-stack">
        ${renderGuardianFields(prefix, 'Father')}
        ${renderGuardianFields(prefix, 'Mother')}
        ${renderGuardianFields(prefix, 'Guardian')}
      </div>
    </section>
  `
}


