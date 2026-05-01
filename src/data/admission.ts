export type AdmissionApplicationStatus = 'Pending' | 'Approved' | 'Disqualified'

export type AdmissionApplication = {
  applicationNo: string
  firstName: string
  middleName?: string
  lastName: string
  campus: string
  admissionType: string
  courseFirstChoice: string
  courseSecondChoice: string
  courseThirdChoice: string
  program: string
  schoolYear: string
  submittedAt: string
  status: AdmissionApplicationStatus
  personalInfo: {
    address: string
    cityProvince: string
    phone: string
    mobile: string
    email: string
    birthDate: string
    birthPlace: string
    sex: string
    citizenship: string
    civilStatus: string
    religion: string
  }
  uploadedDocuments: {
    photo2x2: string
    gradesCopy: string
    idOrCertificate: string
  }
  educationalInfo: {
    seniorHighSchool: string
    strand: string
    yearGraduated: string
    generalAverage: string
    lastSchoolAttended: string
    lastCourse: string
    lastSchoolYear: string
  }
  otherInfo: {
    alsPasser: 'Yes' | 'No'
    is4PsBeneficiary: 'Yes' | 'No'
    isPWD: 'Yes' | 'No'
    isIndigenous: 'Yes' | 'No'
    isSoloParent: 'Yes' | 'No'
  }
  reminders: string[]
}

export const ADMISSION_APPLICATIONS: AdmissionApplication[] = [
  {
    applicationNo: 'GWC-ADM-2026-1',
    firstName: 'Maria',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    campus: 'Alaminos City Campus',
    admissionType: 'First Year',
    courseFirstChoice: 'BS Information Technology',
    courseSecondChoice: 'BS Computer Science',
    courseThirdChoice: 'BS Business Administration',
    program: 'BS Information Technology',
    schoolYear: 'S.Y. 2026 - 2027',
    submittedAt: 'January 12, 2026',
    status: 'Disqualified',
    personalInfo: {
      address: 'Purok 3, Barangay San Jose',
      cityProvince: 'Alaminos City, Pangasinan',
      phone: '075-551-2211',
      mobile: '09171234567',
      email: 'maria.delacruz@example.com',
      birthDate: 'October 19, 2003',
      birthPlace: 'Alaminos City, Pangasinan',
      sex: 'Female',
      citizenship: 'Filipino',
      civilStatus: 'Single',
      religion: 'Roman Catholic',
    },
    uploadedDocuments: {
      photo2x2: '/images/admission_cover.png',
      gradesCopy: '/images/cover.avif',
      idOrCertificate: '/images/cover.avif',
    },
    educationalInfo: {
      seniorHighSchool: 'Alaminos National Senior High School',
      strand: 'STEM',
      yearGraduated: '2026',
      generalAverage: '91.50',
      lastSchoolAttended: 'N/A',
      lastCourse: 'N/A',
      lastSchoolYear: 'N/A',
    },
    otherInfo: {
      alsPasser: 'No',
      is4PsBeneficiary: 'No',
      isPWD: 'No',
      isIndigenous: 'No',
      isSoloParent: 'No',
    },
    reminders: [
      'This is an application for admission and not yet enrollment.',
      'Please wait for the official admissions update on your application status.',
      'Bring original documents during onsite verification.',
    ],
  },
  {
    applicationNo: 'GWC-ADM-2026-2',
    firstName: 'John Mark',
    middleName: 'Reyes',
    lastName: 'Garcia',
    campus: 'Alaminos City Campus',
    admissionType: 'First Year',
    courseFirstChoice: 'BS Criminology',
    courseSecondChoice: 'BS Information Technology',
    courseThirdChoice: 'BS Business Administration',
    program: 'BS Criminology',
    schoolYear: 'S.Y. 2026 - 2027',
    submittedAt: 'January 18, 2026',
    status: 'Pending',
    personalInfo: {
      address: 'Quezon Avenue, Barangay Poblacion',
      cityProvince: 'Alaminos City, Pangasinan',
      phone: '075-552-1122',
      mobile: '09971234567',
      email: 'john.garcia@example.com',
      birthDate: 'October 19, 2003',
      birthPlace: 'Bolinao, Pangasinan',
      sex: 'Male',
      citizenship: 'Filipino',
      civilStatus: 'Single',
      religion: 'Christian',
    },
    uploadedDocuments: {
      photo2x2: '/images/admission_cover.png',
      gradesCopy: '/images/cover.avif',
      idOrCertificate: '/images/cover.avif',
    },
    educationalInfo: {
      seniorHighSchool: 'Bolinao Senior High School',
      strand: 'HUMSS',
      yearGraduated: '2026',
      generalAverage: '88.20',
      lastSchoolAttended: 'N/A',
      lastCourse: 'N/A',
      lastSchoolYear: 'N/A',
    },
    otherInfo: {
      alsPasser: 'No',
      is4PsBeneficiary: 'Yes',
      isPWD: 'No',
      isIndigenous: 'No',
      isSoloParent: 'No',
    },
    reminders: [
      'Ensure all uploaded files are clear and readable.',
      'Admissions may contact you for additional documents.',
      'Only one active application is allowed per applicant.',
    ],
  },
  {
    applicationNo: 'GWC-ADM-2026-3',
    firstName: 'Angela',
    middleName: 'Lopez',
    lastName: 'Mendoza',
    campus: 'Alaminos City Campus',
    admissionType: 'Transferee',
    courseFirstChoice: 'BS Business Administration',
    courseSecondChoice: 'BS Computer Science',
    courseThirdChoice: 'BS Information Technology',
    program: 'BS Business Administration',
    schoolYear: 'S.Y. 2026 - 2027',
    submittedAt: 'February 01, 2026',
    status: 'Approved',
    personalInfo: {
      address: 'Rizal Street, Barangay Lucap',
      cityProvince: 'Alaminos City, Pangasinan',
      phone: '075-553-8899',
      mobile: '09199887766',
      email: 'angela.mendoza@example.com',
      birthDate: 'October 19, 2003',
      birthPlace: 'Dagupan City, Pangasinan',
      sex: 'Female',
      citizenship: 'Filipino',
      civilStatus: 'Single',
      religion: 'Roman Catholic',
    },
    uploadedDocuments: {
      photo2x2: '/images/admission_cover.png',
      gradesCopy: '/images/cover.avif',
      idOrCertificate: '/images/cover.avif',
    },
    educationalInfo: {
      seniorHighSchool: 'Dagupan Senior High School',
      strand: 'ABM',
      yearGraduated: '2024',
      generalAverage: '90.10',
      lastSchoolAttended: 'Pangasinan State University',
      lastCourse: 'BS Accountancy',
      lastSchoolYear: '2024 - 2025',
    },
    otherInfo: {
      alsPasser: 'No',
      is4PsBeneficiary: 'No',
      isPWD: 'No',
      isIndigenous: 'No',
      isSoloParent: 'No',
    },
    reminders: [
      'Proceed to registrar for enrollment clearance.',
      'Submit original transcript and honorable dismissal.',
      'Enrollment slot is reserved until the deadline only.',
    ],
  },
  {
    applicationNo: 'GWC-ADM-2026-4',
    firstName: 'Paolo',
    middleName: 'Villanueva',
    lastName: 'Dela Cruz',
    campus: 'Alaminos City Campus',
    admissionType: 'First Year',
    courseFirstChoice: 'Bachelor of Elementary Education',
    courseSecondChoice: 'Bachelor of Secondary Education',
    courseThirdChoice: 'BS Business Administration',
    program: 'Bachelor of Elementary Education',
    schoolYear: 'S.Y. 2026 - 2027',
    submittedAt: 'February 08, 2026',
    status: 'Pending',
    personalInfo: {
      address: 'Zone 2, Barangay Baleyadaan',
      cityProvince: 'Alaminos City, Pangasinan',
      phone: '075-554-1188',
      mobile: '09081231234',
      email: 'paolo.delacruz@example.com',
      birthDate: 'October 19, 2003',
      birthPlace: 'Labrador, Pangasinan',
      sex: 'Male',
      citizenship: 'Filipino',
      civilStatus: 'Single',
      religion: 'Iglesia ni Cristo',
    },
    uploadedDocuments: {
      photo2x2: '/images/admission_cover.png',
      gradesCopy: '/images/cover.avif',
      idOrCertificate: '/images/cover.avif',
    },
    educationalInfo: {
      seniorHighSchool: 'Labrador National High School',
      strand: 'TVL',
      yearGraduated: '2026',
      generalAverage: '87.45',
      lastSchoolAttended: 'N/A',
      lastCourse: 'N/A',
      lastSchoolYear: 'N/A',
    },
    otherInfo: {
      alsPasser: 'No',
      is4PsBeneficiary: 'No',
      isPWD: 'No',
      isIndigenous: 'No',
      isSoloParent: 'No',
    },
    reminders: [
      'Upload final grade 12 report card to complete your file.',
      'Incomplete applications are not scheduled for screening.',
      'Monitor this page for status updates.',
    ],
  },
]

export function getAdmissionApplicationByNo(applicationNo: string): AdmissionApplication | undefined {
  const normalized = applicationNo.trim().toLowerCase()
  return ADMISSION_APPLICATIONS.find((entry) => entry.applicationNo.toLowerCase() === normalized)
}

