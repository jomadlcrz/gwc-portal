import '../../styles/admission.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/cover.avif'
const admissionCoverPeopleImage = '/images/admission_cover.png'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'
import { renderSharedModal, setupSharedModal } from '../../components/ui/modal'
import { renderAdminSectionTitle } from '../../components/ui/section_title_heading'
import { type AdmissionApplication } from '../../data/admission'
import { admissionService } from '../../features/admission/service'

type AdmissionSection = 'requirements' | 'status' | 'contact'

function renderAdmissionTabs(active: AdmissionSection): string {
  return `
    <nav class="admission-tabs" aria-label="Admission sections">
      <a href="${ROUTES.ADMISSION}" class="admission-tab ${active === 'requirements' ? 'is-active' : ''}"><i class="bi bi-card-checklist" aria-hidden="true"></i><span>Requirements</span></a>
      <a href="${ROUTES.ADMISSION_STATUS}" class="admission-tab ${active === 'status' ? 'is-active' : ''}"><i class="bi bi-patch-check" aria-hidden="true"></i><span>Application Status</span></a>
      <a href="${ROUTES.ADMISSION_CONTACT}" class="admission-tab ${active === 'contact' ? 'is-active' : ''}"><i class="bi bi-telephone" aria-hidden="true"></i><span>Contact Us</span></a>
    </nav>
  `
}

function renderApplicationCard(application: AdmissionApplication): string {
  const fullName = `${application.lastName.toUpperCase()}, ${application.firstName.toUpperCase()}${application.middleName ? ` ${application.middleName.toUpperCase()}` : ''}`

  return `
    <article class="admission-result-row">
      <div>
        <h4>${fullName}</h4>
        <p class="admission-result-year">${application.schoolYear}</p>
      </div>
      <p class="admission-result-campus">${application.campus}</p>
      <a class="admission-view-status-btn" href="${ROUTES.ADMISSION_STATUS}/verify/${encodeURIComponent(application.applicationNo)}">
        View Status
      </a>
    </article>
  `
}

function formatProgramName(program: string): string {
  const normalized = program.trim().toLowerCase()
  const fullProgramByAlias: Record<string, string> = {
    'bs criminology': 'Bachelor of Science in Criminology',
    'bs information technology': 'Bachelor of Science in Information Technology',
    bsit: 'Bachelor of Science in Information Technology',
    'bs computer science': 'Bachelor of Science in Computer Science',
    bscs: 'Bachelor of Science in Computer Science',
    'bs business administration': 'Bachelor of Science in Business Administration',
    bsba: 'Bachelor of Science in Business Administration',
  }

  return fullProgramByAlias[normalized] ?? program
}

function getAdmissionRequirementReminders(admissionType: string): string[] {
  const normalizedType = admissionType.trim().toLowerCase()
  if (normalizedType.includes('transferee')) {
    return [
      'Transfer Credentials',
      'Good Moral Certificate',
      'Photocopy of Marriage Contract (For Married: Female Only)',
      'Birth Certificate Copy',
      '2 pcs. 2x2 Picture with Name Tag and White Background',
    ]
  }

  return [
    'Original Form 138',
    'Good Moral Certificate',
    'PSA Birth Certificate Copy',
    '2 pcs. 2x2 Picture with Name Tag and White Background',
  ]
}

function getAdmissionStatusBadgeClass(status: AdmissionApplication['status']): string {
  if (status === 'Approved') return 'is-approved'
  if (status === 'Not Selected') return 'is-rejected'
  if (status === 'Under Review') return 'is-pending'
  return 'is-pending'
}

function renderAdmissionStatusAction(status: AdmissionApplication['status']): string {
  if (status === 'Approved') {
    return '<a class="admission-view-status-btn admission-details-reminder-btn" href="#reminders">Please Check Reminders</a>'
  }

  return `<p class="admission-details-badge ${getAdmissionStatusBadgeClass(status)}">${status}</p>`
}

function formatBirthDateForInput(value: string): string | null {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function enableFullDateInputClick(input: HTMLInputElement): () => void {
  const openDatePicker = (): void => {
    const dateInput = input as HTMLInputElement & { showPicker?: () => void }
    if (typeof dateInput.showPicker !== 'function') return
    try {
      dateInput.showPicker()
    } catch {
      // Ignore browsers that block programmatic picker open in some cases.
    }
  }

  input.addEventListener('click', openDatePicker)

  return () => {
    input.removeEventListener('click', openDatePicker)
  }
}

function renderAdmissionVerificationContent(applicationNo: string): string {
  const application = admissionService.findByApplicationNo(applicationNo)

  if (!application) {
    return `
      <article class="admission-section-card admission-section-card-status">
        <header class="admission-subhead">
          <h3 class="admin-section-title admission-section-title">Verification</h3>
        </header>
        <section class="admission-content-block">
          <p class="admission-status-message">Application record not found.</p>
          <a class="admission-view-status-btn admission-back-link" href="${ROUTES.ADMISSION_STATUS}">Back to Search</a>
        </section>
      </article>
    `
  }

  return `
    <article class="admission-detail-section">
      <header class="admission-detail-heading">
        ${renderAdminSectionTitle('Verification')}
      </header>
      <section class="admission-section-card admission-section-card-no-margin admission-section-card-status">
        <div class="admission-content-block admission-verify-panel">
          <div class="admission-verify-row">
            <span class="admission-verify-label">Student's Name:</span>
            <strong class="admission-verify-value">${application.lastName.toUpperCase()}, ${application.firstName.toUpperCase()}${application.middleName ? ` ${application.middleName.toUpperCase()}` : ''}</strong>
          </div>
          <div class="admission-verify-row">
            <span class="admission-verify-label">Campus:</span>
            <strong class="admission-verify-value">${application.campus}</strong>
          </div>
          <div class="admission-verify-row admission-verify-row-input">
            <label class="admission-verify-label" for="status-birthdate-verify">Birthday:</label>
            <input id="status-birthdate-verify" type="date" />
          </div>
          <div class="admission-verify-actions">
            <button id="status-verify-submit" type="button" data-application-no="${application.applicationNo}">Verify</button>
          </div>
        </div>
        <div id="status-verify-message" class="admission-status-results" aria-live="polite"></div>
      </section>
    </article>
  `
}

function renderAdmissionStatusDetailsContent(applicationNo: string): string {
  const application = admissionService.findByApplicationNo(applicationNo)

  if (!application) {
    return `
      <article class="admission-section-card admission-section-card-status">
        <header class="admission-subhead">
          <h3 class="admin-section-title admission-section-title">Admission Details</h3>
        </header>
        <section class="admission-content-block">
          <p class="admission-status-message">Application record not found.</p>
          <a class="admission-view-status-btn admission-back-link" href="${ROUTES.ADMISSION_STATUS}">Back to Search</a>
        </section>
      </article>
    `
  }

  const fullName = `${application.lastName.toUpperCase()}, ${application.firstName.toUpperCase()}${application.middleName ? ` ${application.middleName.toUpperCase()}` : ''}`
  const requirementReminders = getAdmissionRequirementReminders(application.admissionType)

  return `
    <article class="admission-details-page-shell">
      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Admission Details')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-header">
            <p class="admission-details-name"><span>Applicant Name:</span> ${fullName}</p>
            ${renderAdmissionStatusAction(application.status)}
          </div>
          <div class="admission-details-grid">
            <p><span>Campus</span><strong>${application.campus}</strong></p>
            <p><span>Admission</span><strong>${application.admissionType}</strong></p>
            <p><span>Program</span><strong>${formatProgramName(application.program || application.courseFirstChoice)}</strong></p>
            <p><span>Date Submitted</span><strong>${application.submittedAt}</strong></p>
          </div>
        </div>
      </section>

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Personal Information')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-grid">
            <p><span>Address</span><strong>${application.personalInfo.address}</strong></p>
            <p><span>City / Province</span><strong>${application.personalInfo.cityProvince}</strong></p>
            <p><span>Phone</span><strong>${application.personalInfo.phone}</strong></p>
            <p><span>Mobile</span><strong>${application.personalInfo.mobile}</strong></p>
            <p><span>Email</span><strong>${application.personalInfo.email}</strong></p>
            <p><span>Date of Birth</span><strong>${application.personalInfo.birthDate}</strong></p>
            <p><span>Birthplace</span><strong>${application.personalInfo.birthPlace}</strong></p>
            <p><span>Sex</span><strong>${application.personalInfo.sex}</strong></p>
            <p><span>Citizenship</span><strong>${application.personalInfo.citizenship}</strong></p>
            <p><span>Civil Status</span><strong>${application.personalInfo.civilStatus}</strong></p>
            <p><span>Religion</span><strong>${application.personalInfo.religion}</strong></p>
          </div>
        </div>
      </section>

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Uploaded Documents')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-docs-grid">
            <article>
              <h4>2x2 Photo</h4>
              <button class="admission-doc-preview" type="button" data-admission-doc-full="${application.uploadedDocuments.photo2x2}" data-admission-doc-title="2x2 Photo">
                <img src="${application.uploadedDocuments.photo2x2}" alt="2x2 photo upload preview" />
              </button>
            </article>
            <article>
              <h4>Copy of Grades</h4>
              <button class="admission-doc-preview" type="button" data-admission-doc-full="${application.uploadedDocuments.gradesCopy}" data-admission-doc-title="Copy of Grades">
                <img src="${application.uploadedDocuments.gradesCopy}" alt="Copy of grades upload preview" />
              </button>
            </article>
            <article>
              <h4>ID / Certificate</h4>
              <button class="admission-doc-preview" type="button" data-admission-doc-full="${application.uploadedDocuments.idOrCertificate}" data-admission-doc-title="ID / Certificate">
                <img src="${application.uploadedDocuments.idOrCertificate}" alt="ID or certificate upload preview" />
              </button>
            </article>
          </div>
        </div>
      </section>

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Educational Information')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-grid">
            <p><span>Senior High School</span><strong>${application.educationalInfo.seniorHighSchool}</strong></p>
            <p><span>Strand</span><strong>${application.educationalInfo.strand}</strong></p>
            <p><span>Year Graduated</span><strong>${application.educationalInfo.yearGraduated}</strong></p>
            <p><span>General Average</span><strong>${application.educationalInfo.generalAverage}</strong></p>
          </div>
        </div>
      </section>

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('FOR TRANSFEREE / TECH-VOC COURSE GRADUATE / 2ND COURSE')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-grid">
            <p><span>Last School Attended</span><strong>${application.educationalInfo.lastSchoolAttended}</strong></p>
            <p><span>Course</span><strong>${application.educationalInfo.lastCourse}</strong></p>
            <p><span>Last School Year</span><strong>${application.educationalInfo.lastSchoolYear}</strong></p>
          </div>
        </div>
      </section>

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Other Information')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-grid">
            <p><span>ALS Passer</span><strong>${application.otherInfo.alsPasser}</strong></p>
            <p><span>4Ps Beneficiary</span><strong>${application.otherInfo.is4PsBeneficiary}</strong></p>
            <p><span>PWD</span><strong>${application.otherInfo.isPWD}</strong></p>
            <p><span>Indigenous Peoples (IP)</span><strong>${application.otherInfo.isIndigenous}</strong></p>
            <p><span>Solo Parent</span><strong>${application.otherInfo.isSoloParent}</strong></p>
          </div>
        </div>
      </section>

      <section id="reminders" class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Reminders')}
        </header>
        <div class="admission-detail-surface">
          <ol class="admission-reminders-list">
            ${requirementReminders.map((reminder) => `<li>${reminder}</li>`).join('')}
          </ol>
        </div>
      </section>

      <a class="admission-view-status-btn admission-back-link" href="${ROUTES.ADMISSION_STATUS}">Back to Search</a>
    </article>
  `
}

function renderAdmissionContent(active: AdmissionSection): string {
  if (active === 'requirements') {
    const isAdmissionOpen = admissionService.isEnrollmentOpen()
    return `
      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('S.Y. 2026 - 2027 | First Semester')}
        </header>
        <article class="admission-section-card admission-section-card-no-margin">
          <header class="admission-section-header">
            <p class="admission-deadline"><i class="bi bi-calendar-event" aria-hidden="true"></i><span>Deadline of Application</span><strong>March 28, 2026</strong></p>
          </header>

          <section class="admission-content-block">
            <h3 class="mb-3">Admission Requirements</h3>
            <div class="accordion" id="enrollmentRequirementsAccordion">
              <div class="accordion-item">
                <h4 class="accordion-header" id="freshmenRequirementsHeading">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#freshmenRequirementsCollapse"
                    aria-expanded="true"
                    aria-controls="freshmenRequirementsCollapse"
                  >
                    New Students / Incoming Freshmen
                  </button>
                </h4>
                <div
                  id="freshmenRequirementsCollapse"
                  class="accordion-collapse collapse show"
                  aria-labelledby="freshmenRequirementsHeading"
                  data-bs-parent="#enrollmentRequirementsAccordion"
                >
                  <div class="accordion-body">
                    <ul class="mb-0">
                      <li>Original Form 138</li>
                      <li>Good Moral Certificate</li>
                      <li>PSA Birth Certificate Copy</li>
                      <li>2 pcs. 2x2 Picture with Name Tag and White Background</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <h4 class="accordion-header" id="transfereeRequirementsHeading">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#transfereeRequirementsCollapse"
                    aria-expanded="false"
                    aria-controls="transfereeRequirementsCollapse"
                  >
                    Transferees
                  </button>
                </h4>
                <div
                  id="transfereeRequirementsCollapse"
                  class="accordion-collapse collapse"
                  aria-labelledby="transfereeRequirementsHeading"
                  data-bs-parent="#enrollmentRequirementsAccordion"
                >
                  <div class="accordion-body">
                    <ul class="mb-0">
                      <li>Transfer Credentials</li>
                      <li>Good Moral Certificate</li>
                      <li>Photocopy of Marriage Contract (For Married: Female Only)</li>
                      <li>Birth Certificate Copy</li>
                      <li>2 pcs. 2x2 Picture with Name Tag and White Background</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <p class="admission-policy"><i class="bi bi-shield-check" aria-hidden="true"></i>Only one application is accepted per applicant for Golden West Colleges, Inc. Multiple submissions can lead to disqualification.</p>
        </article>
      </section>

      <article id="admission-process" class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Admission Process')}
        </header>
        <section class="admission-section-card admission-section-card-no-margin">
          <div class="admission-content-block">
            <ol class="admission-timeline" aria-label="Admission process timeline">
              <li class="admission-timeline-item">
                <div class="admission-timeline-marker" aria-hidden="true">1</div>
                <div class="admission-timeline-content">
                  <strong>Create an online account</strong>
                  <span>Register using a valid email address.</span>
                </div>
              </li>
              <li class="admission-timeline-item">
                <div class="admission-timeline-marker" aria-hidden="true">2</div>
                <div class="admission-timeline-content">
                  <strong>Fill out the admission form</strong>
                  <span>Provide personal and academic information.</span>
                </div>
              </li>
              <li class="admission-timeline-item">
                <div class="admission-timeline-marker" aria-hidden="true">3</div>
                <div class="admission-timeline-content">
                  <strong>Upload requirements</strong>
                  <span>Submit scanned copies of required documents.</span>
                </div>
              </li>
              <li class="admission-timeline-item">
                <div class="admission-timeline-marker" aria-hidden="true">4</div>
                <div class="admission-timeline-content">
                  <strong>Wait for approval</strong>
                  <span>The admissions office will review your application.</span>
                </div>
              </li>
              <li class="admission-timeline-item">
                <div class="admission-timeline-marker" aria-hidden="true">5</div>
                <div class="admission-timeline-content">
                  <strong>Proceed to enrollment</strong>
                  <span>Follow enrollment instructions once approved.</span>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </article>

      <article class="admission-note-panel admission-note-panel-standalone">
        <h3><i class="bi bi-info-circle-fill" aria-hidden="true"></i>Note</h3>
        <p>Some academic programs may have additional officially approved requirements before admission.</p>
        <p>For updates or corrections on your application details, contact the campus where you submitted your application.</p>
      </article>

      <section class="admission-availability ${isAdmissionOpen ? 'is-open' : 'is-closed'}">
        <p class="admission-status-text">${isAdmissionOpen ? 'ONLINE ADMISSION IS NOW OPEN' : 'Application Closed'}</p>
        ${isAdmissionOpen ? `<a href="${ROUTES.ADMISSION_REGISTRATION}" class="admission-apply-link">Apply Now <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i></a>` : ''}
      </section>
    `
  }

  if (active === 'status') {
    return `
      <article class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Verification')}
        </header>
        <section class="admission-section-card admission-section-card-no-margin admission-section-card-status">
          <div class="admission-status-fields admission-status-inline">
            <div>
              <label for="status-lastname-route"><i class="bi bi-person" aria-hidden="true"></i>Enter Lastname</label>
              <input id="status-lastname-route" type="text" placeholder="Type lastname" />
            </div>
            <button id="status-search-route" type="button">Search</button>
          </div>
          <div id="status-results-route" class="admission-status-results" aria-live="polite"></div>
        </section>
      </article>
    `
  }

  if (active === 'contact') {
    return `
      <article class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Campus Contact Information')}
        </header>
        <section class="admission-section-card admission-section-card-no-margin">
          <div class="admission-content-block">
            <div class="admission-table-wrap">
              <table class="admission-table">
                <thead>
                  <tr>
                    <th>Campus</th>
                    <th>Facebook Link</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Golden West Colleges, Inc.</td>
                    <td><a href="https://www.facebook.com/gwcalaminosofficial" target="_blank" rel="noreferrer">GWC Alaminos Official</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </article>
    `
  }

  return ''
}

function renderadmission_shell(active: AdmissionSection): string {
  const heroTitle =
    active === 'status'
      ? 'Application Status'
      : active === 'contact'
        ? 'Contact Us'
        : 'College Admission'
  const heroSchoolYear = active === 'requirements' ? '2026 - 2027' : ''

  return `
    <main class="admission-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges, Inc. logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges, Inc. logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search admission details',
      })}

      <section class="admission-hero" style="--admission-cover-image: url('${coverImage}')">
        <div class="post-container admission-hero-inner">
          <div class="admission-hero-layout">
            <div class="admission-hero-content">
              <h1 class="admission-hero-title">${heroTitle}</h1>
              ${heroSchoolYear ? `<p class="admission-hero-year">${heroSchoolYear}</p>` : ''}
              <p class="admission-hero-subtitle">Start your journey with <span class="admission-hero-brand">Golden West Colleges, Inc.</span></p>
            </div>
            <div class="admission-hero-people-wrap" aria-hidden="true">
              <img class="admission-hero-people-image" src="${admissionCoverPeopleImage}" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section class="admission-shell">
        <div class="post-container">
          ${renderAdmissionTabs(active)}
          ${renderAdmissionContent(active)}
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}

export function setupadmission_status_page(app: HTMLDivElement): () => void {
  const input = app.querySelector<HTMLInputElement>('#status-lastname-route')
  const button = app.querySelector<HTMLButtonElement>('#status-search-route')
  const results = app.querySelector<HTMLDivElement>('#status-results-route')

  if (!input || !button || !results) {
    return () => {}
  }

  const searchApplications = (): void => {
    const query = input.value.trim().toLowerCase()
    const fixedCampus = 'alaminos city campus'

    if (!query) {
      results.innerHTML = ''
      return
    }

    const matched = admissionService.list().filter(
      (entry) => entry.lastName.toLowerCase().includes(query) && entry.campus.toLowerCase() === fixedCampus,
    )

    if (matched.length === 0) {
      results.innerHTML = `<p class="admission-status-message">No application found for <strong>${input.value.trim()}</strong>.</p>`
      return
    }

    results.innerHTML = matched.map((entry) => renderApplicationCard(entry)).join('')
  }

  button.addEventListener('click', searchApplications)
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    searchApplications()
  }

  input.addEventListener('keydown', onKeydown)

  return () => {
    button.removeEventListener('click', searchApplications)
    input.removeEventListener('keydown', onKeydown)
  }
}

export function renderadmission_page(): string {
  return renderadmission_shell('requirements')
}

export function renderadmission_status_page(): string {
  return renderadmission_shell('status')
}

export function renderadmission_status_verify_page(applicationNo: string): string {
  return `
    <main class="admission-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges, Inc. logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges, Inc. logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search admission details',
      })}

      <section class="admission-hero" style="--admission-cover-image: url('${coverImage}')">
        <div class="post-container admission-hero-inner">
          <div class="admission-hero-layout">
            <div class="admission-hero-content">
              <h1 class="admission-hero-title">Application Status</h1>
              <p class="admission-hero-subtitle">Verify your information before viewing details</p>
            </div>
            <div class="admission-hero-people-wrap" aria-hidden="true">
              <img class="admission-hero-people-image" src="${admissionCoverPeopleImage}" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section class="admission-shell">
        <div class="post-container">
          ${renderAdmissionTabs('status')}
          ${renderAdmissionVerificationContent(applicationNo)}
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}

export function renderadmission_status_details_page(applicationNo: string): string {
  return `
    <main class="admission-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges, Inc. logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges, Inc. logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search admission details',
      })}

      <section class="admission-hero" style="--admission-cover-image: url('${coverImage}')">
        <div class="post-container admission-hero-inner">
          <div class="admission-hero-layout">
            <div class="admission-hero-content">
              <h1 class="admission-hero-title">Application Status</h1>
              <p class="admission-hero-subtitle">Admission details for your application</p>
            </div>
            <div class="admission-hero-people-wrap" aria-hidden="true">
              <img class="admission-hero-people-image" src="${admissionCoverPeopleImage}" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section class="admission-shell">
        <div class="post-container">
          ${renderAdmissionTabs('status')}
          ${renderAdmissionStatusDetailsContent(applicationNo)}
          ${renderSharedModal('admission-document-modal')}
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}

export function setupadmission_status_verify_page(app: HTMLDivElement, applicationNo: string): () => void {
  const birthDateInput = app.querySelector<HTMLInputElement>('#status-birthdate-verify')
  const verifyButton = app.querySelector<HTMLButtonElement>('#status-verify-submit')
  const verifyMessage = app.querySelector<HTMLDivElement>('#status-verify-message')
  const application = admissionService.findByApplicationNo(applicationNo)

  if (!birthDateInput || !verifyButton || !verifyMessage || !application) {
    return () => {}
  }

  const expectedBirthDate = formatBirthDateForInput(application.personalInfo.birthDate)
  const cleanupDateClick = enableFullDateInputClick(birthDateInput)

  const verify = (): void => {
    if (!expectedBirthDate) {
      verifyMessage.innerHTML = `<p class="admission-status-message">Unable to verify this record right now. Please contact admissions.</p>`
      return
    }

    const selectedBirthDate = birthDateInput.value

    if (!selectedBirthDate) {
      verifyMessage.innerHTML = `<p class="admission-status-message">Please enter your birth date.</p>`
      return
    }

    if (selectedBirthDate !== expectedBirthDate) {
      verifyMessage.innerHTML = `<p class="admission-status-message">Verification failed. Birth date does not match our record.</p>`
      return
    }

    window.location.href = `${ROUTES.ADMISSION_STATUS}/${encodeURIComponent(application.applicationNo)}`
  }

  verifyButton.addEventListener('click', verify)

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    verify()
  }

  birthDateInput.addEventListener('keydown', onKeydown)

  return () => {
    verifyButton.removeEventListener('click', verify)
    birthDateInput.removeEventListener('keydown', onKeydown)
    cleanupDateClick()
  }
}

export function setupadmission_status_details_page(app: HTMLDivElement): () => void {
  const modal = setupSharedModal(app, { modalSelector: '#admission-document-modal' })

  const onDocumentClick = (event: Event): void => {
    const target = event.target as HTMLElement
    const previewButton = target.closest<HTMLButtonElement>('[data-admission-doc-full]')
    if (!previewButton) return

    const imageSrc = previewButton.dataset.admissionDocFull
    if (!imageSrc) return

    const imageTitle = previewButton.dataset.admissionDocTitle ?? 'Uploaded Document'
    const bodyHtml = `
      <div class="admission-doc-full-view">
        <img src="${imageSrc}" alt="${imageTitle}" />
      </div>
    `

    modal.setMode('form')
    modal.setOnConfirm(null)
    modal.open({
      title: imageTitle,
      bodyHtml,
      hideConfirm: true,
    })
  }

  app.addEventListener('click', onDocumentClick)

  return () => {
    app.removeEventListener('click', onDocumentClick)
    modal.destroy()
  }
}

export function renderadmission_contact_page(): string {
  return renderadmission_shell('contact')
}
