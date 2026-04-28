import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderAdminSectionTitle } from '../../../components/ui/section_title_heading'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { type AdmissionApplicationStatus } from '../../../data/admission'
import { admissionService } from '../../../features/admission/service'

const ADMISSION_STATUSES: AdmissionApplicationStatus[] = [
  'Application Received',
  'Under Review',
  'Approved',
  'Not Selected',
]

function getStatusBadgeClass(status: AdmissionApplicationStatus): string {
  if (status === 'Approved') return 'is-approved'
  if (status === 'Not Selected') return 'is-rejected'
  if (status === 'Under Review') return 'is-pending'
  return 'is-pending'
}

function renderStatusBadge(status: AdmissionApplicationStatus, attrs = ''): string {
  return `<span class="registrar-status-badge ${getStatusBadgeClass(status)}" ${attrs}>${status}</span>`
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

function getAdmissionUploadedDocumentItems(
  admissionType: string,
  uploadedDocuments: {
    photo2x2: string
    gradesCopy: string
    idOrCertificate: string
  },
): Array<{ title: string; src: string; alt: string }> {
  const normalizedType = admissionType.trim().toLowerCase()
  if (normalizedType.includes('transferee')) {
    return [
      {
        title: 'Transfer Credentials',
        src: uploadedDocuments.gradesCopy,
        alt: 'Transfer credentials upload preview',
      },
      {
        title: 'Good Moral Certificate',
        src: uploadedDocuments.idOrCertificate,
        alt: 'Good moral certificate upload preview',
      },
      {
        title: '2x2 Photo',
        src: uploadedDocuments.photo2x2,
        alt: '2x2 photo upload preview',
      },
    ]
  }

  return [
    {
      title: 'Original Form 138',
      src: uploadedDocuments.gradesCopy,
      alt: 'Original Form 138 upload preview',
    },
    {
      title: 'PSA Birth Certificate Copy',
      src: uploadedDocuments.idOrCertificate,
      alt: 'PSA birth certificate upload preview',
    },
    {
      title: '2x2 Photo',
      src: uploadedDocuments.photo2x2,
      alt: '2x2 photo upload preview',
    },
  ]
}

function renderAdmissionManageForm(applicationNo: string): string {
  const application = admissionService.findByApplicationNo(applicationNo)
  if (!application) {
    return '<p class="mb-0">Admission record not found.</p>'
  }
  const requirementReminders = getAdmissionRequirementReminders(application.admissionType)
  const uploadedDocumentItems = getAdmissionUploadedDocumentItems(application.admissionType, application.uploadedDocuments)

  return `
    <div class="shared-modal-grid shared-modal-grid-1 registrar-admission-manage-form">
      <section>
        ${renderAdminSectionTitle('Registrar Decision')}
        <div class="shared-modal-grid shared-modal-grid-2">
          <div class="form-floating">
            <select id="admission-modal-status" class="form-select">
              ${ADMISSION_STATUSES.map((status) => `<option value="${status}" ${status === application.status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
            <label for="admission-modal-status">Application Status</label>
          </div>
          <div class="form-floating">
            <input id="admission-modal-program" class="form-control" value="${application.program}" readonly />
            <label for="admission-modal-program">Program</label>
          </div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Application Details')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating"><input class="form-control" value="${application.applicationNo}" readonly /><label>Application No.</label></div>
          <div class="form-floating"><input class="form-control" value="${application.admissionType}" readonly /><label>Admission Type</label></div>
          <div class="form-floating"><input class="form-control" value="${application.campus}" readonly /><label>Campus</label></div>
          <div class="form-floating"><input class="form-control" value="${application.submittedAt}" readonly /><label>Date Submitted</label></div>
          <div class="form-floating"><input class="form-control" value="${application.lastName}, ${application.firstName}${application.middleName ? ` ${application.middleName}` : ''}" readonly /><label>Applicant Name</label></div>
          <div class="form-floating"><input class="form-control" value="${application.schoolYear}" readonly /><label>School Year</label></div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Personal Information')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.email}" data-admission-edit="personalInfo.email" /><label>Email</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.mobile}" data-admission-edit="personalInfo.mobile" /><label>Mobile</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.phone}" data-admission-edit="personalInfo.phone" /><label>Phone</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.birthDate}" data-admission-edit="personalInfo.birthDate" /><label>Birth Date</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.birthPlace}" data-admission-edit="personalInfo.birthPlace" /><label>Birth Place</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.sex}" data-admission-edit="personalInfo.sex" /><label>Sex</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.citizenship}" data-admission-edit="personalInfo.citizenship" /><label>Citizenship</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.civilStatus}" data-admission-edit="personalInfo.civilStatus" /><label>Civil Status</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.religion}" data-admission-edit="personalInfo.religion" /><label>Religion</label></div>
          <div class="form-floating"><input class="form-control" value="${application.personalInfo.cityProvince}" data-admission-edit="personalInfo.cityProvince" /><label>City/Province</label></div>
          <div class="form-floating" style="grid-column: 1 / -1;"><input class="form-control" value="${application.personalInfo.address}" data-admission-edit="personalInfo.address" /><label>Address</label></div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Educational Information')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.seniorHighSchool}" data-admission-edit="educationalInfo.seniorHighSchool" /><label>Senior High School</label></div>
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.strand}" data-admission-edit="educationalInfo.strand" /><label>Strand</label></div>
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.yearGraduated}" data-admission-edit="educationalInfo.yearGraduated" /><label>Year Graduated</label></div>
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.generalAverage}" data-admission-edit="educationalInfo.generalAverage" /><label>General Average</label></div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('FOR TRANSFEREE / TECH-VOC COURSE GRADUATE / 2ND COURSE')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.lastSchoolAttended}" data-admission-edit="educationalInfo.lastSchoolAttended" /><label>Last School Attended</label></div>
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.lastCourse}" data-admission-edit="educationalInfo.lastCourse" /><label>Course</label></div>
          <div class="form-floating"><input class="form-control" value="${application.educationalInfo.lastSchoolYear}" data-admission-edit="educationalInfo.lastSchoolYear" /><label>Last School Year</label></div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Uploaded Documents')}
        <div class="shared-modal-grid shared-modal-grid-3">
          ${uploadedDocumentItems
            .map(
              (item) => `
                <article>
                  <h4 class="mb-2">${item.title}</h4>
                  <button
                    type="button"
                    data-admission-doc-full="${item.src}"
                    data-admission-doc-title="${item.title}"
                    style="border: 0; background: transparent; padding: 0; width: 100%; text-align: left; cursor: zoom-in;"
                  >
                    <img
                      src="${item.src}"
                      alt="${item.alt}"
                      style="width: 100%; height: 140px; object-fit: cover; border: 1px solid #c7d5e8; border-radius: 0.5rem;"
                    />
                  </button>
                </article>
              `,
            )
            .join('')}
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Other Information')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating">
            <select class="form-select" data-admission-edit="otherInfo.alsPasser">
              <option value="Yes" ${application.otherInfo.alsPasser === 'Yes' ? 'selected' : ''}>Yes</option>
              <option value="No" ${application.otherInfo.alsPasser === 'No' ? 'selected' : ''}>No</option>
            </select>
            <label>ALS Passer</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-admission-edit="otherInfo.is4PsBeneficiary">
              <option value="Yes" ${application.otherInfo.is4PsBeneficiary === 'Yes' ? 'selected' : ''}>Yes</option>
              <option value="No" ${application.otherInfo.is4PsBeneficiary === 'No' ? 'selected' : ''}>No</option>
            </select>
            <label>4Ps Beneficiary</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-admission-edit="otherInfo.isPWD">
              <option value="Yes" ${application.otherInfo.isPWD === 'Yes' ? 'selected' : ''}>Yes</option>
              <option value="No" ${application.otherInfo.isPWD === 'No' ? 'selected' : ''}>No</option>
            </select>
            <label>PWD</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-admission-edit="otherInfo.isIndigenous">
              <option value="Yes" ${application.otherInfo.isIndigenous === 'Yes' ? 'selected' : ''}>Yes</option>
              <option value="No" ${application.otherInfo.isIndigenous === 'No' ? 'selected' : ''}>No</option>
            </select>
            <label>Indigenous Peoples</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-admission-edit="otherInfo.isSoloParent">
              <option value="Yes" ${application.otherInfo.isSoloParent === 'Yes' ? 'selected' : ''}>Yes</option>
              <option value="No" ${application.otherInfo.isSoloParent === 'No' ? 'selected' : ''}>No</option>
            </select>
            <label>Solo Parent</label>
          </div>
        </div>
      </section>

      <section>
        ${renderAdminSectionTitle('Reminder Notes')}
        <ul class="mb-0 ps-3">
          ${requirementReminders.map((reminder) => `<li>${reminder}</li>`).join('')}
        </ul>
      </section>
    </div>
  `
}

function renderAdmissionQueueRows(): string {
  return admissionService
    .list()
    .map((application) => {
      const fullName = `${application.lastName}, ${application.firstName}${application.middleName ? ` ${application.middleName}` : ''}`
      const searchValue = [
        application.applicationNo,
        application.lastName,
        application.firstName,
        application.program,
        application.status,
        application.submittedAt,
      ]
        .join(' ')
        .toLowerCase()

      return `
      <tr data-admission-row data-search-value="${searchValue}" data-status-value="${application.status}">
        <td>${application.applicationNo}</td>
        <td>${fullName}</td>
        <td>${application.program}</td>
        <td data-admission-status-cell>${renderStatusBadge(application.status)}</td>
        <td>${application.submittedAt}</td>
        <td>
          <button type="button" class="btn btn-outline-primary btn-sm" data-admission-manage data-application-no="${application.applicationNo}">
            Manage
          </button>
        </td>
      </tr>
    `
    })
    .join('')
}

export function renderregistrar_admission_page(): string {
  const stats = admissionService.getStats()
  const enrollmentOpen = admissionService.isEnrollmentOpen()

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'admission',
    `
      <section class="registrar-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Admission', active: true },
        ])}

        <article class="registrar-panel registrar-dashboard">
          <header class="registrar-dashboard-head">
            <div>
              <h3>Admission Control Center</h3>
              <p>Review applications and update status decisions.</p>
            </div>
            <div class="registrar-dashboard-actions">
              <a href="${ROUTES.REGISTRAR_ADMISSION_REVIEW}" class="btn btn-sm btn-primary">Open Full Queue</a>
            </div>
          </header>

          <section class="registrar-kpi-grid mt-3">
            <article class="registrar-kpi-card"><p>Total Applications</p><strong>${stats.total}</strong></article>
            <article class="registrar-kpi-card"><p>Application Received</p><strong>${stats.applicationReceived}</strong></article>
            <article class="registrar-kpi-card"><p>Under Review</p><strong>${stats.underReview}</strong></article>
            <article class="registrar-kpi-card"><p>Approved</p><strong>${stats.approved}</strong></article>
            <article class="registrar-kpi-card"><p>Not Selected</p><strong>${stats.notSelected}</strong></article>
            <article class="registrar-kpi-card"><p>Campus</p><strong>Alaminos</strong></article>
          </section>

          <section class="mt-3">
            <article class="registrar-dashboard-card" data-enrollment-controls>
              <h4>Enrollment Control</h4>
              <p class="mb-2">Current Status: <strong class="registrar-enrollment-status ${enrollmentOpen ? 'is-open' : 'is-closed'}" data-enrollment-status-text>${enrollmentOpen ? 'OPEN' : 'CLOSED'}</strong></p>
              <div class="registrar-dashboard-actions">
                <button type="button" class="btn btn-sm btn-primary" data-enrollment-open ${enrollmentOpen ? 'disabled' : ''}>Open Enrollment</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" data-enrollment-close ${enrollmentOpen ? '' : 'disabled'}>Close Enrollment</button>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}

export function renderregistrar_admission_review_page(): string {
  const statusOptions = ADMISSION_STATUSES.map((status) => `<option value="${status}">${status}</option>`).join('')

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'admission',
    `
      <section class="registrar-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Admission', href: ROUTES.REGISTRAR_ADMISSION },
          { label: 'Queue', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Admission Queue</h2>
            <p>Total Applications: <strong>${admissionService.getStats().total}</strong></p>
          </header>

          <section class="admin-student-toolbar">
            <div class="admin-student-toolbar-actions">
              <label class="admin-directory-search admin-student-search">
                <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
                <input type="search" placeholder="Search applications" aria-label="Search applications" data-admission-search />
              </label>
            </div>
            <div class="admin-student-toolbar-actions">
              <button type="button" class="btn btn-outline-secondary btn-sm" data-admission-export>
                Export
              </button>
              <select class="form-select form-select-sm" data-admission-status-filter aria-label="Filter by status">
                <option value="">All Statuses</option>
                ${statusOptions}
              </select>
            </div>
          </section>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Application No.</th>
                  <th>Applicant Name</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${renderAdmissionQueueRows()}
                <tr class="d-none" data-admission-empty-row>
                  <td colspan="6" class="text-center py-3">No applications found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
      ${renderSharedModal('registrar-admission-manage-modal')}
      ${renderSharedModal('registrar-admission-document-modal')}
    `,
  )
}

export function renderregistrar_admission_details_page(applicationNo: string): string {
  const application = admissionService.findByApplicationNo(applicationNo)

  if (!application) {
    return renderPortalShell(
      registrar_SHELL_CONFIG,
      'admission',
      `
        <section class="registrar-content">
          ${renderAdminBreadcrumbNav([
            { label: 'Admission', href: ROUTES.REGISTRAR_ADMISSION },
            { label: 'Queue', href: ROUTES.REGISTRAR_ADMISSION_REVIEW },
            { label: 'Details', active: true },
          ])}
          <article class="registrar-panel">
            <h3>Admission Record Not Found</h3>
            <p>The selected admission application does not exist.</p>
          </article>
        </section>
      `,
    )
  }
  const uploadedDocumentItems = getAdmissionUploadedDocumentItems(application.admissionType, application.uploadedDocuments)

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'admission',
    `
      <section class="registrar-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Admission', href: ROUTES.REGISTRAR_ADMISSION },
          { label: 'Queue', href: ROUTES.REGISTRAR_ADMISSION_REVIEW },
          { label: application.applicationNo, active: true },
        ])}

        <article class="registrar-panel registrar-dashboard">
          <header class="registrar-dashboard-head">
            <div>
              <h3>${application.applicationNo}</h3>
              <p>${application.lastName}, ${application.firstName}${application.middleName ? ` ${application.middleName}` : ''}</p>
            </div>
            <div class="registrar-dashboard-actions">
              ${renderStatusBadge(application.status, 'data-admission-header-status-badge')}
              <a href="${ROUTES.REGISTRAR_ADMISSION_REVIEW}" class="btn btn-sm btn-outline-primary">Back to Queue</a>
            </div>
          </header>

          <section class="registrar-dashboard-grid mt-3">
            <article class="registrar-dashboard-card">
              <h4>Application Details</h4>
              <ul class="registrar-list">
                <li><strong>Campus:</strong> ${application.campus}</li>
                <li><strong>Admission Type:</strong> ${application.admissionType}</li>
                <li><strong>Program:</strong> ${application.program}</li>
                <li><strong>Submitted:</strong> ${application.submittedAt}</li>
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Contact Information</h4>
              <ul class="registrar-list">
                <li><strong>Email:</strong> ${application.personalInfo.email}</li>
                <li><strong>Mobile:</strong> ${application.personalInfo.mobile}</li>
                <li><strong>Address:</strong> ${application.personalInfo.address}</li>
                <li><strong>City/Province:</strong> ${application.personalInfo.cityProvince}</li>
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Educational Background</h4>
              <ul class="registrar-list">
                <li><strong>School:</strong> ${application.educationalInfo.seniorHighSchool}</li>
                <li><strong>Strand:</strong> ${application.educationalInfo.strand}</li>
                <li><strong>Year Graduated:</strong> ${application.educationalInfo.yearGraduated}</li>
                <li><strong>General Average:</strong> ${application.educationalInfo.generalAverage}</li>
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Uploaded Documents</h4>
              <ul class="registrar-list">
                ${uploadedDocumentItems
                  .map(
                    (item) => `
                      <li>
                        <strong>${item.title}:</strong>
                        <a href="${item.src}" target="_blank" rel="noreferrer">View Document</a>
                      </li>
                    `,
                  )
                  .join('')}
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Registrar Controls</h4>
              <div class="d-grid gap-2" data-admission-controls data-application-no="${application.applicationNo}">
                <label for="admission-status-select" class="form-label mb-1">Application Status</label>
                <select id="admission-status-select" class="form-select form-select-sm">
                  ${ADMISSION_STATUSES.map((status) => `<option value="${status}" ${status === application.status ? 'selected' : ''}>${status}</option>`).join('')}
                </select>

                <button type="button" class="btn btn-primary btn-sm mt-2" data-admission-save>Save Updates</button>
                <p class="mb-0 small text-success d-none" data-admission-save-message>Admission record updated.</p>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}

export function setupregistrar_admission_review_page(root: HTMLElement): () => void {
  const manageModal = setupSharedModal(root, { modalSelector: '#registrar-admission-manage-modal' })
  const documentModal = setupSharedModal(root, { modalSelector: '#registrar-admission-document-modal' })
  const searchInput = root.querySelector<HTMLInputElement>('[data-admission-search]')
  const statusFilter = root.querySelector<HTMLSelectElement>('[data-admission-status-filter]')
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-admission-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-admission-empty-row]')
  let activeApplicationNo: string | null = null
  let shouldRestoreManageModal = false

  documentModal.setOnClose(() => {
    if (!shouldRestoreManageModal) return
    manageModal.show()
    shouldRestoreManageModal = false
  })

  const getFilteredApplications = () => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    const status = (statusFilter?.value ?? '').trim()
    return admissionService.list().filter((application) => {
      const fullName = `${application.lastName}, ${application.firstName}${application.middleName ? ` ${application.middleName}` : ''}`
      const searchValue = [
        application.applicationNo,
        application.lastName,
        application.firstName,
        fullName,
        application.program,
        application.status,
        application.submittedAt,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchValue.includes(query)
      const matchesStatus = !status || application.status === status
      return matchesSearch && matchesStatus
    })
  }

  const toCsvCell = (value: string): string => `"${value.replaceAll('"', '""')}"`

  const exportAdmissionQueueCsv = (): void => {
    const filtered = getFilteredApplications()
    if (filtered.length === 0) {
      alert('No applications to export.')
      return
    }

    const header = ['Application No.', 'Applicant Name', 'Program', 'Status', 'Submitted']
    const rowsCsv = filtered.map((application) => {
      const fullName = `${application.lastName}, ${application.firstName}${application.middleName ? ` ${application.middleName}` : ''}`
      return [
        toCsvCell(application.applicationNo),
        toCsvCell(fullName),
        toCsvCell(application.program),
        toCsvCell(application.status),
        toCsvCell(application.submittedAt),
      ].join(',')
    })

    const csv = `${header.map(toCsvCell).join(',')}\n${rowsCsv.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const now = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `admission-queue-${now}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const applyFilters = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    const status = (statusFilter?.value ?? '').trim()

    let visibleCount = 0
    rows.forEach((row) => {
      const matchesSearch = (row.dataset.searchValue ?? '').includes(query)
      const matchesStatus = !status || row.dataset.statusValue === status
      const visible = matchesSearch && matchesStatus
      row.classList.toggle('d-none', !visible)
      if (visible) visibleCount += 1
    })

    emptyRow?.classList.toggle('d-none', visibleCount > 0)
  }

  const onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement
    const exportBtn = target.closest<HTMLButtonElement>('[data-admission-export]')
    if (exportBtn) {
      exportAdmissionQueueCsv()
      return
    }

    const previewButton = target.closest<HTMLButtonElement>('[data-admission-doc-full]')
    if (previewButton) {
      const imageSrc = previewButton.dataset.admissionDocFull
      if (!imageSrc) return

      const imageTitle = previewButton.dataset.admissionDocTitle ?? 'Uploaded Document'
      const bodyHtml = `
        <div class="admission-doc-full-view">
          <img src="${imageSrc}" alt="${imageTitle}" />
        </div>
      `

      shouldRestoreManageModal = true
      manageModal.hide()
      documentModal.setMode('form')
      documentModal.setOnConfirm(null)
      documentModal.open({
        title: imageTitle,
        bodyHtml,
        hideConfirm: true,
      })
      return
    }

    const manageButton = target.closest<HTMLButtonElement>('[data-admission-manage]')
    if (!manageButton) return

    const applicationNo = manageButton.dataset.applicationNo
    if (!applicationNo) return
    activeApplicationNo = applicationNo

    shouldRestoreManageModal = false
    documentModal.close()
    manageModal.setMode('form')
    manageModal.open({
      title: `Manage ${applicationNo}`,
      bodyHtml: renderAdmissionManageForm(applicationNo),
      confirmLabel: 'Save Updates',
    })

    manageModal.setOnConfirm(() => {
      if (!activeApplicationNo) return
      const statusInput = root.querySelector<HTMLSelectElement>('#admission-modal-status')
      if (!statusInput) return

      const nextStatus = statusInput.value as AdmissionApplicationStatus
      const editableInputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-admission-edit]'))
      const fieldUpdates = editableInputs.reduce<Record<string, string>>((updates, input) => {
        const field = input.dataset.admissionEdit
        if (!field) return updates
        updates[field] = input.value.trim()
        return updates
      }, {})

      const updated = admissionService.updateApplication(activeApplicationNo, {
        status: nextStatus,
        fieldUpdates,
      })
      if (!updated) return

      const row = root.querySelector<HTMLTableRowElement>(`[data-admission-row] [data-admission-manage][data-application-no="${activeApplicationNo}"]`)?.closest('tr')
      if (row) {
        row.dataset.statusValue = nextStatus
        const statusCell = row.querySelector<HTMLElement>('[data-admission-status-cell]')
        if (statusCell) statusCell.innerHTML = renderStatusBadge(nextStatus)
      }

      applyFilters()
      manageModal.close()
    })
  }

  searchInput?.addEventListener('input', applyFilters)
  statusFilter?.addEventListener('change', applyFilters)
  root.addEventListener('click', onRootClick)
  applyFilters()

  return () => {
    manageModal.destroy()
    documentModal.destroy()
    searchInput?.removeEventListener('input', applyFilters)
    statusFilter?.removeEventListener('change', applyFilters)
    root.removeEventListener('click', onRootClick)
  }
}

export function setupregistrar_admission_page(root: HTMLElement): () => void {
  const openButton = root.querySelector<HTMLButtonElement>('[data-enrollment-open]')
  const closeButton = root.querySelector<HTMLButtonElement>('[data-enrollment-close]')
  const statusText = root.querySelector<HTMLElement>('[data-enrollment-status-text]')

  if (!openButton || !closeButton || !statusText) return () => {}

  const syncState = (): void => {
    const isOpen = admissionService.isEnrollmentOpen()
    statusText.textContent = isOpen ? 'OPEN' : 'CLOSED'
    statusText.classList.toggle('is-open', isOpen)
    statusText.classList.toggle('is-closed', !isOpen)
    openButton.disabled = isOpen
    closeButton.disabled = !isOpen
  }

  const onOpen = (): void => {
    const confirmed = window.confirm('Open enrollment now? Applicants will be able to submit online admission forms.')
    if (!confirmed) return
    admissionService.setEnrollmentOpen(true)
    syncState()
  }

  const onClose = (): void => {
    const confirmed = window.confirm('Close enrollment now? Applicants will no longer be able to submit online admission forms.')
    if (!confirmed) return
    admissionService.setEnrollmentOpen(false)
    syncState()
  }

  openButton.addEventListener('click', onOpen)
  closeButton.addEventListener('click', onClose)
  syncState()

  return () => {
    openButton.removeEventListener('click', onOpen)
    closeButton.removeEventListener('click', onClose)
  }
}

export function setupregistrar_admission_details_page(root: HTMLElement): () => void {
  const controls = root.querySelector<HTMLElement>('[data-admission-controls]')
  const saveButton = root.querySelector<HTMLButtonElement>('[data-admission-save]')
  const statusInput = root.querySelector<HTMLSelectElement>('#admission-status-select')
  const message = root.querySelector<HTMLElement>('[data-admission-save-message]')
  const headerStatusBadge = root.querySelector<HTMLElement>('[data-admission-header-status-badge]')

  if (!controls || !saveButton || !statusInput) return () => {}

  const applicationNo = controls.dataset.applicationNo
  if (!applicationNo) return () => {}

  const onSave = (): void => {
    const updatedStatus = statusInput.value as AdmissionApplicationStatus

    const statusSaved = admissionService.updateStatus(applicationNo, updatedStatus)
    if (!statusSaved) return

    if (headerStatusBadge) {
      headerStatusBadge.textContent = updatedStatus
      headerStatusBadge.className = `registrar-status-badge ${getStatusBadgeClass(updatedStatus)}`
    }
    message?.classList.remove('d-none')
  }

  saveButton.addEventListener('click', onSave)

  return () => {
    saveButton.removeEventListener('click', onSave)
  }
}
