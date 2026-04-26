import {
  ADMISSION_APPLICATIONS,
  type AdmissionApplication,
  type AdmissionApplicationStatus,
} from '../../data/admission'

type AdmissionStats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

const ENROLLMENT_OPEN_STORAGE_KEY = 'gwc:admission:enrollment-open'

const state: AdmissionApplication[] = ADMISSION_APPLICATIONS.map((application) => ({
  ...application,
  personalInfo: { ...application.personalInfo },
  uploadedDocuments: { ...application.uploadedDocuments },
  educationalInfo: { ...application.educationalInfo },
  otherInfo: { ...application.otherInfo },
  reminders: [...application.reminders],
}))

const enrollmentState = {
  isOpen: false,
}

if (typeof window !== 'undefined') {
  const persisted = window.localStorage.getItem(ENROLLMENT_OPEN_STORAGE_KEY)
  if (persisted === '1') enrollmentState.isOpen = true
}

function bySubmittedDateDesc(left: AdmissionApplication, right: AdmissionApplication): number {
  return new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
}

export const admissionService = {
  list(): AdmissionApplication[] {
    return [...state].sort(bySubmittedDateDesc)
  },

  findByApplicationNo(applicationNo: string): AdmissionApplication | undefined {
    const normalized = applicationNo.trim().toLowerCase()
    return state.find((entry) => entry.applicationNo.toLowerCase() === normalized)
  },

  updateStatus(applicationNo: string, status: AdmissionApplicationStatus): boolean {
    const application = this.findByApplicationNo(applicationNo)
    if (!application) return false
    application.status = status
    return true
  },

  updateRemarks(applicationNo: string, remarks: string): boolean {
    const application = this.findByApplicationNo(applicationNo)
    if (!application) return false
    application.remarks = remarks.trim()
    return true
  },

  getStats(): AdmissionStats {
    const applications = this.list()
    return {
      total: applications.length,
      pending: applications.filter((entry) => entry.status === 'Pending').length,
      approved: applications.filter((entry) => entry.status === 'Approved').length,
      rejected: applications.filter((entry) => entry.status === 'Rejected').length,
    }
  },

  isEnrollmentOpen(): boolean {
    return enrollmentState.isOpen
  },

  setEnrollmentOpen(isOpen: boolean): void {
    enrollmentState.isOpen = isOpen
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ENROLLMENT_OPEN_STORAGE_KEY, isOpen ? '1' : '0')
    }
  },
}
