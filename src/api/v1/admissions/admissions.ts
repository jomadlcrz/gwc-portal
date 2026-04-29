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

export async function getAdmissionSessionStatus(): Promise<AdmissionSessionStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admissions_date`)
  const data = (await response.json()) as AdmissionSessionStatusResponse
  if (!response.ok) throw new Error(data.error || 'Unable to fetch admission session status.')
  return data
}

export async function createAdmissionSession(payload: AdmissionSessionPayload): Promise<AdmissionSessionStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admissions_date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await response.json()) as AdmissionSessionStatusResponse
  if (!response.ok) throw new Error(data.error || 'Unable to update admission session.')
  return data
}

export async function getAdmissionRequirements(): Promise<AdmissionRequirementItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admissions_requirements`)
  const data = (await response.json()) as AdmissionRequirementItem[]
  if (!response.ok) throw new Error('Unable to fetch admission requirements.')
  return data
}

export async function createAdmissionRequirement(payload: AdmissionRequirementPayload): Promise<AdmissionRequirementItem> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admissions_requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await response.json()) as AdmissionRequirementItem
  if (!response.ok) throw new Error(data.error || 'Unable to create admission requirement.')
  return data
}
