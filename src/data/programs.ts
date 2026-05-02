export type AcademicProgram = {
  id: number
  code: string
  name: string
  status: 'Active' | 'Inactive'
}

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  { id: 1, code: 'BSCrim', name: 'Bachelor of Science in Criminology', status: 'Active' },
  { id: 2, code: 'BSIT', name: 'Bachelor of Science in Information Technology', status: 'Active' },
  { id: 3, code: 'BSCS', name: 'Bachelor of Science in Computer Science', status: 'Active' },
  { id: 4, code: 'ASCS', name: 'Associate in Computer Science (2-Years)', status: 'Active' },
  { id: 5, code: 'BSBA', name: 'Bachelor of Science in Business Administration (Major in Marketing Management)', status: 'Active' },
  { id: 6, code: 'BEEd', name: 'Bachelor of Elementary Education', status: 'Active' },
  { id: 7, code: 'BSEd', name: 'Bachelor of Secondary Education', status: 'Active' },
]

export function toProgramInputId(programCode: string): string {
  return `admission-program-${programCode.trim().toLowerCase()}`
}

export function listProgramNames(): string[] {
  return ACADEMIC_PROGRAMS.map((program) => program.name)
}
