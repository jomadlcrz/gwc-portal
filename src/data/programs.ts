export type AcademicProgram = {
  id: number
  code: string
  name: string
  status: 'Active' | 'Inactive'
  departmentCode: 'CITE' | 'CBA' | 'COE' | 'CCJ' | 'CTE'
}

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  { id: 1, code: 'BSCrim', name: 'Bachelor of Science in Criminology', status: 'Active', departmentCode: 'CCJ' },
  { id: 2, code: 'BSIT', name: 'Bachelor of Science in Information Technology', status: 'Active', departmentCode: 'CITE' },
  { id: 3, code: 'BSCS', name: 'Bachelor of Science in Computer Science', status: 'Active', departmentCode: 'CITE' },
  { id: 4, code: 'ASCS', name: 'Associate in Computer Science (2-Years)', status: 'Active', departmentCode: 'CTE' },
  { id: 5, code: 'BSBA', name: 'Bachelor of Science in Business Administration (Major in Marketing Management)', status: 'Active', departmentCode: 'CBA' },
  { id: 6, code: 'BEEd', name: 'Bachelor of Elementary Education', status: 'Active', departmentCode: 'COE' },
  { id: 7, code: 'BSEd', name: 'Bachelor of Secondary Education', status: 'Active', departmentCode: 'COE' },
]

export function toProgramInputId(programCode: string): string {
  return `admission-program-${programCode.trim().toLowerCase()}`
}

export function listProgramNames(): string[] {
  return ACADEMIC_PROGRAMS.map((program) => program.name)
}
