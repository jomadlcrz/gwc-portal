const PSGC_PROVINCE_ENDPOINTS = [
  'https://psgc.cloud/api/v2/provinces',
  'https://psgc.cloud/api/v2/provinces/',
  'https://psgc.gitlab.io/api/provinces/',
]

type PsgcProvince = {
  code: string
  name: string
}

type PsgcCityMunicipality = {
  code: string
  name: string
}

type PsgcBarangay = {
  code: string
  name: string
}

let provinceCache: PsgcProvince[] | null = null
let provinceRequest: Promise<PsgcProvince[]> | null = null
const citiesCache = new Map<string, PsgcCityMunicipality[]>()
const citiesRequestCache = new Map<string, Promise<PsgcCityMunicipality[]>>()
const barangaysCache = new Map<string, PsgcBarangay[]>()
const barangaysRequestCache = new Map<string, Promise<PsgcBarangay[]>>()

type RawProvince = {
  code?: unknown
  name?: unknown
  province_name?: unknown
}

type RawCityMunicipality = {
  code?: unknown
  name?: unknown
  city_municipality_name?: unknown
}

type RawBarangay = {
  code?: unknown
  name?: unknown
  barangay_name?: unknown
}

function normalizeProvinces(payload: unknown): PsgcProvince[] {
  const asArray = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : []

  const uniqueByName = new Map<string, PsgcProvince>()
  asArray.forEach((item) => {
    const province = item as RawProvince
    const rawName = typeof province.name === 'string' ? province.name : province.province_name
    const rawCode = province.code
    if (typeof rawName !== 'string' || rawName.trim() === '') return
    const name = rawName.trim()
    const code = typeof rawCode === 'string' ? rawCode : name
    uniqueByName.set(name.toLowerCase(), { code, name })
  })

  return Array.from(uniqueByName.values()).sort((first, second) => first.name.localeCompare(second.name))
}

function normalizeCitiesMunicipalities(payload: unknown): PsgcCityMunicipality[] {
  const asArray = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : []

  const uniqueByName = new Map<string, PsgcCityMunicipality>()
  asArray.forEach((item) => {
    const city = item as RawCityMunicipality
    const rawName = typeof city.name === 'string' ? city.name : city.city_municipality_name
    const rawCode = city.code
    if (typeof rawName !== 'string' || rawName.trim() === '') return
    const name = rawName.trim()
    const code = typeof rawCode === 'string' ? rawCode : name
    uniqueByName.set(name.toLowerCase(), { code, name })
  })

  return Array.from(uniqueByName.values()).sort((first, second) => first.name.localeCompare(second.name))
}

function normalizeBarangays(payload: unknown): PsgcBarangay[] {
  const asArray = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : []

  const uniqueByName = new Map<string, PsgcBarangay>()
  asArray.forEach((item) => {
    const barangay = item as RawBarangay
    const rawName = typeof barangay.name === 'string' ? barangay.name : barangay.barangay_name
    const rawCode = barangay.code
    if (typeof rawName !== 'string' || rawName.trim() === '') return
    const name = rawName.trim()
    const code = typeof rawCode === 'string' ? rawCode : name
    uniqueByName.set(name.toLowerCase(), { code, name })
  })

  return Array.from(uniqueByName.values()).sort((first, second) => first.name.localeCompare(second.name))
}

function getDesiredValue(select: HTMLSelectElement): string {
  const pending = select.dataset.pendingValue?.trim() ?? ''
  if (pending) {
    delete select.dataset.pendingValue
    return pending
  }
  return select.value
}

async function fetchProvinces(): Promise<PsgcProvince[]> {
  if (provinceCache) return provinceCache
  if (provinceRequest) return provinceRequest

  provinceRequest = (async () => {
    for (const endpoint of PSGC_PROVINCE_ENDPOINTS) {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) continue
        const payload = (await response.json()) as unknown
        const provinces = normalizeProvinces(payload)
        if (provinces.length > 0) {
          provinceCache = provinces
          return provinces
        }
      } catch {
        // Try the next endpoint.
      }
    }
    return []
  })()
    .catch(() => [])
    .finally(() => {
      provinceRequest = null
    })

  return provinceRequest
}

export async function populateProvinceSelects(root: ParentNode): Promise<void> {
  const provinceSelects = Array.from(
    root.querySelectorAll<HTMLSelectElement>('select#student-province, select[id$="-province"]'),
  )
  if (provinceSelects.length === 0) return

  provinceSelects.forEach((select) => {
    if (select.options.length <= 1) {
      select.innerHTML = '<option value="">Loading provinces...</option>'
    }
  })

  const provinces = await fetchProvinces()
  provinceSelects.forEach((select) => {
    const selectedValue = getDesiredValue(select)
    select.innerHTML = '<option value="">Select Province</option>'
    if (provinces.length === 0) {
      select.insertAdjacentHTML('beforeend', '<option value="" disabled>Unable to load provinces</option>')
      return
    }
    provinces.forEach((province) => {
      select.insertAdjacentHTML(
        'beforeend',
        `<option value="${province.name}" data-province-code="${province.code}">${province.name}</option>`,
      )
    })
    if (selectedValue) select.value = selectedValue
  })
}

async function fetchCitiesMunicipalitiesByProvince(provinceCodeOrName: string): Promise<PsgcCityMunicipality[]> {
  const key = provinceCodeOrName.trim().toLowerCase()
  if (!key) return []
  const cached = citiesCache.get(key)
  if (cached) return cached
  const pending = citiesRequestCache.get(key)
  if (pending) return pending

  const encoded = encodeURIComponent(provinceCodeOrName.trim())
  const endpoints = [
    `https://psgc.cloud/api/v2/provinces/${encoded}/cities-municipalities`,
    `https://psgc.cloud/api/v2/provinces/${encoded}/cities-municipalities/`,
    `https://psgc.gitlab.io/api/provinces/${encoded}/cities-municipalities/`,
  ]

  const request = (async () => {
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) continue
        const payload = (await response.json()) as unknown
        const cities = normalizeCitiesMunicipalities(payload)
        if (cities.length > 0) {
          citiesCache.set(key, cities)
          return cities
        }
      } catch {
        // Try the next endpoint.
      }
    }
    return []
  })().finally(() => {
    citiesRequestCache.delete(key)
  })

  citiesRequestCache.set(key, request)
  return request
}

function getLinkedCitySelect(provinceSelect: HTMLSelectElement): HTMLSelectElement | null {
  const cityId = provinceSelect.id.replace(/-province$/, '-city')
  if (!cityId || cityId === provinceSelect.id) return null
  const container = provinceSelect.closest<HTMLElement>('[data-bulk-card]') ?? provinceSelect.closest<HTMLElement>('section') ?? document
  return container.querySelector<HTMLSelectElement>(`#${cityId}`)
}

function getLinkedBarangaySelect(citySelect: HTMLSelectElement): HTMLSelectElement | null {
  const barangayId = citySelect.id.replace(/-city$/, '-barangay')
  if (!barangayId || barangayId === citySelect.id) return null
  const container = citySelect.closest<HTMLElement>('[data-bulk-card]') ?? citySelect.closest<HTMLElement>('section') ?? document
  return container.querySelector<HTMLSelectElement>(`#${barangayId}`)
}

async function populateCitySelectFromProvince(provinceSelect: HTMLSelectElement): Promise<void> {
  const citySelect = getLinkedCitySelect(provinceSelect)
  if (!citySelect) return

  const selectedOption = provinceSelect.selectedOptions[0] ?? null
  const provinceCode = selectedOption?.dataset.provinceCode ?? ''
  const provinceName = provinceSelect.value.trim()
  const provinceIdentifier = provinceCode || provinceName
  const previousCity = citySelect.value

  citySelect.innerHTML = '<option value="">Loading City/Municipality...</option>'
  citySelect.disabled = true

  if (!provinceIdentifier) {
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>'
    citySelect.disabled = false
    return
  }

  const cities = await fetchCitiesMunicipalitiesByProvince(provinceIdentifier)
  citySelect.innerHTML = '<option value="">Select City/Municipality</option>'
  if (cities.length === 0) {
    citySelect.insertAdjacentHTML('beforeend', '<option value="" disabled>Unable to load cities/municipalities</option>')
    citySelect.disabled = false
    return
  }

  cities.forEach((city) => {
    citySelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${city.name}" data-city-municipality-code="${city.code}">${city.name}</option>`,
    )
  })
  citySelect.value = getDesiredValue(citySelect) || previousCity
  citySelect.disabled = false
}

async function fetchBarangaysByCityMunicipality(cityCodeOrName: string): Promise<PsgcBarangay[]> {
  const key = cityCodeOrName.trim().toLowerCase()
  if (!key) return []
  const cached = barangaysCache.get(key)
  if (cached) return cached
  const pending = barangaysRequestCache.get(key)
  if (pending) return pending

  const encoded = encodeURIComponent(cityCodeOrName.trim())
  const endpoints = [
    `https://psgc.cloud/api/v2/cities-municipalities/${encoded}/barangays`,
    `https://psgc.cloud/api/v2/cities-municipalities/${encoded}/barangays/`,
    `https://psgc.gitlab.io/api/cities-municipalities/${encoded}/barangays/`,
  ]

  const request = (async () => {
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) continue
        const payload = (await response.json()) as unknown
        const barangays = normalizeBarangays(payload)
        if (barangays.length > 0) {
          barangaysCache.set(key, barangays)
          return barangays
        }
      } catch {
        // Try the next endpoint.
      }
    }
    return []
  })().finally(() => {
    barangaysRequestCache.delete(key)
  })

  barangaysRequestCache.set(key, request)
  return request
}

async function populateBarangaySelectFromCity(citySelect: HTMLSelectElement): Promise<void> {
  const barangaySelect = getLinkedBarangaySelect(citySelect)
  if (!barangaySelect) return

  const selectedOption = citySelect.selectedOptions[0] ?? null
  const cityCode = selectedOption?.dataset.cityMunicipalityCode ?? ''
  const cityName = citySelect.value.trim()
  const cityIdentifier = cityCode || cityName
  const previousBarangay = barangaySelect.value

  barangaySelect.innerHTML = '<option value="">Loading Barangay...</option>'
  barangaySelect.disabled = true

  if (!cityIdentifier) {
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>'
    barangaySelect.disabled = false
    return
  }

  const barangays = await fetchBarangaysByCityMunicipality(cityIdentifier)
  barangaySelect.innerHTML = '<option value="">Select Barangay</option>'
  if (barangays.length === 0) {
    barangaySelect.insertAdjacentHTML('beforeend', '<option value="" disabled>Unable to load barangays</option>')
    barangaySelect.disabled = false
    return
  }

  barangays.forEach((barangay) => {
    barangaySelect.insertAdjacentHTML('beforeend', `<option value="${barangay.name}">${barangay.name}</option>`)
  })
  barangaySelect.value = getDesiredValue(barangaySelect) || previousBarangay
  barangaySelect.disabled = false
}

export async function hydrateLocationSelects(root: ParentNode): Promise<void> {
  await populateProvinceSelects(root)

  const provinceSelects = Array.from(
    root.querySelectorAll<HTMLSelectElement>('select#student-province, select[id$="-province"]'),
  )
  for (const provinceSelect of provinceSelects) {
    if (provinceSelect.value) {
      await populateCitySelectFromProvince(provinceSelect)
    }
  }

  const citySelects = Array.from(root.querySelectorAll<HTMLSelectElement>('select#student-city, select[id$="-city"]'))
  for (const citySelect of citySelects) {
    if (citySelect.value) {
      await populateBarangaySelectFromCity(citySelect)
    }
  }
}

export function setupProvinceCityCascade(root: HTMLElement): () => void {
  const onLocationChange = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (!(target instanceof HTMLSelectElement)) return
    if (target.id.endsWith('-province') || target.id === 'student-province') {
      void populateCitySelectFromProvince(target).then(() => {
        const citySelect = getLinkedCitySelect(target)
        if (citySelect?.value) return populateBarangaySelectFromCity(citySelect)
        return Promise.resolve()
      })
      return
    }
    if (target.id.endsWith('-city') || target.id === 'student-city') {
      void populateBarangaySelectFromCity(target)
    }
  }

  root.addEventListener('change', onLocationChange)

  return () => {
    root.removeEventListener('change', onLocationChange)
  }
}
