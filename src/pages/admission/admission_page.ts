import '../../styles/admission.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/cover.avif'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

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

function renderAdmissionContent(active: AdmissionSection): string {
  if (active === 'requirements') {
    return `
      <section class="admission-section-card">
        <header class="admission-section-header">
          <h3 class="admin-section-title admission-section-title">S.Y. 2026 - 2027 | First Semester</h3>
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

          <article class="admission-note-panel">
            <h3><i class="bi bi-info-circle-fill" aria-hidden="true"></i>Note</h3>
            <p>Some academic programs may have additional officially approved requirements before admission.</p>
            <p>For updates or corrections on your application details, contact the campus where you submitted your application.</p>
          </article>
        </section>

        <p class="admission-policy"><i class="bi bi-shield-check" aria-hidden="true"></i>Only one application is accepted for the university system. Multiple submissions can lead to disqualification.</p>
      </section>

      <article id="admission-process" class="admission-section-card">
        <header class="admission-subhead">
          <h3 class="admin-section-title admission-section-title">Admission Process</h3>
        </header>
        <section class="admission-content-block">
          <ol class="admission-process-list">
            <li><strong>Create an online account</strong><span>Register using a valid email address.</span></li>
            <li><strong>Fill out the admission form</strong><span>Provide personal and academic information.</span></li>
            <li><strong>Upload requirements</strong><span>Submit scanned copies of required documents.</span></li>
            <li><strong>Wait for approval</strong><span>The admissions office will review your application.</span></li>
            <li><strong>Proceed to enrollment</strong><span>Follow enrollment instructions once approved.</span></li>
          </ol>
        </section>
      </article>

      <section class="admission-cta">
        <div class="admission-cta-copy">
          <h3>Ready to join Golden West Colleges?</h3>
          <p>Your future begins here.</p>
        </div>
        <a href="${ROUTES.ADMISSION}" class="admission-apply-link">Apply Now <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i></a>
      </section>

      <p class="admission-status-closed">Application Closed</p>
    `
  }

  if (active === 'status') {
    return `
      <article class="admission-section-card admission-section-card-status">
        <header class="admission-subhead">
          <h3 class="admin-section-title admission-section-title">Verification</h3>
        </header>
        <div class="admission-status-fields admission-status-inline">
          <div>
            <label for="status-lastname-route"><i class="bi bi-person" aria-hidden="true"></i>Enter Lastname</label>
            <input id="status-lastname-route" type="text" />
          </div>
          <button type="button">Search</button>
        </div>
      </article>
    `
  }

  if (active === 'contact') {
    return `
      <article class="admission-section-card">
        <header class="admission-subhead">
          <h3 class="admin-section-title admission-section-title">Campus Hotline Numbers</h3>
        </header>
        <section class="admission-content-block">
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
                  <td>Golden West Colleges</td>
                  <td><a href="https://www.facebook.com/gwcalaminosofficial" target="_blank" rel="noreferrer">GWC Alaminos Official</a></td>
                </tr>
              </tbody>
            </table>
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
            : 'College Admission 2026 - 2027'

  return `
    <main class="admission-page">
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

      <section class="admission-hero" style="--admission-cover-image: url('${coverImage}')">
        <div class="post-container admission-hero-inner">
          <div class="admission-hero-content">
            <h1 class="admission-hero-title">${heroTitle}</h1>
            <p class="admission-hero-subtitle">Start your journey with Golden West Colleges, Inc.</p>
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

export function renderadmission_page(): string {
  return renderadmission_shell('requirements')
}

export function renderadmission_status_page(): string {
  return renderadmission_shell('status')
}

export function renderadmission_contact_page(): string {
  return renderadmission_shell('contact')
}
