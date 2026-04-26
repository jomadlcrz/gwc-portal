const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

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
  const response = await fetch(`${API_BASE_URL}/${import.meta.env.VITE_REGISTRATION_STUDENTS_PATH}`, {
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
