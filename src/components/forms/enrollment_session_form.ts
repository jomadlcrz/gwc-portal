import { createEnrollmentSession } from '../../api/v1/enrollment_sessions'

function floatingInput(id: string, label: string, type = 'text', required = true): string {
  return `
    <div class="form-floating">
      <input 
        type="${type}" 
        class="form-control form-control-sm" 
        id="${id}" 
        placeholder="${label}"
        ${required ? 'required' : ''}
      />
      <label for="${id}">${label}</label>
    </div>
  `
}

function floatingSelect(id: string, label: string, options: string[], required = true): string {
  return `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}" ${required ? 'required' : ''}>
        <option value="">Select ${label}</option>
        ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>
      <label for="${id}">${label}</label>
    </div>
  `
}

export function renderEnrollmentSessionForm(): string {
  return `
    <div class="enrollment-session-form-container">
      <form id="enrollment-session-form" class="enrollment-session-form">
        <div class="form-section">
          <h5 class="mb-3">Create Enrollment Session</h5>
          
          <div class="enrollment-form-grid">
            ${floatingInput('school-year', 'School Year (YYYY-YYYY)', 'text', true)}
            ${floatingSelect(
              'semester',
              'Semester',
              ['1st Semester', '2nd Semester', 'Summer'],
              true
            )}
            ${floatingSelect(
              'year-level',
              'Year Level',
              ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
              true
            )}
            ${floatingInput('opening-date', 'Opening Date', 'date', true)}
            ${floatingInput('closing-date', 'Closing Date', 'date', true)}
          </div>

          <div class="enrollment-form-actions mt-3">
            <button type="submit" class="btn btn-primary btn-sm">
              Create Enrollment Session
            </button>
            <button type="reset" class="btn btn-secondary btn-sm">
              Clear Form
            </button>
          </div>

          <div id="enrollment-form-message" class="enrollment-form-message mt-2"></div>
        </div>
      </form>
    </div>
  `
}

export function setupEnrollmentSessionForm(root: HTMLElement, onSuccess?: (data: any) => void): () => void {
  const form = root.querySelector<HTMLFormElement>('#enrollment-session-form')
  const messageEl = root.querySelector<HTMLElement>('#enrollment-form-message')

  if (!form) return () => {}

  const setMessage = (message: string, isError: boolean): void => {
    if (!messageEl) return
    messageEl.textContent = message
    messageEl.classList.toggle('text-danger', isError)
    messageEl.classList.toggle('text-success', !isError)
    messageEl.style.display = 'block'
  }

  const onSubmit = async (event: Event): Promise<void> => {
    event.preventDefault()
    setMessage('Creating enrollment session...', false)

    const schoolYearInput = form.querySelector<HTMLInputElement>('#school-year')
    const semesterSelect = form.querySelector<HTMLSelectElement>('#semester')
    const yearLevelSelect = form.querySelector<HTMLSelectElement>('#year-level')
    const openingDateInput = form.querySelector<HTMLInputElement>('#opening-date')
    const closingDateInput = form.querySelector<HTMLInputElement>('#closing-date')

    if (!schoolYearInput || !semesterSelect || !yearLevelSelect || !openingDateInput || !closingDateInput) {
      setMessage('Form fields are missing.', true)
      return
    }

    const schoolYear = schoolYearInput.value.trim()
    const semester = semesterSelect.value
    const yearLevel = yearLevelSelect.value
    const openingDate = openingDateInput.value
    const closingDate = closingDateInput.value

    try {
      const response = await createEnrollmentSession({
        schoolYear,
        semester,
        yearLevel,
        openingDate,
        closingDate,
      })

      setMessage(
        response.message || `Enrollment session created successfully for ${semester}.`,
        false
      )

      // Call success callback with data if provided
      if (onSuccess && response.data) {
        onSuccess(response.data)
      }

      // Reset form after successful submission
      setTimeout(() => {
        form.reset()
        if (messageEl) {
          messageEl.style.display = 'none'
        }
      }, 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred.'
      setMessage(errorMessage, true)
    }
  }

  form.addEventListener('submit', onSubmit)

  return () => {
    form.removeEventListener('submit', onSubmit)
  }
}
