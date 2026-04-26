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
import { ADMISSION_APPLICATIONS, getAdmissionApplicationByNo, type AdmissionApplication } from '../../data/admission'

type AdmissionSection = 'requirements' | 'status' | 'contact'
const isAdmissionOpen = false

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
      <a class="admission-view-status-btn" href="${ROUTES.ADMISSION_STATUS}/${encodeURIComponent(application.applicationNo)}">
        View Status
      </a>
    </article>
  `
}

function renderAdmissionStatusDetailsContent(applicationNo: string): string {
  const application = getAdmissionApplicationByNo(applicationNo)

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

  const fullName = `${application.applicationNo}: ${application.lastName.toUpperCase()}, ${application.firstName.toUpperCase()}${application.middleName ? ` ${application.middleName.toUpperCase()}` : ''}`

  return `
    <article class="admission-details-page-shell">
      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Admission Details')}
        </header>
        <div class="admission-detail-surface">
          <div class="admission-details-header">
            <p class="admission-details-name"><span>Applicant Name:</span> ${fullName}</p>
            <p class="admission-details-badge">${application.status}</p>
          </div>
          <p class="admission-details-notice">${application.remarks}</p>
          <div class="admission-details-grid">
            <p><span>Campus</span><strong>${application.campus}</strong></p>
            <p><span>Admission</span><strong>${application.admissionType}</strong></p>
            <p><span>Course (First Choice)</span><strong>${application.courseFirstChoice}</strong></p>
            <p><span>Course (Second Choice)</span><strong>${application.courseSecondChoice}</strong></p>
            <p><span>Course (Third Choice)</span><strong>${application.courseThirdChoice}</strong></p>
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

      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('Reminders')}
        </header>
        <div class="admission-detail-surface">
          <ol class="admission-reminders-list">
            ${application.reminders.map((reminder) => `<li>${reminder}</li>`).join('')}
          </ol>
        </div>
      </section>

      <a class="admission-view-status-btn admission-back-link" href="${ROUTES.ADMISSION_STATUS}">Back to Search</a>
    </article>
  `
}

function renderAdmissionContent(active: AdmissionSection): string {
  if (active === 'requirements') {
    return `
      <section class="admission-detail-section">
        <header class="admission-detail-heading">
          ${renderAdminSectionTitle('S.Y. 2026 - 2027 | First Semester')}
        </header>
        <article class="admission-section-card admission-section-card-no-margin">
          <header class="admission-section-header">
            <p class="admission-deadline"><i class="bi bi-calendar-event" aria-hidden="true"></i><span>Deadline of Application</span><strong>March 28, 2026</strong></p>
          </header>

          <section class="admission-content-grid">
            <article class="admission-block">
              <p class="admission-step">1</p>
              <h3>2x2 Picture</h3>
              <ul>
                <li>White background</li>
              </ul>
            </article>

            <article class="admission-block">
              <p class="admission-step">2</p>
              <h3>Clear Copy of Grades</h3>
              <ul>
                <li>Grade 11 card for Senior High School students</li>
                <li>Grade 12 card for Senior High School graduates</li>
                <li>Transcript of Records or certification of grades for transferees</li>
                <li>ALS certificate with remarks for college-level qualification</li>
              </ul>
            </article>

            <article class="admission-block">
              <p class="admission-step">3</p>
              <h3>Other Relevant IDs or Certificates</h3>
              <ul>
                <li>Persons with Disabilities (PWD)</li>
                <li>Indigenous Peoples (IP)</li>
                <li>Solo Parent</li>
                <li>Out of School Youth (OSY)</li>
                <li>4Ps beneficiary proof</li>
              </ul>
            </article>
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
            <ol class="admission-process-list">
              <li><strong>Create an online account</strong><span>Register using a valid email address.</span></li>
              <li><strong>Fill out the admission form</strong><span>Provide personal and academic information.</span></li>
              <li><strong>Upload requirements</strong><span>Submit scanned copies of required documents.</span></li>
              <li><strong>Wait for approval</strong><span>The admissions office will review your application.</span></li>
              <li><strong>Proceed to enrollment</strong><span>Follow enrollment instructions once approved.</span></li>
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
        ${isAdmissionOpen ? `<a href="${ROUTES.ADMISSION}" class="admission-apply-link">Apply Now <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i></a>` : ''}
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
          ${renderAdminSectionTitle('Campus Hotline Numbers')}
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

    const matched = ADMISSION_APPLICATIONS.filter(
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
