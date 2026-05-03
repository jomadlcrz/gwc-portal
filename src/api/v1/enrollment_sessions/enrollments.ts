const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

export type EnrollmentSessionPayload = {
  schoolYear: string
  semester: string
  yearLevel: string
  openingDate: string
  closingDate: string
}

export type EnrollmentSessionResponse = {
  id?: number
  school_year?: string
  semester?: string
  year_level?: string
  opening_date?: string
  closing_date?: string
  status?: string
  error?: string
  message?: string
  data?: {
    school_year: string | null
    semester: string | null
    year_level: string | null
    status: string
    opening_date: string | null
    closing_date: string | null
  }
}

export async function createEnrollmentSession(
  payload: EnrollmentSessionPayload
): Promise<EnrollmentSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/enrollment_sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as EnrollmentSessionResponse

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create enrollment session.')
  }

  return data
}

export async function getCurrentEnrollmentSession(): Promise<EnrollmentSessionResponse['data']> {
  const response = await fetch(`${API_BASE_URL}/api/v1/enrollment_sessions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  })

  const data = (await response.json()) as EnrollmentSessionResponse

  if (!response.ok) {
    throw new Error(data.error || 'Unable to fetch current enrollment session.')
  }

  return data.data
}
