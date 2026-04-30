const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

export type AdmissionSessionPayload = {
  openingDate: string
  closingDate: string
}

export type AdmissionSessionStatusResponse = {
  status: string
  message: string
  opening_date: string
  closing_date: string
  today: string
  error?: string
}

export type AdmissionRequirementPayload = {
  admissionTypeName: string
  documentName: string[]
}

export type AdmissionRequirementItem = {
  admission_type: string
  documents?: string[]
  message?: string
  error?: string
}

async function fetchAdmissionEndpoint<T>(
  paths: string[],
  init?: RequestInit,
): Promise<T> {
  let lastError: string | null = null
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')
  headers.set('ngrok-skip-browser-warning', 'true')

  for (const path of paths) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      mode: 'cors',
      credentials: 'omit',
      headers,
    })

    if (response.status === 404) {
      lastError = `404 on ${path}`
      continue
    }

    const data = (await response.json()) as T & { error?: string }
    if (!response.ok) throw new Error(data.error || `Request failed for ${path}.`)
    return data
  }

  throw new Error(lastError || 'Unable to reach admissions API endpoint.')
}

export async function getAdmissionSessionStatus(): Promise<AdmissionSessionStatusResponse> {
  return fetchAdmissionEndpoint<AdmissionSessionStatusResponse>([
    '/api/v1/admissions_date',
    '/api/v1/admissions/date',
  ])
}

export async function createAdmissionSession(payload: AdmissionSessionPayload): Promise<AdmissionSessionStatusResponse> {
  return fetchAdmissionEndpoint<AdmissionSessionStatusResponse>([
    '/api/v1/admissions_date',
    '/api/v1/admissions/date',
  ], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function getAdmissionRequirements(): Promise<AdmissionRequirementItem[]> {
  return fetchAdmissionEndpoint<AdmissionRequirementItem[]>([
    '/api/v1/admissions_requirements',
    '/api/v1/admissions/requirements',
  ])
}

export async function createAdmissionRequirement(payload: AdmissionRequirementPayload): Promise<AdmissionRequirementItem> {
  return fetchAdmissionEndpoint<AdmissionRequirementItem>([
    '/api/v1/admissions_requirements',
    '/api/v1/admissions/requirements',
  ], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
