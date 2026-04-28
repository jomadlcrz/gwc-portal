import {
  ADMISSION_APPLICATIONS,
  type AdmissionApplication,
  type AdmissionApplicationStatus,
} from '../../data/admission'

type AdmissionStats = {
  total: number
  applicationReceived: number
  underReview: number
  approved: number
  notSelected: number
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

  updateApplication(
    applicationNo: string,
    updates: {
      status?: AdmissionApplicationStatus
      fieldUpdates?: Record<string, string>
    },
  ): boolean {
    const application = this.findByApplicationNo(applicationNo)
    if (!application) return false

    if (updates.status) {
      application.status = updates.status
    }

    const fieldUpdates = updates.fieldUpdates ?? {}
    Object.entries(fieldUpdates).forEach(([field, value]) => {
      switch (field) {
        case 'personalInfo.email':
          application.personalInfo.email = value
          break
        case 'personalInfo.mobile':
          application.personalInfo.mobile = value
          break
        case 'personalInfo.phone':
          application.personalInfo.phone = value
          break
        case 'personalInfo.birthDate':
          application.personalInfo.birthDate = value
          break
        case 'personalInfo.birthPlace':
          application.personalInfo.birthPlace = value
          break
        case 'personalInfo.sex':
          application.personalInfo.sex = value
          break
        case 'personalInfo.citizenship':
          application.personalInfo.citizenship = value
          break
        case 'personalInfo.civilStatus':
          application.personalInfo.civilStatus = value
          break
        case 'personalInfo.religion':
          application.personalInfo.religion = value
          break
        case 'personalInfo.cityProvince':
          application.personalInfo.cityProvince = value
          break
        case 'personalInfo.address':
          application.personalInfo.address = value
          break
        case 'educationalInfo.seniorHighSchool':
          application.educationalInfo.seniorHighSchool = value
          break
        case 'educationalInfo.strand':
          application.educationalInfo.strand = value
          break
        case 'educationalInfo.yearGraduated':
          application.educationalInfo.yearGraduated = value
          break
        case 'educationalInfo.generalAverage':
          application.educationalInfo.generalAverage = value
          break
        case 'educationalInfo.lastSchoolAttended':
          application.educationalInfo.lastSchoolAttended = value
          break
        case 'educationalInfo.lastCourse':
          application.educationalInfo.lastCourse = value
          break
        case 'educationalInfo.lastSchoolYear':
          application.educationalInfo.lastSchoolYear = value
          break
        case 'otherInfo.alsPasser':
          application.otherInfo.alsPasser = value === 'Yes' ? 'Yes' : 'No'
          break
        case 'otherInfo.is4PsBeneficiary':
          application.otherInfo.is4PsBeneficiary = value === 'Yes' ? 'Yes' : 'No'
          break
        case 'otherInfo.isPWD':
          application.otherInfo.isPWD = value === 'Yes' ? 'Yes' : 'No'
          break
        case 'otherInfo.isIndigenous':
          application.otherInfo.isIndigenous = value === 'Yes' ? 'Yes' : 'No'
          break
        case 'otherInfo.isSoloParent':
          application.otherInfo.isSoloParent = value === 'Yes' ? 'Yes' : 'No'
          break
      }
    })

    return true
  },

  getStats(): AdmissionStats {
    const applications = this.list()
    return {
      total: applications.length,
      applicationReceived: applications.filter((entry) => entry.status === 'Application Received').length,
      underReview: applications.filter((entry) => entry.status === 'Under Review').length,
      approved: applications.filter((entry) => entry.status === 'Approved').length,
      notSelected: applications.filter((entry) => entry.status === 'Not Selected').length,
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
