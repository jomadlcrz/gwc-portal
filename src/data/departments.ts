export type DepartmentCode = 'CITE' | 'CBA' | 'COE' | 'CCJ' | 'CTE'

export type DepartmentCatalogEntry = {
  code: DepartmentCode
  college: string
  programs: string[]
}

export const DEPARTMENTS: DepartmentCatalogEntry[] = [
  {
    code: 'CITE',
    college: 'College of Information Technology Education',
    programs: ['Bachelor of Science in Information Technology (BSIT)', 'Bachelor of Science in Computer Science (BSCS)'],
  },
  {
    code: 'CBA',
    college: 'College of Business Administration',
    programs: ['Bachelor of Science in Business Administration (BSBA)'],
  },
  {
    code: 'COE',
    college: 'College of Education',
    programs: ['Bachelor of Elementary Education (BEEd)', 'Bachelor of Secondary Education (BSEd)'],
  },
  {
    code: 'CCJ',
    college: 'College of Criminal Justice',
    programs: ['Bachelor of Science in Criminology (BSCrim)'],
  },
  {
    code: 'CTE',
    college: 'College of Technical Education',
    programs: ['Associate in Computer Technology (ACT)', 'Associate in Information Technology (AIT)'],
  },
]

export const DEFAULT_DEPARTMENT_CODE: DepartmentCode = 'CITE'

export const DEPARTMENT_SELECT_OPTIONS = DEPARTMENTS.map((department) => ({
  value: department.code,
  label: `${department.code} - ${department.college}`,
}))

export const DEPARTMENT_CODE_LIST = DEPARTMENTS.map((department) => department.code).join(' | ')

export const getDepartmentDisplayName = (code: string): string =>
  DEPARTMENTS.find((department) => department.code === code)?.college ?? code
