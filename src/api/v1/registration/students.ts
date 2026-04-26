const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
const API_BASE_PATH_RAW = (import.meta.env.VITE_API_BASE_PATH as string | undefined)?.trim() || '/api/v1'

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

const API_BASE_PATH = API_BASE_PATH_RAW.startsWith('/') ? API_BASE_PATH_RAW : `/${API_BASE_PATH_RAW}`
const REGISTRATION_STUDENTS_ENDPOINT = `${API_BASE_URL}${API_BASE_PATH}/registration/students`

export type RegistrationStudentPayload = {
  programId: number
  firstName: string
  midName?: string
  lastName: string
  suffix?: string
  gender: string
  birthDate: string
  contactInfoId: number
  emergencyContactId: number
  admissionType: string
  prevProgram?: string
  currAddrId: number
  permAddrId: number
  preRegStatus: string
}

type RegistrationStudentResponse = {
  id?: number
  error?: string
}

export async function createRegistrationStudent(payload: RegistrationStudentPayload): Promise<RegistrationStudentResponse> {
  const response = await fetch(REGISTRATION_STUDENTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as RegistrationStudentResponse
  if (!response.ok) {
    throw new Error(data.error || 'Unable to create student registration.')
  }

  return data
}
