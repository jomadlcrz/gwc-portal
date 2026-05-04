import '../../styles/admission.css'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'
import { createRegistrationStudent } from '../../api/v1/applications/applications'
import { ACADEMIC_PROGRAMS } from '../../data/programs'

const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/gwc_banner.png'
const draftKey = 'gwc:admission:registration:draft'
const currentYear = new Date().getFullYear()
const registrationStepLabels = [
  'Personal Information',
  'Educational Background',
  'Other Information',
  'Upload Documents',
  'Review & Submit',
] as const

type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6

type AdmissionDocument = {
  id: string
  label: string
  note: string
  accept: string
  requiredFor: 'all' | 'transferee'
}

const admissionDocuments: AdmissionDocument[] = [
  { id: 'report-card', label: 'Form 138 / Report Card', note: 'Senior high school report card or final grade record.', accept: '.pdf,.jpg,.jpeg,.png', requiredFor: 'all' },
  { id: 'good-moral', label: 'Certificate of Good Moral', note: 'Recent certificate issued by your previous school.', accept: '.pdf,.jpg,.jpeg,.png', requiredFor: 'all' },
  { id: 'psa-birth', label: 'PSA Birth Certificate', note: 'Scanned PSA-issued birth certificate.', accept: '.pdf,.jpg,.jpeg,.png', requiredFor: 'all' },
  { id: 'id-picture', label: '2x2 ID Picture', note: 'Clear recent photo with plain background.', accept: '.jpg,.jpeg,.png', requiredFor: 'all' },
  { id: 'tor', label: 'Transcript of Records', note: 'Required for transferee applicants.', accept: '.pdf,.jpg,.jpeg,.png', requiredFor: 'transferee' },
]

const draftFieldIds = [
  'admission-application-id',
  'admission-application-date',
  'admission-academic-year',
  'admission-semester',
  'admission-primary-course',
  'admission-second-choice',
  'admission-first-name',
  'admission-middle-name',
  'admission-last-name',
  'admission-birth-date',
  'admission-gender',
  'admission-nationality',
  'admission-civil-status',
  'admission-religion',
  'admission-contact-email',
  'admission-contact-mobile',
  'admission-home-address',
  'admission-barangay',
  'admission-city',
  'admission-province',
  'admission-father-name',
  'admission-mother-maiden-name',
  'admission-parent-contact',
  'admission-emergency-name',
  'admission-emergency-relationship',
  'admission-emergency-contact',
  'admission-emergency-address',
  'admission-previous-school',
  'admission-strand-track',
  'admission-school-address',
  'admission-year-graduated',
  'admission-gpa',
  'admission-pwd-specify',
  'admission-account-email',
] as const

const agreementIds = ['admission-agreement-certify', 'admission-agreement-policies', 'admission-agreement-privacy'] as const

function localDateValue(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function generateApplicationId(): string {
  const now = new Date()
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const suffix = String(Math.floor(Math.random() * 9000) + 1000)
  return `GWC-${datePart}-${suffix}`
}

function renderProgramOptions(): string {
  return `<option value="">Select course</option>${ACADEMIC_PROGRAMS.map((program) => `<option value="${program.name}">${program.name}</option>`).join('')}`
}

function renderRegistrationSteps(): string {
  return `
    <section class="admission-registration-steps" aria-label="Admission registration steps" data-aos="fade-right" data-aos-delay="100">
      <ol class="admission-stepper-list admission-stepper-list-final">
        ${registrationStepLabels
          .map(
            (label, index) => `
              <li class="admission-stepper-item ${index === 0 ? 'is-active' : ''}" data-step-index="${index}">
                <span class="admission-stepper-dot" aria-hidden="true">${index + 1}</span>
                <span class="admission-stepper-label">${label}</span>
              </li>
            `,
          )
          .join('')}
      </ol>
      <p id="admission-stepper-mobile-label" class="admission-stepper-mobile-label">${registrationStepLabels[0]}</p>
    </section>
  `
}

function field(id: string, label: string, options: { type?: string; required?: boolean; readonly?: boolean; autocomplete?: string; min?: string; max?: string; step?: string; list?: string } = {}): string {
  return `
    <div class="form-floating admission-field">
      <input id="${id}" class="form-control" type="${options.type ?? 'text'}" placeholder=" "${options.required ? ' required' : ''}${options.readonly ? ' readonly' : ''}${options.autocomplete ? ` autocomplete="${options.autocomplete}"` : ''}${options.min ? ` min="${options.min}"` : ''}${options.max ? ` max="${options.max}"` : ''}${options.step ? ` step="${options.step}"` : ''}${options.list ? ` list="${options.list}"` : ''} />
      <label for="${id}">${label}</label>
    </div>
  `
}

function selectField(id: string, label: string, options: string, required = false): string {
  return `
    <div class="form-floating admission-field">
      <select id="${id}" class="form-select" aria-label="${label}"${required ? ' required' : ''}>${options}</select>
      <label for="${id}">${label}</label>
    </div>
  `
}

function textareaField(id: string, label: string, rows = 2): string {
  return `
    <div class="admission-field admission-field-wide">
      <label class="admission-field-label" for="${id}">${label}</label>
      <textarea id="${id}" class="form-control" rows="${rows}"></textarea>
    </div>
  `
}

function radioGroup(legend: string, name: string, values: string[], compact = false): string {
  return `
    <fieldset class="admission-radio-group ${compact ? 'admission-radio-group-compact' : ''}">
      <legend>${legend}</legend>
      <div class="admission-radio-options">
        ${values
          .map((value) => {
            const id = `${name}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            return `<label class="admission-radio-option" for="${id}"><input id="${id}" name="${name}" type="radio" value="${value}" /><span>${value}</span></label>`
          })
          .join('')}
      </div>
    </fieldset>
  `
}

function documentRows(): string {
  return admissionDocuments
    .map(
      (document) => `
        <article class="admission-upload-row" data-document-row="${document.id}">
          <div class="admission-upload-meta">
            <span class="admission-upload-icon" aria-hidden="true"><i class="bi bi-file-earmark-arrow-up"></i></span>
            <div><h4>${document.label}</h4><p>${document.note}</p></div>
          </div>
          <label class="admission-file-picker" for="admission-doc-${document.id}">
            <input id="admission-doc-${document.id}" type="file" accept="${document.accept}" data-document-input="${document.id}" />
            <span data-document-file-name="${document.id}">Choose file</span>
          </label>
          <div class="admission-upload-status-group">
            <span class="admission-upload-status is-pending" data-document-status="${document.id}">Pending</span>
            <span class="admission-upload-progress-track" aria-hidden="true"><span data-document-progress="${document.id}"></span></span>
          </div>
        </article>
      `,
    )
    .join('')
}

function reviewItem(label: string, id: string): string {
  return `<p><span>${label}</span><strong id="${id}">-</strong></p>`
}

export function renderadmission_registration_page(): string {
  const applicationId = generateApplicationId()

  return `
    <main class="admission-page admission-registration-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search admission details',
      })}

      <section class="admission-hero admission-registration-hero" style="--admission-cover-image: url('${coverImage}')">
        <div class="post-container admission-hero-inner">
          <div class="admission-hero-content">
            <h1 class="admission-hero-title">Online Admission / Registration</h1>
            <p class="admission-hero-subtitle">Complete your application, upload requirements, and prepare your portal account.</p>
          </div>
        </div>
      </section>

      ${renderRegistrationSteps()}

      <section class="admission-shell admission-registration-shell">
        <div class="post-container">
          <article id="admission-registration-intro" class="admission-registration-intro admission-registration-intro-final">
            <div>
              <h2 class="admission-registration-title" data-aos="fade-up">Online Application Form</h2>
              <p>Fill out each section accurately. Required fields must be completed before submission.</p>
            </div>
            <a class="admission-status-tracker-link" href="${ROUTES.ADMISSION_STATUS}"><i class="bi bi-search" aria-hidden="true"></i><span>Application Status Tracker</span></a>
          </article>

          <section id="admission-registration-step-1">
            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Application Information</h3></div><p>Application ID and date are generated automatically.</p></div>
              <div class="admission-registration-fields admission-registration-grid-4">
                ${field('admission-application-id', 'Application ID', { readonly: true })}
                ${field('admission-application-date', 'Application Date', { type: 'date', readonly: true })}
                ${selectField('admission-academic-year', 'Academic Year', `<option value="">Select academic year</option><option value="${currentYear}-${currentYear + 1}">${currentYear}-${currentYear + 1}</option><option value="${currentYear + 1}-${currentYear + 2}">${currentYear + 1}-${currentYear + 2}</option>`, true)}
                ${selectField('admission-semester', 'Semester', '<option value="">Select semester</option><option value="1st Semester">1st Semester</option><option value="2nd Semester">2nd Semester</option><option value="Summer">Summer</option>', true)}
              </div>
              ${radioGroup('Entry Type', 'admission-entry-type', ['Freshman', 'Transferee', 'Returnee', 'Cross-Enrollee'])}
            </article>

            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up" data-aos-delay="50">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Course Selection</h3></div><p>Second choice is optional.</p></div>
              <div class="admission-registration-fields admission-registration-grid-2">
                ${selectField('admission-primary-course', 'Course Applying For (Primary)', renderProgramOptions(), true)}
                ${selectField('admission-second-choice', 'Second Choice (optional)', renderProgramOptions())}
              </div>
            </article>

            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up" data-aos-delay="100">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Personal Information</h3></div><p>Age is computed from date of birth.</p></div>
              <div class="admission-registration-fields admission-registration-grid-4">
                ${field('admission-first-name', 'First Name', { autocomplete: 'given-name' })}
                ${field('admission-middle-name', 'Middle Name', { autocomplete: 'additional-name' })}
                ${field('admission-last-name', 'Last Name', { autocomplete: 'family-name' })}
                ${field('admission-birth-date', 'Date of Birth', { type: 'date' })}
                ${field('admission-age', 'Age', { type: 'number', readonly: true })}
                ${selectField('admission-gender', 'Gender', '<option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>', true)}
                ${field('admission-nationality', 'Nationality', { list: 'admission-nationality-options' })}
                ${selectField('admission-civil-status', 'Civil Status', '<option value="">Select status</option><option value="Single">Single</option><option value="Married">Married</option><option value="Widowed">Widowed</option><option value="Separated">Separated</option>', true)}
                ${field('admission-religion', 'Religion')}
              </div>
            </article>

            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up" data-aos-delay="150">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Contact Information</h3></div><p>Email is used as the login username.</p></div>
              <div class="admission-registration-fields admission-registration-grid-3">
                ${field('admission-contact-email', 'Email Address', { type: 'email', autocomplete: 'email' })}
                ${field('admission-contact-mobile', 'Mobile Number', { type: 'tel', autocomplete: 'tel' })}
                ${textareaField('admission-home-address', 'Home Address')}
                ${field('admission-barangay', 'Barangay', { list: 'admission-barangay-options' })}
                ${field('admission-city', 'Town / City', { list: 'admission-city-options' })}
                ${field('admission-province', 'Province', { list: 'admission-province-options' })}
              </div>
            </article>

            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up" data-aos-delay="200">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Parent / Guardian Information</h3></div><p>Used for admissions follow-up.</p></div>
              <div class="admission-registration-fields admission-registration-grid-3">
                ${field('admission-father-name', "Father's Name")}
                ${field('admission-mother-maiden-name', "Mother's Maiden Name")}
                ${field('admission-parent-contact', 'Parent / Guardian Contact Number', { type: 'tel' })}
              </div>
            </article>

            <article class="admission-registration-card admission-registration-card-final" data-aos="fade-up" data-aos-delay="250">
              <div class="admission-card-heading"><div><span>Step 1</span><h3>Emergency Contact</h3></div><p>Required for urgent coordination.</p></div>
              <div class="admission-registration-fields admission-registration-grid-3">
                ${field('admission-emergency-name', 'Full Name')}
                ${field('admission-emergency-relationship', 'Relationship')}
                ${field('admission-emergency-contact', 'Contact Number', { type: 'tel' })}
                ${textareaField('admission-emergency-address', 'Address')}
              </div>
            </article>
          </section>

          <section id="admission-registration-step-2" class="admission-registration-step-hidden">
            <article class="admission-registration-card admission-registration-card-final">
              <div class="admission-card-heading"><div><span>Step 2</span><h3>Educational Background</h3></div><p>Provide your senior high school or previous school details.</p></div>
              <div class="admission-registration-fields admission-registration-grid-2">
                ${field('admission-previous-school', 'Senior High School / Previous School')}
                ${selectField('admission-strand-track', 'Strand / Track', '<option value="">Select strand / track</option><option value="Science, Technology, Engineering and Mathematics (STEM)">Science, Technology, Engineering and Mathematics (STEM)</option><option value="Accountancy, Business and Management (ABM)">Accountancy, Business and Management (ABM)</option><option value="Humanities and Social Sciences (HUMSS)">Humanities and Social Sciences (HUMSS)</option><option value="General Academic Strand (GAS)">General Academic Strand (GAS)</option><option value="Technical-Vocational-Livelihood (TVL)">Technical-Vocational-Livelihood (TVL)</option><option value="Alternative Learning System / Other">Alternative Learning System / Other</option>', true)}
                ${textareaField('admission-school-address', 'School Address')}
                ${field('admission-year-graduated', 'Year Graduated', { type: 'number', min: '1970', max: String(currentYear + 1) })}
                ${field('admission-gpa', 'General Average / GPA', { type: 'number', min: '60', max: '100', step: '0.01' })}
              </div>
            </article>
          </section>

          <section id="admission-registration-step-3" class="admission-registration-step-hidden">
            <article class="admission-registration-card admission-registration-card-final">
              <div class="admission-card-heading"><div><span>Step 3</span><h3>Special Status</h3></div><p>These fields support accessibility and scholarship validation.</p></div>
              <div class="admission-registration-fields admission-registration-grid-2 admission-special-status-grid">
                ${radioGroup('Person with Disability (PWD)', 'admission-pwd', ['Yes', 'No'], true)}
                ${field('admission-pwd-specify', 'If yes, specify')}
                ${radioGroup('4Ps Beneficiary', 'admission-4ps', ['Yes', 'No'], true)}
              </div>
            </article>
            <article class="admission-registration-card admission-registration-card-final">
              <div class="admission-card-heading"><div><span>Step 3</span><h3>Account Setup</h3></div><p>Your email will be used as the portal username.</p></div>
              <div class="admission-registration-fields admission-registration-grid-3">
                ${field('admission-account-email', 'Email (used as username)', { type: 'email', autocomplete: 'username' })}
                ${field('admission-password', 'Password', { type: 'password', autocomplete: 'new-password' })}
                ${field('admission-confirm-password', 'Confirm Password', { type: 'password', autocomplete: 'new-password' })}
              </div>
            </article>
          </section>

          <section id="admission-registration-step-4" class="admission-registration-step-hidden">
            <article class="admission-registration-card admission-registration-card-final admission-upload-card">
              <div class="admission-card-heading"><div><span>Step 4</span><h3>Document Uploads</h3></div><p>Accepted formats: PDF, JPG, JPEG, PNG. Recommended maximum file size is 5MB.</p></div>
              <div class="admission-upload-summary">
                <div><strong id="admission-upload-count">0 of 5 documents uploaded</strong><span>Statuses: Pending / Uploaded / Verified</span></div>
                <div class="admission-upload-total-track" aria-hidden="true"><span id="admission-upload-total-progress"></span></div>
              </div>
              <div class="admission-upload-layout">
                <div class="admission-upload-list">${documentRows()}</div>
                <aside class="admission-photo-preview-card">
                  <div class="admission-photo-preview" id="admission-photo-preview"><i class="bi bi-person-bounding-box" aria-hidden="true"></i><span>2x2 photo preview</span></div>
                  <ul>
                    <li>Upload clear and readable documents.</li>
                    <li>TOR is required only for transferees.</li>
                    <li>Uploaded files will be reviewed by the registrar.</li>
                  </ul>
                </aside>
              </div>
            </article>
          </section>

          <section id="admission-registration-step-5" class="admission-registration-step-hidden">
            <article class="admission-registration-card admission-registration-card-final admission-review-card">
              <div class="admission-card-heading"><div><span>Step 5</span><h3>Review Your Application</h3></div><p>Please review all information before submitting.</p></div>
              <div class="admission-review-sections">
                <section><h4>Application Information</h4><div class="admission-details-grid admission-registration-review">
                  ${reviewItem('Application ID', 'admission-review-application-id')}
                  ${reviewItem('Application Date', 'admission-review-application-date')}
                  ${reviewItem('Academic Year', 'admission-review-academic-year')}
                  ${reviewItem('Semester', 'admission-review-semester')}
                  ${reviewItem('Entry Type', 'admission-review-entry-type')}
                  ${reviewItem('Course Applying For', 'admission-review-primary-course')}
                  ${reviewItem('Second Choice', 'admission-review-second-choice')}
                </div></section>
                <section><h4>Personal & Contact Information</h4><div class="admission-details-grid admission-registration-review">
                  ${reviewItem('Name', 'admission-review-name')}
                  ${reviewItem('Birth Date / Age', 'admission-review-birth-age')}
                  ${reviewItem('Gender', 'admission-review-gender')}
                  ${reviewItem('Nationality', 'admission-review-nationality')}
                  ${reviewItem('Civil Status / Religion', 'admission-review-civil-religion')}
                  ${reviewItem('Email', 'admission-review-email')}
                  ${reviewItem('Mobile Number', 'admission-review-mobile')}
                  ${reviewItem('Address', 'admission-review-address')}
                </div></section>
                <section><h4>Family & Emergency Contact</h4><div class="admission-details-grid admission-registration-review">
                  ${reviewItem("Father's Name", 'admission-review-father')}
                  ${reviewItem("Mother's Maiden Name", 'admission-review-mother')}
                  ${reviewItem('Parent / Guardian Contact', 'admission-review-parent-contact')}
                  ${reviewItem('Emergency Contact', 'admission-review-emergency')}
                  ${reviewItem('Emergency Address', 'admission-review-emergency-address')}
                </div></section>
                <section><h4>Education & Special Status</h4><div class="admission-details-grid admission-registration-review">
                  ${reviewItem('Previous School', 'admission-review-school')}
                  ${reviewItem('Strand / Track', 'admission-review-strand')}
                  ${reviewItem('School Address', 'admission-review-school-address')}
                  ${reviewItem('Year Graduated', 'admission-review-year-graduated')}
                  ${reviewItem('General Average / GPA', 'admission-review-gpa')}
                  ${reviewItem('PWD Status', 'admission-review-pwd')}
                  ${reviewItem('4Ps Beneficiary', 'admission-review-4ps')}
                </div></section>
                <section><h4>Documents & Account</h4><div class="admission-details-grid admission-registration-review">
                  ${reviewItem('Document Status', 'admission-review-documents')}
                  ${reviewItem('Portal Username', 'admission-review-account-email')}
                  ${reviewItem('Application Status', 'admission-review-status')}
                </div></section>
              </div>
            </article>
            <article class="admission-registration-card admission-registration-card-final admission-agreement-card">
              <div class="admission-card-heading"><div><span>Step 5</span><h3>Agreements & Consent</h3></div><p>Submission requires confirmation and consent.</p></div>
              <label class="admission-consent-option" for="admission-agreement-certify"><input id="admission-agreement-certify" type="checkbox" /><span>I certify that all information is true and correct.</span></label>
              <label class="admission-consent-option" for="admission-agreement-policies"><input id="admission-agreement-policies" type="checkbox" /><span>I agree to the school's policies.</span></label>
              <label class="admission-consent-option" for="admission-agreement-privacy"><input id="admission-agreement-privacy" type="checkbox" /><span>I consent to the collection and processing of my data in accordance with the Data Privacy Act.</span></label>
            </article>
          </section>

          <section id="admission-registration-step-6" class="admission-registration-step-hidden">
            <article class="admission-registration-finish-card admission-registration-finish-card-final">
              <div class="admission-registration-success-check" aria-hidden="true">
                <svg viewBox="0 0 120 120" role="presentation"><circle class="admission-success-check-circle" cx="60" cy="60" r="48" /><path class="admission-success-check-mark" d="M36 62l16 16 32-32" /></svg>
              </div>
              <h3>Application Submitted!</h3>
              <p class="admission-registration-finish-copy">Thank you. Your application has been submitted successfully.</p>
              <div class="admission-submitted-id-card"><span>Application ID</span><strong id="admission-submitted-application-id">${applicationId}</strong></div>
              <p class="admission-submitted-status-note">You can track your application status from the admissions status page.</p>
              <a class="admission-registration-dashboard-link" href="${ROUTES.ADMISSION_STATUS}"><span>Track Application</span></a>
            </article>
          </section>

          <div class="admission-registration-actions admission-registration-actions-final">
            <button type="button" class="admission-registration-nav-button admission-registration-step-hidden" id="admission-registration-back"><i class="bi bi-chevron-left" aria-hidden="true"></i> Previous</button>
            <button type="button" class="admission-registration-nav-button" id="admission-registration-save-draft">Save as Draft</button>
            <button type="button" class="admission-registration-next-step" id="admission-registration-next">Next <i class="bi bi-chevron-right" aria-hidden="true"></i></button>
            <button type="button" class="admission-registration-next-step admission-registration-submit-button admission-registration-step-hidden" id="admission-registration-submit">Submit Application <i class="bi bi-send" aria-hidden="true"></i></button>
          </div>
          <p id="admission-registration-message" class="admission-registration-message" role="status" aria-live="polite"></p>
        </div>
      </section>

      <datalist id="admission-nationality-options"><option value="Filipino"></option><option value="Dual Citizen"></option><option value="Foreign National"></option></datalist>
      <datalist id="admission-barangay-options"><option value="Poblacion"></option><option value="San Jose"></option><option value="San Vicente"></option><option value="Lucap"></option><option value="Magsaysay"></option></datalist>
      <datalist id="admission-city-options"><option value="Alaminos City"></option><option value="Bolinao"></option><option value="Bani"></option><option value="Anda"></option><option value="Lingayen"></option></datalist>
      <datalist id="admission-province-options"><option value="Pangasinan"></option><option value="La Union"></option><option value="Zambales"></option><option value="Tarlac"></option></datalist>

      ${renderMainSiteFooter()}
    </main>
  `
}

const setMessage = (el: HTMLElement | null, message: string, isError = false): void => {
  if (!el) return
  el.textContent = message
  el.classList.toggle('is-error', isError)
}

function enableFullDateInputClick(input: HTMLInputElement): () => void {
  const openDatePicker = (): void => {
    const dateInput = input as HTMLInputElement & { showPicker?: () => void }
    if (typeof dateInput.showPicker !== 'function') return
    try {
      dateInput.showPicker()
    } catch {
      // Browsers can block programmatic picker opens outside trusted gestures.
    }
  }
  input.addEventListener('click', openDatePicker)
  return () => input.removeEventListener('click', openDatePicker)
}

function computeAge(dateValue: string): number | null {
  if (!dateValue) return null
  const birthDate = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(birthDate.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hadBirthday = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
  if (!hadBirthday) age -= 1
  return age >= 0 ? age : null
}

function splitFullName(fullName: string): { firstName: string; midName?: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], midName: parts.length > 2 ? parts.slice(1, -1).join(' ') : undefined, lastName: parts[parts.length - 1] }
}

function backendAdmissionType(entryType: string): string {
  if (entryType === 'Freshman') return 'Freshmen'
  if (entryType === 'Transferee') return 'Transferee'
  return 'N/A'
}

function displayDate(dateValue: string): string {
  if (!dateValue) return '-'
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateValue
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

export function setupadmission_registration_page(root: HTMLElement): () => void {
  const introSection = root.querySelector<HTMLElement>('#admission-registration-intro')
  const sections = [1, 2, 3, 4, 5, 6].map((step) => root.querySelector<HTMLElement>(`#admission-registration-step-${step}`))
  const timelineItems = Array.from(root.querySelectorAll<HTMLElement>('.admission-stepper-item'))
  const stepperList = root.querySelector<HTMLOListElement>('.admission-stepper-list')
  const stepsSection = root.querySelector<HTMLElement>('.admission-registration-steps')
  const timelineMobileLabel = root.querySelector<HTMLElement>('#admission-stepper-mobile-label')
  const backButton = root.querySelector<HTMLButtonElement>('#admission-registration-back')
  const nextButton = root.querySelector<HTMLButtonElement>('#admission-registration-next')
  const submitButton = root.querySelector<HTMLButtonElement>('#admission-registration-submit')
  const saveDraftButton = root.querySelector<HTMLButtonElement>('#admission-registration-save-draft')
  const messageEl = root.querySelector<HTMLElement>('#admission-registration-message')
  const finishCheck = root.querySelector<HTMLElement>('.admission-registration-success-check')
  const submittedApplicationId = root.querySelector<HTMLElement>('#admission-submitted-application-id')
  const birthDateInput = root.querySelector<HTMLInputElement>('#admission-birth-date')
  const ageInput = root.querySelector<HTMLInputElement>('#admission-age')
  const contactEmailInput = root.querySelector<HTMLInputElement>('#admission-contact-email')
  const accountEmailInput = root.querySelector<HTMLInputElement>('#admission-account-email')
  const pwdSpecifyInput = root.querySelector<HTMLInputElement>('#admission-pwd-specify')

  if (
    !introSection ||
    sections.some((section) => !section) ||
    !timelineMobileLabel ||
    !backButton ||
    !nextButton ||
    !submitButton ||
    !saveDraftButton ||
    !finishCheck ||
    !submittedApplicationId ||
    !birthDateInput ||
    !ageInput ||
    !contactEmailInput ||
    !accountEmailInput ||
    !pwdSpecifyInput
  ) {
    return () => {}
  }

  const stepSections = sections as HTMLElement[]
  let currentStep: RegistrationStep = 1
  let photoPreviewUrl: string | null = null
  let photoPreviewKey = ''
  let accountEmailTouched = false
  const cleanupBirthDateClick = enableFullDateInputClick(birthDateInput)

  const getField = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(id: string): T | null => root.querySelector<T>(`#${id}`)
  const getValue = (id: string): string => getField(id)?.value.trim() ?? ''
  const setValue = (id: string, value: string): void => {
    const target = getField(id)
    if (target) target.value = value
  }
  const getRadioValue = (name: string): string => root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? ''
  const setRadioValue = (name: string, value: string): void => {
    const target = root.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`)
    if (target) target.checked = true
  }
  const isChecked = (id: string): boolean => Boolean(root.querySelector<HTMLInputElement>(`#${id}`)?.checked)
  const areFieldsComplete = (ids: string[]): boolean => ids.every((id) => Boolean(getValue(id)))
  const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const documentStatus = (id: string): 'Pending' | 'Uploaded' => (root.querySelector<HTMLInputElement>(`#admission-doc-${id}`)?.files?.length ? 'Uploaded' : 'Pending')
  const requiredDocuments = (): AdmissionDocument[] => admissionDocuments.filter((document) => document.requiredFor === 'all' || getRadioValue('admission-entry-type') === 'Transferee')

  const requiredStep1Fields = [
    'admission-academic-year',
    'admission-semester',
    'admission-primary-course',
    'admission-first-name',
    'admission-last-name',
    'admission-birth-date',
    'admission-gender',
    'admission-nationality',
    'admission-civil-status',
    'admission-religion',
    'admission-contact-email',
    'admission-contact-mobile',
    'admission-home-address',
    'admission-barangay',
    'admission-city',
    'admission-province',
    'admission-father-name',
    'admission-mother-maiden-name',
    'admission-parent-contact',
    'admission-emergency-name',
    'admission-emergency-relationship',
    'admission-emergency-contact',
    'admission-emergency-address',
  ]
  const requiredStep2Fields = ['admission-previous-school', 'admission-strand-track', 'admission-school-address', 'admission-year-graduated', 'admission-gpa']

  const updateAge = (): void => {
    const age = computeAge(birthDateInput.value)
    ageInput.value = age === null ? '' : String(age)
  }

  const updatePwdSpecifyState = (): void => {
    const isPwd = getRadioValue('admission-pwd') === 'Yes'
    pwdSpecifyInput.disabled = !isPwd
    pwdSpecifyInput.closest('.admission-field')?.classList.toggle('is-disabled', !isPwd)
    if (!isPwd) pwdSpecifyInput.value = ''
  }

  const updatePhotoPreview = (): void => {
    const input = root.querySelector<HTMLInputElement>('#admission-doc-id-picture')
    const preview = root.querySelector<HTMLElement>('#admission-photo-preview')
    const file = input?.files?.[0]
    const nextKey = file ? `${file.name}:${file.size}:${file.lastModified}` : ''
    if (!preview || nextKey === photoPreviewKey) return
    photoPreviewKey = nextKey
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    photoPreviewUrl = null
    if (!file || !file.type.startsWith('image/')) {
      preview.innerHTML = '<i class="bi bi-person-bounding-box" aria-hidden="true"></i><span>2x2 photo preview</span>'
      preview.classList.remove('has-image')
      return
    }
    photoPreviewUrl = URL.createObjectURL(file)
    preview.innerHTML = `<img src="${photoPreviewUrl}" alt="2x2 ID picture preview" />`
    preview.classList.add('has-image')
  }

  const updateDocumentRows = (): void => {
    let uploadedCount = 0
    admissionDocuments.forEach((document) => {
      const row = root.querySelector<HTMLElement>(`[data-document-row="${document.id}"]`)
      const input = root.querySelector<HTMLInputElement>(`#admission-doc-${document.id}`)
      const status = root.querySelector<HTMLElement>(`[data-document-status="${document.id}"]`)
      const fileName = root.querySelector<HTMLElement>(`[data-document-file-name="${document.id}"]`)
      const progress = root.querySelector<HTMLElement>(`[data-document-progress="${document.id}"]`)
      const isRequired = document.requiredFor === 'all' || getRadioValue('admission-entry-type') === 'Transferee'
      const hasFile = Boolean(input?.files?.length)
      row?.classList.toggle('is-optional', !isRequired)
      row?.classList.toggle('is-uploaded', hasFile)
      if (status) {
        status.textContent = hasFile ? 'Uploaded' : 'Pending'
        status.classList.toggle('is-uploaded', hasFile)
        status.classList.toggle('is-pending', !hasFile)
      }
      if (fileName) fileName.textContent = input?.files?.[0]?.name ?? (isRequired ? 'Choose file' : 'Optional upload')
      if (progress) progress.style.width = hasFile ? '100%' : '0%'
      if (hasFile) uploadedCount += 1
    })
    const uploadCount = root.querySelector<HTMLElement>('#admission-upload-count')
    const totalProgress = root.querySelector<HTMLElement>('#admission-upload-total-progress')
    if (uploadCount) uploadCount.textContent = `${uploadedCount} of ${admissionDocuments.length} documents uploaded`
    if (totalProgress) totalProgress.style.width = `${Math.round((uploadedCount / admissionDocuments.length) * 100)}%`
  }

  const currentStepComplete = (): boolean => {
    if (currentStep === 1) return Boolean(getRadioValue('admission-entry-type')) && areFieldsComplete(requiredStep1Fields)
    if (currentStep === 2) return areFieldsComplete(requiredStep2Fields)
    if (currentStep === 3) {
      const pwd = getRadioValue('admission-pwd')
      return Boolean(pwd && (pwd !== 'Yes' || getValue('admission-pwd-specify')) && getRadioValue('admission-4ps') && getValue('admission-account-email') && getValue('admission-password') && getValue('admission-confirm-password'))
    }
    if (currentStep === 4) return requiredDocuments().every((document) => documentStatus(document.id) === 'Uploaded')
    if (currentStep === 5) return agreementIds.every((id) => isChecked(id))
    return true
  }

  const updateActionState = (): void => {
    const finished = currentStep === 6
    backButton.classList.toggle('admission-registration-step-hidden', currentStep === 1 || finished)
    saveDraftButton.classList.toggle('admission-registration-step-hidden', finished)
    nextButton.classList.toggle('admission-registration-step-hidden', currentStep >= 5)
    submitButton.classList.toggle('admission-registration-step-hidden', currentStep !== 5)
    nextButton.disabled = currentStep < 5 && !currentStepComplete()
    submitButton.disabled = currentStep === 5 && !currentStepComplete()
    nextButton.innerHTML = `${currentStep === 4 ? 'Review Application' : 'Next'} <i class="bi bi-chevron-right" aria-hidden="true"></i>`
  }

  const scrollToStep = (step: RegistrationStep): void => {
    const target = step === 6 ? stepSections[5] : stepsSection ?? stepSections[step - 1]
    window.requestAnimationFrame(() => {
      const header = document.querySelector<HTMLElement>('.main-site-header')
      const offset = header ? header.getBoundingClientRect().height : 0
      const top = window.scrollY + target.getBoundingClientRect().top - offset - 62
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
    })
  }

  const setReviewText = (id: string, value: string): void => {
    const target = root.querySelector<HTMLElement>(`#${id}`)
    if (target) target.textContent = value || '-'
  }

  const fullAddress = (): string => [getValue('admission-home-address'), getValue('admission-barangay'), getValue('admission-city'), getValue('admission-province')].filter(Boolean).join(', ')

  const populateReview = (): void => {
    const middleName = getValue('admission-middle-name')
    const fullName = `${getValue('admission-first-name')} ${middleName ? `${middleName} ` : ''}${getValue('admission-last-name')}`.trim()
    const age = computeAge(getValue('admission-birth-date'))
    const pwd = getRadioValue('admission-pwd')
    const docs = admissionDocuments.map((document) => `${document.label}: ${documentStatus(document.id)}`).join(' | ')
    setReviewText('admission-review-application-id', getValue('admission-application-id'))
    setReviewText('admission-review-application-date', displayDate(getValue('admission-application-date')))
    setReviewText('admission-review-academic-year', getValue('admission-academic-year'))
    setReviewText('admission-review-semester', getValue('admission-semester'))
    setReviewText('admission-review-entry-type', getRadioValue('admission-entry-type'))
    setReviewText('admission-review-primary-course', getValue('admission-primary-course'))
    setReviewText('admission-review-second-choice', getValue('admission-second-choice') || 'None')
    setReviewText('admission-review-name', fullName)
    setReviewText('admission-review-birth-age', `${displayDate(getValue('admission-birth-date'))} / ${age ?? '-'} years old`)
    setReviewText('admission-review-gender', getValue('admission-gender'))
    setReviewText('admission-review-nationality', getValue('admission-nationality'))
    setReviewText('admission-review-civil-religion', `${getValue('admission-civil-status')} / ${getValue('admission-religion')}`)
    setReviewText('admission-review-email', getValue('admission-contact-email'))
    setReviewText('admission-review-mobile', getValue('admission-contact-mobile'))
    setReviewText('admission-review-address', fullAddress())
    setReviewText('admission-review-father', getValue('admission-father-name'))
    setReviewText('admission-review-mother', getValue('admission-mother-maiden-name'))
    setReviewText('admission-review-parent-contact', getValue('admission-parent-contact'))
    setReviewText('admission-review-emergency', `${getValue('admission-emergency-name')} (${getValue('admission-emergency-relationship')}) - ${getValue('admission-emergency-contact')}`)
    setReviewText('admission-review-emergency-address', getValue('admission-emergency-address'))
    setReviewText('admission-review-school', getValue('admission-previous-school'))
    setReviewText('admission-review-strand', getValue('admission-strand-track'))
    setReviewText('admission-review-school-address', getValue('admission-school-address'))
    setReviewText('admission-review-year-graduated', getValue('admission-year-graduated'))
    setReviewText('admission-review-gpa', getValue('admission-gpa'))
    setReviewText('admission-review-pwd', pwd === 'Yes' ? `Yes - ${getValue('admission-pwd-specify')}` : pwd)
    setReviewText('admission-review-4ps', getRadioValue('admission-4ps'))
    setReviewText('admission-review-documents', docs)
    setReviewText('admission-review-account-email', getValue('admission-account-email'))
    setReviewText('admission-review-status', 'Pending')
  }

  const setStep = (step: RegistrationStep, shouldScroll = true): void => {
    currentStep = step
    stepSections.forEach((section, index) => section.classList.toggle('admission-registration-step-hidden', index + 1 !== step))
    introSection.classList.toggle('admission-registration-step-hidden', step === 6)
    const timelineStep = Math.min(step, 5)
    timelineItems.forEach((item) => {
      const itemStep = Number(item.dataset.stepIndex)
      item.classList.toggle('is-active', step !== 6 && itemStep === timelineStep - 1)
      item.classList.toggle('is-completed', step === 6 || itemStep < timelineStep - 1)
    })
    stepperList?.style.setProperty('--admission-stepper-progress', String(step === 6 ? 1 : (timelineStep - 1) / (registrationStepLabels.length - 1)))
    timelineMobileLabel.textContent = step === 6 ? 'Application Submitted' : registrationStepLabels[timelineStep - 1]
    updateDocumentRows()
    updateActionState()
    if (step === 5) populateReview()
    if (step === 6) {
      finishCheck.classList.remove('is-animate')
      void finishCheck.offsetWidth
      finishCheck.classList.add('is-animate')
      submittedApplicationId.textContent = getValue('admission-application-id')
      try {
        localStorage.removeItem(draftKey)
      } catch {
        // Draft cleanup should not block the success state.
      }
    }
    if (shouldScroll) scrollToStep(step)
  }

  const validateStep1 = (): boolean => {
    if (!getRadioValue('admission-entry-type') || !areFieldsComplete(requiredStep1Fields)) {
      setMessage(messageEl, 'Complete all required application, course, personal, contact, guardian, and emergency fields.', true)
      return false
    }
    if (!isValidEmail(getValue('admission-contact-email'))) {
      setMessage(messageEl, 'Enter a valid email address.', true)
      return false
    }
    if (computeAge(getValue('admission-birth-date')) === null) {
      setMessage(messageEl, 'Enter a valid date of birth.', true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const validateStep2 = (): boolean => {
    const year = Number(getValue('admission-year-graduated'))
    const gpa = Number(getValue('admission-gpa'))
    if (!areFieldsComplete(requiredStep2Fields)) {
      setMessage(messageEl, 'Complete all required educational background fields.', true)
      return false
    }
    if (!Number.isFinite(year) || year < 1970 || year > currentYear + 1) {
      setMessage(messageEl, 'Enter a valid year graduated.', true)
      return false
    }
    if (!Number.isFinite(gpa) || gpa < 60 || gpa > 100) {
      setMessage(messageEl, 'Enter a valid general average or GPA from 60 to 100.', true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const validateStep3 = (): boolean => {
    const pwd = getRadioValue('admission-pwd')
    const password = getValue('admission-password')
    const confirmPassword = getValue('admission-confirm-password')
    if (!pwd || !getRadioValue('admission-4ps')) {
      setMessage(messageEl, 'Answer the PWD and 4Ps beneficiary questions.', true)
      return false
    }
    if (pwd === 'Yes' && !getValue('admission-pwd-specify')) {
      setMessage(messageEl, 'Specify the PWD details.', true)
      return false
    }
    if (!isValidEmail(getValue('admission-account-email'))) {
      setMessage(messageEl, 'Enter a valid portal account email.', true)
      return false
    }
    if (password.length < 8) {
      setMessage(messageEl, 'Password must be at least 8 characters.', true)
      return false
    }
    if (password !== confirmPassword) {
      setMessage(messageEl, 'Password and confirm password must match.', true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const validateStep4 = (): boolean => {
    const missing = requiredDocuments().find((document) => documentStatus(document.id) === 'Pending')
    if (missing) {
      setMessage(messageEl, `Upload required document: ${missing.label}.`, true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const validateStep5 = (): boolean => {
    if (!agreementIds.every((id) => isChecked(id))) {
      setMessage(messageEl, 'Confirm all agreements and consent items before submitting.', true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const saveDraft = (): void => {
    const fields = Object.fromEntries(draftFieldIds.map((id) => [id, getValue(id)]))
    const agreements = Object.fromEntries(agreementIds.map((id) => [id, isChecked(id)]))
    const draft = {
      fields,
      agreements,
      radios: {
        entryType: getRadioValue('admission-entry-type'),
        pwd: getRadioValue('admission-pwd'),
        fourPs: getRadioValue('admission-4ps'),
      },
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft))
      setMessage(messageEl, 'Draft saved on this device. Uploaded files and passwords are not stored for security.')
    } catch {
      setMessage(messageEl, 'Unable to save draft on this device.', true)
    }
  }

  const loadDraft = (): void => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (!raw) return
      const draft = JSON.parse(raw) as {
        fields?: Record<string, string>
        agreements?: Record<string, boolean>
        radios?: { entryType?: string; pwd?: string; fourPs?: string }
      }
      Object.entries(draft.fields ?? {}).forEach(([id, value]) => setValue(id, value))
      Object.entries(draft.agreements ?? {}).forEach(([id, checked]) => {
        const checkbox = root.querySelector<HTMLInputElement>(`#${id}`)
        if (checkbox) checkbox.checked = checked
      })
      if (draft.radios?.entryType) setRadioValue('admission-entry-type', draft.radios.entryType)
      if (draft.radios?.pwd) setRadioValue('admission-pwd', draft.radios.pwd)
      if (draft.radios?.fourPs) setRadioValue('admission-4ps', draft.radios.fourPs)
      setMessage(messageEl, 'Draft loaded from this device.')
    } catch {
      setMessage(messageEl, 'Saved draft could not be loaded.', true)
    }
  }

  const submitApplication = async (): Promise<void> => {
    if (!validateStep5()) return
    const emergencyName = splitFullName(getValue('admission-emergency-name'))
    setMessage(messageEl, 'Submitting application...')
    submitButton.disabled = true

    try {
      await createRegistrationStudent({
        admission_type: backendAdmissionType(getRadioValue('admission-entry-type')),
        program_name: getValue('admission-primary-course'),
        prev_program: getValue('admission-second-choice') || undefined,
        first_name: getValue('admission-first-name'),
        mid_name: getValue('admission-middle-name') || undefined,
        last_name: getValue('admission-last-name'),
        gender: getValue('admission-gender'),
        birth_date: getValue('admission-birth-date'),
        personal_contact: {
          email: getValue('admission-contact-email'),
          mobile: getValue('admission-contact-mobile'),
        },
        emergency_contact: {
          first_name: emergencyName.firstName,
          mid_name: emergencyName.midName,
          last_name: emergencyName.lastName,
          mobile: getValue('admission-emergency-contact'),
        },
        current_address: {
          street: getValue('admission-home-address'),
          barangay: getValue('admission-barangay'),
          city: getValue('admission-city'),
          province: getValue('admission-province'),
          postal_code: '0000',
        },
        permanent_address: {
          street: getValue('admission-home-address'),
          barangay: getValue('admission-barangay'),
          city: getValue('admission-city'),
          province: getValue('admission-province'),
          postal_code: '0000',
        },
        registration_status: 'Pending',
      })
      setMessage(messageEl, '')
      setStep(6)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit application.'
      setMessage(messageEl, message, true)
    } finally {
      if (currentStep !== 6) {
        submitButton.disabled = false
        updateActionState()
      }
    }
  }

  const handleNextClick = (): void => {
    if (currentStep === 1 && validateStep1()) return setStep(2)
    if (currentStep === 2 && validateStep2()) return setStep(3)
    if (currentStep === 3 && validateStep3()) return setStep(4)
    if (currentStep === 4 && validateStep4()) return setStep(5)
  }

  const handleBackClick = (): void => {
    if (currentStep > 1 && currentStep < 6) {
      setStep((currentStep - 1) as RegistrationStep)
      setMessage(messageEl, '')
    }
  }

  const syncState = (): void => {
    updateAge()
    updatePwdSpecifyState()
    updateDocumentRows()
    updatePhotoPreview()
    updateActionState()
  }

  const handleContactEmailInput = (): void => {
    if (!accountEmailTouched || !accountEmailInput.value.trim()) accountEmailInput.value = contactEmailInput.value.trim()
    syncState()
  }

  const handleAccountEmailInput = (): void => {
    accountEmailTouched = true
  }

  const handleSubmitClick = (): void => {
    void submitApplication()
  }

  const watchedInputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'))
  watchedInputs.forEach((input) => {
    input.addEventListener('change', syncState)
    input.addEventListener('input', syncState)
  })
  contactEmailInput.addEventListener('input', handleContactEmailInput)
  accountEmailInput.addEventListener('input', handleAccountEmailInput)
  nextButton.addEventListener('click', handleNextClick)
  backButton.addEventListener('click', handleBackClick)
  submitButton.addEventListener('click', handleSubmitClick)
  saveDraftButton.addEventListener('click', saveDraft)

  setValue('admission-application-id', getValue('admission-application-id') || generateApplicationId())
  setValue('admission-application-date', getValue('admission-application-date') || localDateValue())
  loadDraft()
  updateAge()
  updatePwdSpecifyState()
  updateDocumentRows()
  setStep(1, false)

  return () => {
    watchedInputs.forEach((input) => {
      input.removeEventListener('change', syncState)
      input.removeEventListener('input', syncState)
    })
    contactEmailInput.removeEventListener('input', handleContactEmailInput)
    accountEmailInput.removeEventListener('input', handleAccountEmailInput)
    nextButton.removeEventListener('click', handleNextClick)
    backButton.removeEventListener('click', handleBackClick)
    submitButton.removeEventListener('click', handleSubmitClick)
    saveDraftButton.removeEventListener('click', saveDraft)
    cleanupBirthDateClick()
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
  }
}
