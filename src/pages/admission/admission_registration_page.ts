import '../../styles/admission.css'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'
import { createRegistrationStudent } from '../../api/v1/registration/students'

const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/gwc_banner.png'
const registrationStepLabels = ['Choose Program', 'Personal Information', 'Validate Details', 'Finish'] as const

function renderRegistrationSteps(): string {
  return `
    <section class="admission-registration-steps" aria-label="Admission registration steps" data-aos="fade-right" data-aos-delay="100">
      <ol class="admission-stepper-list">
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
          <article id="admission-registration-intro" class="admission-registration-intro">
            <h2 class="admission-registration-title" data-aos="fade-up">
              Online Application
            </h2>
            <p>
              We are now accepting new students and transferees for the 1st Semester.
            </p>
            <p>Please complete the online application form for a faster and more efficient admissions process.</p>
          </article>

          <section id="admission-registration-step-1">
            <article class="admission-registration-card" data-aos="fade-up" data-aos-duration="700">
              <h3>What type of student are you?</h3>
              <label class="admission-registration-option" for="admission-student-type-new">
                <input id="admission-student-type-new" name="admission-student-type" type="radio" value="Freshmen" />
                <span>Freshmen</span>
              </label>
              <label class="admission-registration-option" for="admission-student-type-existing">
                <input id="admission-student-type-existing" name="admission-student-type" type="radio" value="Transferee" />
                <span>Transferee</span>
              </label>
            </article>

            <article class="admission-registration-card" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
              <h3>Programs:</h3>
              <label class="admission-registration-option" for="admission-program-bscrim">
                <input id="admission-program-bscrim" name="admission-program" type="radio" value="1" />
                <span>Bachelor of Science in Criminology</span>
              </label>
              <label class="admission-registration-option" for="admission-program-bsit">
                <input id="admission-program-bsit" name="admission-program" type="radio" value="2" />
                <span>Bachelor of Science in Information Technology</span>
              </label>
              <label class="admission-registration-option" for="admission-program-bscs">
                <input id="admission-program-bscs" name="admission-program" type="radio" value="3" />
                <span>Bachelor of Science in Computer Science</span>
              </label>
              <label class="admission-registration-option" for="admission-program-ascs">
                <input id="admission-program-ascs" name="admission-program" type="radio" value="4" />
                <span>Associate in Computer Science (2-Years)</span>
              </label>
              <label class="admission-registration-option" for="admission-program-bsba">
                <input id="admission-program-bsba" name="admission-program" type="radio" value="5" />
                <span>Bachelor of Science in Business Administration (Major in Marketing Management)</span>
              </label>
              <label class="admission-registration-option" for="admission-program-beed">
                <input id="admission-program-beed" name="admission-program" type="radio" value="6" />
                <span>Bachelor of Elementary Education</span>
              </label>
              <label class="admission-registration-option" for="admission-program-bsed">
                <input id="admission-program-bsed" name="admission-program" type="radio" value="7" />
                <span>Bachelor of Secondary Education</span>
              </label>
            </article>
          </section>

          <section id="admission-registration-step-2" class="admission-registration-step-hidden">
            <article class="admission-registration-card">
              <h3>Personal Information</h3>
              <div class="admission-registration-fields">
                <div class="form-floating">
                  <input id="admission-first-name" class="form-control" type="text" placeholder=" " autocomplete="given-name" />
                  <label for="admission-first-name">First Name</label>
                </div>

                <div class="form-floating">
                  <input id="admission-middle-name" class="form-control" type="text" placeholder=" " autocomplete="additional-name" />
                  <label for="admission-middle-name">Middle Name</label>
                </div>

                <div class="form-floating">
                  <input id="admission-last-name" class="form-control" type="text" placeholder=" " autocomplete="family-name" />
                  <label for="admission-last-name">Last Name</label>
                </div>

                <div class="form-floating">
                  <select id="admission-gender" class="form-select" aria-label="Gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label for="admission-gender">Gender</label>
                </div>

                <div class="form-floating">
                  <input id="admission-birth-date" class="form-control" type="date" placeholder=" " />
                  <label for="admission-birth-date">Birth Date</label>
                </div>

                <div class="form-floating">
                  <input id="admission-contact-info-id" class="form-control" type="number" min="1" placeholder=" " />
                  <label for="admission-contact-info-id">Contact Info ID</label>
                </div>

                <div class="form-floating">
                  <input id="admission-emergency-contact-id" class="form-control" type="number" min="1" placeholder=" " />
                  <label for="admission-emergency-contact-id">Emergency Contact ID</label>
                </div>

                <div class="form-floating">
                  <input id="admission-current-address-id" class="form-control" type="number" min="1" placeholder=" " />
                  <label for="admission-current-address-id">Current Address ID</label>
                </div>

                <div class="form-floating">
                  <input id="admission-permanent-address-id" class="form-control" type="number" min="1" placeholder=" " />
                  <label for="admission-permanent-address-id">Permanent Address ID</label>
                </div>
              </div>
            </article>
          </section>

          <section id="admission-registration-step-3" class="admission-registration-step-hidden">
            <article class="admission-registration-card">
              <h3>Validate Details</h3>
              <div class="admission-details-grid admission-registration-review" id="admission-registration-review">
                <p><span>Student Type</span><strong id="admission-review-student-type"></strong></p>
                <p><span>Program</span><strong id="admission-review-program"></strong></p>
                <p><span>Name</span><strong id="admission-review-name"></strong></p>
                <p><span>Gender</span><strong id="admission-review-gender"></strong></p>
                <p><span>Birth Date</span><strong id="admission-review-birth-date"></strong></p>
                <p><span>Contact Info ID</span><strong id="admission-review-contact-id"></strong></p>
                <p><span>Emergency Contact ID</span><strong id="admission-review-emergency-id"></strong></p>
                <p><span>Current Address ID</span><strong id="admission-review-current-address-id"></strong></p>
                <p><span>Permanent Address ID</span><strong id="admission-review-permanent-address-id"></strong></p>
              </div>
            </article>
          </section>

          <section id="admission-registration-step-4" class="admission-registration-step-hidden">
            <article class="admission-registration-finish-card">
              <div class="admission-registration-success-check" aria-hidden="true">
                <span class="admission-finish-confetti-layer">
                  <span class="admission-finish-confetti admission-finish-confetti-1"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-2"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-3"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-4"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-5"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-6"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-7"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-8"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-9"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-10"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-11"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-12"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-13"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-14"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-15"></span>
                  <span class="admission-finish-confetti admission-finish-confetti-16"></span>
                </span>
                <span class="admission-finish-glitter-layer">
                  <span class="admission-finish-glitter admission-finish-glitter-1"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-2"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-3"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-4"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-5"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-6"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-7"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-8"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-9"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-10"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-11"></span>
                  <span class="admission-finish-glitter admission-finish-glitter-12"></span>
                </span>
                <svg viewBox="0 0 120 120" role="presentation">
                  <circle class="admission-success-check-circle" cx="60" cy="60" r="48" />
                  <path class="admission-success-check-mark" d="M36 62l16 16 32-32" />
                </svg>
              </div>
              <h3>Application Submitted!</h3>
              <p class="admission-registration-finish-copy">
                Your application has been submitted successfully. Please wait for admissions confirmation.
              </p>
              <a class="admission-registration-dashboard-link" href="${ROUTES.HOME}">
                <span>Go to Home</span>
              </a>
            </article>
          </section>

          <div class="admission-registration-actions">
            <button type="button" class="admission-registration-nav-button admission-registration-step-hidden" id="admission-registration-back">Previous</button>
            <button type="button" class="admission-registration-next-step" id="admission-registration-next">Next Step</button>
            <button type="button" class="admission-registration-next-step admission-registration-step-hidden" id="admission-registration-submit">Submit Application</button>
          </div>
          <p id="admission-registration-message" class="admission-registration-message" role="status" aria-live="polite"></p>
        </div>
      </section>

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
      // Ignore browsers that block programmatic picker open in some cases.
    }
  }

  input.addEventListener('click', openDatePicker)

  return () => {
    input.removeEventListener('click', openDatePicker)
  }
}

export function setupadmission_registration_page(root: HTMLElement): () => void {
  const introSection = root.querySelector<HTMLElement>('#admission-registration-intro')
  const step1Section = root.querySelector<HTMLElement>('#admission-registration-step-1')
  const step2Section = root.querySelector<HTMLElement>('#admission-registration-step-2')
  const step3Section = root.querySelector<HTMLElement>('#admission-registration-step-3')
  const step4Section = root.querySelector<HTMLElement>('#admission-registration-step-4')
  const timelineItems = Array.from(root.querySelectorAll<HTMLElement>('.admission-stepper-item'))
  const stepperList = root.querySelector<HTMLOListElement>('.admission-stepper-list')
  const stepsSection = root.querySelector<HTMLElement>('.admission-registration-steps')
  const timelineMobileLabel = root.querySelector<HTMLElement>('#admission-stepper-mobile-label')
  const backButton = root.querySelector<HTMLButtonElement>('#admission-registration-back')
  const nextButton = root.querySelector<HTMLButtonElement>('#admission-registration-next')
  const submitButton = root.querySelector<HTMLButtonElement>('#admission-registration-submit')
  const messageEl = root.querySelector<HTMLElement>('#admission-registration-message')
  const finishCheck = root.querySelector<HTMLElement>('.admission-registration-success-check')
  const finishSection = root.querySelector<HTMLElement>('#admission-registration-step-4')
  const reviewStudentType = root.querySelector<HTMLElement>('#admission-review-student-type')
  const reviewProgram = root.querySelector<HTMLElement>('#admission-review-program')
  const reviewName = root.querySelector<HTMLElement>('#admission-review-name')
  const reviewGender = root.querySelector<HTMLElement>('#admission-review-gender')
  const reviewBirthDate = root.querySelector<HTMLElement>('#admission-review-birth-date')
  const reviewContactId = root.querySelector<HTMLElement>('#admission-review-contact-id')
  const reviewEmergencyId = root.querySelector<HTMLElement>('#admission-review-emergency-id')
  const reviewCurrentAddressId = root.querySelector<HTMLElement>('#admission-review-current-address-id')
  const reviewPermanentAddressId = root.querySelector<HTMLElement>('#admission-review-permanent-address-id')
  const firstNameInput = root.querySelector<HTMLInputElement>('#admission-first-name')
  const middleNameInput = root.querySelector<HTMLInputElement>('#admission-middle-name')
  const lastNameInput = root.querySelector<HTMLInputElement>('#admission-last-name')
  const genderInput = root.querySelector<HTMLSelectElement>('#admission-gender')
  const birthDateInput = root.querySelector<HTMLInputElement>('#admission-birth-date')
  const contactInfoIdInput = root.querySelector<HTMLInputElement>('#admission-contact-info-id')
  const emergencyContactIdInput = root.querySelector<HTMLInputElement>('#admission-emergency-contact-id')
  const currentAddressIdInput = root.querySelector<HTMLInputElement>('#admission-current-address-id')
  const permanentAddressIdInput = root.querySelector<HTMLInputElement>('#admission-permanent-address-id')
  const step1Cards = Array.from(step1Section?.querySelectorAll<HTMLElement>('.admission-registration-card') ?? [])
  const programCard = step1Cards[1] ?? null

  if (
    !introSection ||
    !step1Section ||
    !step2Section ||
    !step3Section ||
    !step4Section ||
    !timelineMobileLabel ||
    !backButton ||
    !nextButton ||
    !submitButton ||
    !finishCheck ||
    !finishSection ||
    !reviewStudentType ||
    !reviewProgram ||
    !reviewName ||
    !reviewGender ||
    !reviewBirthDate ||
    !reviewContactId ||
    !reviewEmergencyId ||
    !reviewCurrentAddressId ||
    !reviewPermanentAddressId ||
    !firstNameInput ||
    !middleNameInput ||
    !lastNameInput ||
    !genderInput ||
    !birthDateInput ||
    !contactInfoIdInput ||
    !emergencyContactIdInput ||
    !currentAddressIdInput ||
    !permanentAddressIdInput
  ) {
    return () => {}
  }

  let currentStep: 1 | 2 | 3 | 4 = 1
  const cleanupBirthDateClick = enableFullDateInputClick(birthDateInput)
  const scrollToStep = (step: 1 | 2 | 3 | 4): void => {
    const targetSection =
      stepsSection ?? (step === 1 ? step1Section : step === 2 ? step2Section : step === 3 ? step3Section : step4Section)
    window.requestAnimationFrame(() => {
      const headerEl = document.querySelector<HTMLElement>('.main-site-header')
      const headerOffset = headerEl ? headerEl.getBoundingClientRect().height : 0
      // Keep full timeline (dots + line + labels) comfortably below sticky header/menu.
      const topPadding = 62
      const bottomPadding = 10
      const initialTop = window.scrollY + targetSection.getBoundingClientRect().top - headerOffset - topPadding
      window.scrollTo({ top: Math.max(0, initialTop), behavior: 'instant' })

      const rect = targetSection.getBoundingClientRect()
      const allowedTop = headerOffset + topPadding
      const allowedBottom = window.innerHeight - bottomPadding
      if (rect.bottom > allowedBottom) {
        window.scrollBy({ top: rect.bottom - allowedBottom, behavior: 'instant' })
      }
      if (rect.top < allowedTop) {
        window.scrollBy({ top: rect.top - allowedTop, behavior: 'instant' })
      }
    })
  }

  const isStep1Complete = (): boolean =>
    Boolean(root.querySelector<HTMLInputElement>('input[name="admission-student-type"]:checked')) &&
    Boolean(root.querySelector<HTMLInputElement>('input[name="admission-program"]:checked'))

  const isStep2Complete = (): boolean => {
    const firstName = firstNameInput.value.trim()
    const lastName = lastNameInput.value.trim()
    const birthDate = birthDateInput.value
    const contactInfoId = Number(contactInfoIdInput.value)
    const emergencyContactId = Number(emergencyContactIdInput.value)
    const currAddrId = Number(currentAddressIdInput.value)
    const permAddrId = Number(permanentAddressIdInput.value)
    return Boolean(
      firstName &&
        lastName &&
        birthDate &&
        Number.isFinite(contactInfoId) &&
        Number.isFinite(emergencyContactId) &&
        Number.isFinite(currAddrId) &&
        Number.isFinite(permAddrId),
    )
  }

  const updateStep1CardFlow = (): void => {
    const hasStudentType = Boolean(root.querySelector<HTMLInputElement>('input[name="admission-student-type"]:checked'))
    if (programCard) {
      programCard.classList.toggle('admission-registration-step-hidden', !hasStudentType)
    }
  }

  const updateNextButtonState = (): void => {
    if (currentStep === 1) {
      const canProceed = isStep1Complete()
      nextButton.disabled = !canProceed
      nextButton.classList.toggle('admission-registration-step-hidden', !canProceed)
      return
    }
    if (currentStep === 2) {
      const canProceed = isStep2Complete()
      nextButton.disabled = !canProceed
      nextButton.classList.toggle('admission-registration-step-hidden', !canProceed)
      return
    }
    nextButton.disabled = false
    nextButton.classList.add('admission-registration-step-hidden')
  }

  const setFinishCheckState = (animated: boolean): void => {
    finishCheck.classList.remove('is-animate', 'is-static-complete')
    if (animated) {
      // Force reflow so animation can replay each successful submit.
      void finishCheck.offsetWidth
      finishCheck.classList.add('is-animate')
      return
    }
    finishCheck.classList.add('is-static-complete')
  }

  const setStep = (step: 1 | 2 | 3 | 4, shouldScrollToStep = true): void => {
    currentStep = step
    step1Section.classList.toggle('admission-registration-step-hidden', step !== 1)
    step2Section.classList.toggle('admission-registration-step-hidden', step !== 2)
    step3Section.classList.toggle('admission-registration-step-hidden', step !== 3)
    step4Section.classList.toggle('admission-registration-step-hidden', step !== 4)
    introSection.classList.toggle('admission-registration-step-hidden', step === 4)
    backButton.classList.toggle('admission-registration-step-hidden', step === 1 || step === 4)
    nextButton.classList.toggle('admission-registration-step-hidden', step !== 1 && step !== 2)
    submitButton.classList.toggle('admission-registration-step-hidden', step !== 3)
    nextButton.textContent = 'Next Step'

    timelineItems.forEach((item) => {
      const itemStep = Number(item.dataset.stepIndex)
      item.classList.toggle('is-active', itemStep === step - 1)
      item.classList.toggle('is-completed', itemStep < step - 1)
    })
    const progressRatio = (step - 1) / (registrationStepLabels.length - 1)
    stepperList?.style.setProperty('--admission-stepper-progress', String(progressRatio))
    timelineMobileLabel.textContent = registrationStepLabels[step - 1]
    updateNextButtonState()
    updateStep1CardFlow()
    if (shouldScrollToStep) {
      scrollToStep(step)
    }

    if (step === 4) {
      setFinishCheckState(true)
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      if (isDesktop) {
        window.requestAnimationFrame(() => {
          finishSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
    }
  }

  const validatePersonalInformation = (): boolean => {
    const firstName = firstNameInput.value.trim()
    const lastName = lastNameInput.value.trim()
    const birthDate = birthDateInput.value
    const contactInfoId = Number(contactInfoIdInput.value)
    const emergencyContactId = Number(emergencyContactIdInput.value)
    const currAddrId = Number(currentAddressIdInput.value)
    const permAddrId = Number(permanentAddressIdInput.value)

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !Number.isFinite(contactInfoId) ||
      !Number.isFinite(emergencyContactId) ||
      !Number.isFinite(currAddrId) ||
      !Number.isFinite(permAddrId)
    ) {
      setMessage(messageEl, 'Complete all required personal information fields.', true)
      return false
    }

    setMessage(messageEl, '')
    return true
  }

  const validateProgramSelection = (): boolean => {
    const admissionType = root.querySelector<HTMLInputElement>('input[name="admission-student-type"]:checked')
    const program = root.querySelector<HTMLInputElement>('input[name="admission-program"]:checked')
    if (!admissionType || !program) {
      setMessage(messageEl, 'Please select your student type and your preferred program.', true)
      return false
    }
    setMessage(messageEl, '')
    return true
  }

  const populateValidationDetails = (): void => {
    const admissionTypeInput = root.querySelector<HTMLInputElement>('input[name="admission-student-type"]:checked')
    const programInput = root.querySelector<HTMLInputElement>('input[name="admission-program"]:checked')
    const programLabel = programInput?.closest('label')?.querySelector('span')?.textContent?.trim() || '-'
    const middleName = middleNameInput.value.trim()
    reviewStudentType.textContent = admissionTypeInput?.value || '-'
    reviewProgram.textContent = programLabel
    reviewName.textContent = `${firstNameInput.value.trim()} ${middleName ? `${middleName} ` : ''}${lastNameInput.value.trim()}`.trim()
    reviewGender.textContent = genderInput.value
    reviewBirthDate.textContent = birthDateInput.value || '-'
    reviewContactId.textContent = contactInfoIdInput.value || '-'
    reviewEmergencyId.textContent = emergencyContactIdInput.value || '-'
    reviewCurrentAddressId.textContent = currentAddressIdInput.value || '-'
    reviewPermanentAddressId.textContent = permanentAddressIdInput.value || '-'
  }

  const onSubmit = async (): Promise<void> => {
    const admissionType = root.querySelector<HTMLInputElement>('input[name="admission-student-type"]:checked')?.value
    const programIdRaw = root.querySelector<HTMLInputElement>('input[name="admission-program"]:checked')?.value
    const firstName = firstNameInput.value.trim()
    const midName = middleNameInput.value.trim()
    const lastName = lastNameInput.value.trim()
    const birthDate = birthDateInput.value
    const contactInfoId = Number(contactInfoIdInput.value)
    const emergencyContactId = Number(emergencyContactIdInput.value)
    const currAddrId = Number(currentAddressIdInput.value)
    const permAddrId = Number(permanentAddressIdInput.value)

    if (
      !admissionType ||
      !programIdRaw ||
      !firstName ||
      !lastName ||
      !birthDate ||
      !Number.isFinite(contactInfoId) ||
      !Number.isFinite(emergencyContactId) ||
      !Number.isFinite(currAddrId) ||
      !Number.isFinite(permAddrId)
    ) {
      setMessage(messageEl, 'Complete all required fields before submitting.', true)
      return
    }

    setMessage(messageEl, 'Submitting application...')
    submitButton.disabled = true

    try {
      await createRegistrationStudent({
        programId: Number(programIdRaw),
        firstName,
        midName: midName || undefined,
        lastName,
        gender: genderInput.value,
        birthDate,
        contactInfoId,
        emergencyContactId,
        admissionType,
        currAddrId,
        permAddrId,
        preRegStatus: 'Application Received',
      })
      setMessage(messageEl, '')
      setStep(4)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit application.'
      setMessage(messageEl, message, true)
    } finally {
      submitButton.disabled = false
    }
  }

  const handleNextClick = (): void => {
    if (currentStep === 1) {
      if (!validateProgramSelection()) return
      setStep(2)
      return
    }

    if (currentStep === 2) {
      if (!validatePersonalInformation()) return
      populateValidationDetails()
      setStep(3)
    }
  }

  const handleBackClick = (): void => {
    if (currentStep === 2) {
      setStep(1)
    } else if (currentStep === 3) {
      setStep(2)
    }
    setMessage(messageEl, '')
  }

  const handleSubmitClick = (): void => {
    void onSubmit()
  }
  const syncStepState = (): void => {
    updateStep1CardFlow()
    updateNextButtonState()
  }

  const inputWatchSelectors = [
    'input[name="admission-student-type"]',
    'input[name="admission-program"]',
    '#admission-first-name',
    '#admission-middle-name',
    '#admission-last-name',
    '#admission-gender',
    '#admission-birth-date',
    '#admission-contact-info-id',
    '#admission-emergency-contact-id',
    '#admission-current-address-id',
    '#admission-permanent-address-id',
  ]
  const watchedInputs = inputWatchSelectors
    .flatMap((selector) => Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>(selector)))
    .filter((el, index, arr) => arr.indexOf(el) === index)

  watchedInputs.forEach((input) => {
    input.addEventListener('change', syncStepState)
    input.addEventListener('input', syncStepState)
  })

  nextButton.addEventListener('click', handleNextClick)
  backButton.addEventListener('click', handleBackClick)
  submitButton.addEventListener('click', handleSubmitClick)
  if (programCard) {
    programCard.classList.add('admission-registration-step-hidden')
  }
  setStep(1, false)

  return () => {
    watchedInputs.forEach((input) => {
      input.removeEventListener('change', syncStepState)
      input.removeEventListener('input', syncStepState)
    })
    nextButton.removeEventListener('click', handleNextClick)
    backButton.removeEventListener('click', handleBackClick)
    submitButton.removeEventListener('click', handleSubmitClick)
    cleanupBirthDateClick()
  }
}
