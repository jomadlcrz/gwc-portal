import '../../styles/admission.css'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/admission_cover.png'

function renderRegistrationSteps(): string {
  const steps = ['Choose Program', 'Personal Information', 'Validate Details', 'Finish']
  return `
    <section class="admission-registration-steps" aria-label="Admission registration steps">
      <ol class="admission-stepper-list">
        ${steps
          .map(
            (label, index) => `
              <li class="admission-stepper-item ${index === 0 ? 'is-active' : ''}">
                <span class="admission-stepper-dot" aria-hidden="true">${index + 1}</span>
                <span class="admission-stepper-label">${label}</span>
              </li>
            `,
          )
          .join('')}
      </ol>
    </section>
  `
}

export function renderadmission_registration_page(): string {
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
            <h1 class="admission-hero-title">Admissions Registration</h1>
            <p class="admission-hero-subtitle">Online Application</p>
          </div>
        </div>
      </section>

      ${renderRegistrationSteps()}

      <section class="admission-shell admission-registration-shell">
        <div class="post-container">
          <article class="admission-registration-intro">
            <h2>Online Application</h2>
            <p>
              We warmly welcome junior high school completers, senior high school graduates, college transferees,
              second coursers, and foreign applicants to our campuses.
            </p>
            <p>Kindly fill-out the online application form for a fast and efficient admissions procedure.</p>
          </article>

          <article class="admission-registration-card">
            <h3>What type of student are you?</h3>
            <label class="admission-registration-option" for="admission-student-type-new">
              <input id="admission-student-type-new" name="admission-student-type" type="radio" checked />
              <span>New</span>
            </label>
            <label class="admission-registration-option" for="admission-student-type-existing">
              <input id="admission-student-type-existing" name="admission-student-type" type="radio" />
              <span>Existing Student</span>
            </label>
          </article>

          <article class="admission-registration-card">
            <h3>Programs:</h3>
            <label class="admission-registration-option" for="admission-program-bscrim">
              <input id="admission-program-bscrim" name="admission-program" type="radio" checked />
              <span>BS Criminology</span>
            </label>
            <label class="admission-registration-option" for="admission-program-bsit">
              <input id="admission-program-bsit" name="admission-program" type="radio" />
              <span>BS Information Technology</span>
            </label>
            <label class="admission-registration-option" for="admission-program-bscs">
              <input id="admission-program-bscs" name="admission-program" type="radio" />
              <span>BS Computer Science</span>
            </label>
            <label class="admission-registration-option" for="admission-program-ascs">
              <input id="admission-program-ascs" name="admission-program" type="radio" />
              <span>2-Year Associate in Computer Science</span>
            </label>
            <label class="admission-registration-option" for="admission-program-bsba">
              <input id="admission-program-bsba" name="admission-program" type="radio" />
              <span>BS Business Administration (Major in Marketing Management)</span>
            </label>
            <label class="admission-registration-option" for="admission-program-beed">
              <input id="admission-program-beed" name="admission-program" type="radio" />
              <span>Bachelor of Elementary Education</span>
            </label>
            <label class="admission-registration-option" for="admission-program-bsed">
              <input id="admission-program-bsed" name="admission-program" type="radio" />
              <span>Bachelor of Secondary Education</span>
            </label>
          </article>

          <div class="admission-registration-actions">
            <button type="button" class="admission-registration-next-step">Next Step</button>
          </div>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}
