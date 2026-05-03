const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

export type FacilityDepartmentPayload = {
  departmentName: string
}

export type FacilityFloorRoomPayload = {
  floorName: string
  roomName: string
}

export type FacilityPayload = {
  buildingName: string
  departments?: FacilityDepartmentPayload[]
  floorRooms?: FacilityFloorRoomPayload[]
}

export type FacilityDepartment = {
  departmentName: string
}

export type FacilityFloorRoom = {
  floorName: string
  roomName: string
}

export type Facility = {
  building_name: string
  departments: FacilityDepartment[]
  floor_rooms: FacilityFloorRoom[]
}

type ApiErrorResponse = {
  error?: string
}

export async function createFacility(payload: FacilityPayload): Promise<Facility> {
  const response = await fetch(`${API_BASE_URL}/api/v1/facilities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as Facility & ApiErrorResponse

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create facility.')
  }

  return data
}

export async function getFacilities(): Promise<Facility[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/facilities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  })

  const data = (await response.json()) as Facility[] | ApiErrorResponse

  if (!response.ok) {
    throw new Error(('error' in data && data.error) || 'Unable to fetch facilities.')
  }

  return data as Facility[]
}
