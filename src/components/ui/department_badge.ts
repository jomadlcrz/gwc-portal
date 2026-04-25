import { DEPARTMENTS } from '../../data/departments'

type KnownCode = 'cite' | 'cba' | 'coe' | 'ccj' | 'cte'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function parseDepartment(value: string): { code: string; college: string } {
  const normalized = value.trim()
  const byCode = DEPARTMENTS.find((department) => department.code === normalized)
  if (byCode) {
    return { code: byCode.code, college: byCode.college }
  }

  const byCollege = DEPARTMENTS.find((department) => department.college === normalized)
  if (byCollege) {
    return { code: byCollege.code, college: byCollege.college }
  }

  const prefixedCode = DEPARTMENTS.find((department) => normalized.startsWith(`${department.code} - `))
  if (prefixedCode) {
    return { code: prefixedCode.code, college: prefixedCode.college }
  }

  return { code: normalized, college: normalized }
}

function toCodeClass(code: string): KnownCode | null {
  const value = code.trim().toLowerCase()
  if (value === 'cite' || value === 'cba' || value === 'coe' || value === 'ccj' || value === 'cte') return value
  return null
}

export function renderDepartmentCodeBadge(value: string): string {
  const parsed = parseDepartment(value)
  const classSuffix = toCodeClass(parsed.code)
  const className = classSuffix ? `dept-code-badge dept-code-${classSuffix}` : 'dept-code-badge'
  return `<span class="${className}">${escapeHtml(parsed.code)}</span>`
}

export function renderDepartmentDisplay(value: string): string {
  const parsed = parseDepartment(value)
  return `${renderDepartmentCodeBadge(parsed.code)} - ${escapeHtml(parsed.college)}`
}
