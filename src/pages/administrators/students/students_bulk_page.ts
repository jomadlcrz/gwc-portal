import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderStudentAccountForm } from '../../../components/forms/student_account_form'
import { hydrateLocationSelects, setupProvinceCityCascade } from '../../../api/psgc'

function renderBulkCard(index: number): string {
  const prefix = `bulk-${index}`
  return `
    <article class="admin-bulk-card" data-bulk-card data-bulk-prefix="${prefix}">
      <header>
        <h4 data-bulk-card-title>Student ${index}</h4>
        <button type="button" class="btn btn-outline-secondary btn-sm" data-remove-card>Remove</button>
      </header>
      <p>Fill out the student details below.</p>
      ${renderStudentAccountForm(prefix)}
    </article>
  `
}

export function renderstudents_bulk_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS },
          { label: 'Students', href: ROUTES.ADMINISTRATORS_STUDENTS },
          { label: 'Manage Students', href: ROUTES.ADMINISTRATORS_STUDENTS_MANAGE },
          { label: 'Bulk Upload', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Bulk Student Upload</h2>
            <p>Import multiple students using a CSV file.</p>
          </header>

          <section class="admin-student-toolbar admin-student-toolbar-start">
            <button type="button" class="btn btn-outline-primary btn-sm" data-bulk-upload-trigger>Upload CSV</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-bulk-paste-trigger>Paste Data</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-bulk-add-card>+ Add Student Card</button>
            <input type="file" accept=".csv,text/csv" hidden data-bulk-csv-input />
          </section>

          <p class="admin-bulk-status d-none" data-bulk-status role="status" aria-live="polite"></p>
          <section data-bulk-cards>
            ${renderBulkCard(1)}
          </section>

          <footer class="admin-student-form-footer">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm" data-bulk-create>Create Accounts</button>
          </footer>
        </article>
      </section>
    `,
  )
}

type StudentBulkRecord = Record<string, string>

const CSV_FIELD_ALIASES: Record<string, string> = {
  studentid: 'student-id',
  studentno: 'student-id',
  first: 'first-name',
  firstname: 'first-name',
  middlename: 'middle-name',
  middle: 'middle-name',
  lastname: 'last-name',
  last: 'last-name',
  email: 'email',
  emailaddress: 'email',
  course: 'course',
  year: 'year-level',
  yearlevel: 'year-level',
  studenttype: 'student-type',
  section: 'section',
  gender: 'gender',
  birthdate: 'birth-date',
  dateofbirth: 'birth-date',
  province: 'province',
  city: 'city',
  citymunicipality: 'city',
  barangay: 'barangay',
  street: 'street',
  fatherfirstname: 'father-first-name',
  fathermiddlename: 'father-middle-name',
  fatherlastname: 'father-last-name',
  fathercontact: 'father-contact-number',
  fathercontactnumber: 'father-contact-number',
  motherfirstname: 'mother-first-name',
  mothermiddlename: 'mother-middle-name',
  motherlastname: 'mother-last-name',
  mothercontact: 'mother-contact-number',
  mothercontactnumber: 'mother-contact-number',
  guardianfirstname: 'guardian-first-name',
  guardianmiddlename: 'guardian-middle-name',
  guardianlastname: 'guardian-last-name',
  guardiancontact: 'guardian-contact-number',
  guardiancontactnumber: 'guardian-contact-number',
  guardianrelation: 'guardian-relation',
}

const normalizeHeader = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

function parseCsvRows(content: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index]
    const next = content[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(cell.trim())
      cell = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1
      row.push(cell.trim())
      const hasValue = row.some((value) => value !== '')
      if (hasValue) rows.push(row)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim())
    const hasValue = row.some((value) => value !== '')
    if (hasValue) rows.push(row)
  }

  return rows
}

function mapCsvToRecords(content: string): StudentBulkRecord[] {
  const rows = parseCsvRows(content)
  if (rows.length < 2) return []

  const headers = rows[0].map((header) => CSV_FIELD_ALIASES[normalizeHeader(header)] ?? '')
  const mappedRecords: StudentBulkRecord[] = []

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex]
    const record: StudentBulkRecord = {}
    headers.forEach((suffix, columnIndex) => {
      if (!suffix) return
      const value = row[columnIndex]?.trim() ?? ''
      if (value) record[suffix] = value
    })
    if (Object.keys(record).length > 0) mappedRecords.push(record)
  }

  return mappedRecords
}

export function setupstudents_bulk_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const cleanupCascade = setupProvinceCityCascade(root)
  const cardsContainer = root.querySelector<HTMLElement>('[data-bulk-cards]')
  const uploadButton = root.querySelector<HTMLButtonElement>('[data-bulk-upload-trigger]')
  const pasteButton = root.querySelector<HTMLButtonElement>('[data-bulk-paste-trigger]')
  const addCardButton = root.querySelector<HTMLButtonElement>('[data-bulk-add-card]')
  const createButton = root.querySelector<HTMLButtonElement>('[data-bulk-create]')
  const csvInput = root.querySelector<HTMLInputElement>('[data-bulk-csv-input]')
  const statusElement = root.querySelector<HTMLElement>('[data-bulk-status]')
  let nextCardIndex = 2

  const showStatus = (message: string, isError = false): void => {
    if (!statusElement) return
    statusElement.textContent = message
    statusElement.classList.remove('d-none', 'is-error', 'is-success')
    statusElement.classList.add(isError ? 'is-error' : 'is-success')
  }

  const renderCardOrder = (): void => {
    if (!cardsContainer) return
    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('[data-bulk-card]'))
    cards.forEach((card, index) => {
      const title = card.querySelector<HTMLElement>('[data-bulk-card-title]')
      if (title) title.textContent = `Student ${index + 1}`
      const removeButton = card.querySelector<HTMLButtonElement>('[data-remove-card]')
      if (removeButton) removeButton.disabled = cards.length === 1
    })
  }

  const appendCard = (record?: StudentBulkRecord): void => {
    if (!cardsContainer) return
    cardsContainer.insertAdjacentHTML('beforeend', renderBulkCard(nextCardIndex))
    const card = cardsContainer.lastElementChild as HTMLElement | null
    nextCardIndex += 1

    const prefix = card?.dataset.bulkPrefix ?? ''
    if (card && prefix && record) {
      Object.entries(record).forEach(([fieldSuffix, value]) => {
        const input = card.querySelector<HTMLInputElement | HTMLSelectElement>(`#${prefix}-${fieldSuffix}`)
        if (!input) return
        if (input instanceof HTMLSelectElement) input.dataset.pendingValue = value
        input.value = value
      })
    }
    if (card) void hydrateLocationSelects(card)

    renderCardOrder()
  }

  const replaceWithRecords = (records: StudentBulkRecord[]): void => {
    if (!cardsContainer) return
    cardsContainer.innerHTML = ''
    records.forEach((record) => appendCard(record))
    if (records.length === 0) appendCard()
    showStatus(`Loaded ${records.length} student record${records.length === 1 ? '' : 's'}.`, records.length === 0)
  }

  const onUploadClick = (): void => csvInput?.click()

  const onCsvSelected = async (): Promise<void> => {
    const file = csvInput?.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const records = mapCsvToRecords(content)
      replaceWithRecords(records)
    } catch {
      showStatus('Unable to read CSV file.', true)
    } finally {
      if (csvInput) csvInput.value = ''
    }
  }

  const onPasteClick = (): void => {
    const pasted = window.prompt('Paste CSV content with a header row:')
    if (!pasted) return
    const records = mapCsvToRecords(pasted)
    replaceWithRecords(records)
  }

  const onAddCardClick = (): void => {
    appendCard()
    showStatus('Added a blank student card.')
  }

  const onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const removeButton = target?.closest<HTMLButtonElement>('[data-remove-card]')
    if (!removeButton || !cardsContainer) return
    const card = removeButton.closest<HTMLElement>('[data-bulk-card]')
    if (!card) return
    card.remove()
    if (cardsContainer.querySelectorAll('[data-bulk-card]').length === 0) appendCard()
    renderCardOrder()
    showStatus('Removed student card.')
  }

  const onCreateClick = (): void => {
    const cards = Array.from(cardsContainer?.querySelectorAll<HTMLElement>('[data-bulk-card]') ?? [])
    const requiredFields = ['student-id', 'first-name', 'last-name', 'email']
    let invalidCount = 0

    cards.forEach((card) => {
      const prefix = card.dataset.bulkPrefix ?? ''
      requiredFields.forEach((suffix) => {
        const field = card.querySelector<HTMLInputElement>(`#${prefix}-${suffix}`)
        const isInvalid = !field?.value.trim()
        field?.classList.toggle('is-invalid', isInvalid)
        if (isInvalid) invalidCount += 1
      })
    })

    if (invalidCount > 0) {
      showStatus('Complete required fields (Student ID, First Name, Last Name, Email) before creating accounts.', true)
      return
    }

    showStatus(`Ready to create ${cards.length} student account${cards.length === 1 ? '' : 's'}.`)
  }

  uploadButton?.addEventListener('click', onUploadClick)
  csvInput?.addEventListener('change', onCsvSelected)
  pasteButton?.addEventListener('click', onPasteClick)
  addCardButton?.addEventListener('click', onAddCardClick)
  createButton?.addEventListener('click', onCreateClick)
  root.addEventListener('click', onRootClick)
  void hydrateLocationSelects(root)
  renderCardOrder()

  return () => {
    cleanupCascade()
    cleanupShell()
    uploadButton?.removeEventListener('click', onUploadClick)
    csvInput?.removeEventListener('change', onCsvSelected)
    pasteButton?.removeEventListener('click', onPasteClick)
    addCardButton?.removeEventListener('click', onAddCardClick)
    createButton?.removeEventListener('click', onCreateClick)
    root.removeEventListener('click', onRootClick)
  }
}


