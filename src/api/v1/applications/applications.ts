const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

export type RegistrationStudentPayload = {
  admission_type: string
  program_name: string
  prev_program?: string
  first_name: string
  mid_name?: string
  last_name: string
  suffix?: string
  gender: string
  birth_date: string
  registration_status: 'Pending' | 'Approved' | 'Disqualified'
  personal_contact: {
    email: string
    mobile: string
    telephone?: string
  }
  emergency_contact?: {
    first_name: string
    mid_name?: string
    last_name: string
    mobile: string
    email?: string
    telephone?: string
  }
  permanent_address: {
    street: string
    barangay: string
    city: string
    province: string
    postal_code: string
  }
  current_address: {
    street: string
    barangay: string
    city: string
    province: string
    postal_code: string
  }
}

type RegistrationStudentResponse = {
  success: boolean
  message: string
  data?: {
    id: number
  }
  errors?: Record<string, string | string[]>
}

export async function createRegistrationStudent(payload: RegistrationStudentPayload): Promise<RegistrationStudentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as RegistrationStudentResponse
  if (!response.ok) {
    const backendErrors = data.errors
      ? ` ${Object.entries(data.errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ')}`
      : ''
    throw new Error(data.message ? `${data.message}${backendErrors}` : 'Unable to create application.')
  }

  return data
}
