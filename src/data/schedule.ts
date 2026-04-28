export type ScheduleDay = 'M' | 'T' | 'W' | 'TH' | 'F' | 'S'

export type ScheduleSlot = {
  time: string
  values: Partial<Record<ScheduleDay, string>>
}

export type InstructorSchedule = {
  department: string
  name: string
  room: string
  focus: string
  slots: ScheduleSlot[]
}

export const SCHEDULE_DAY_ORDER: ScheduleDay[] = ['M', 'T', 'W', 'TH', 'F', 'S']

export const INSTRUCTOR_SCHEDULES: InstructorSchedule[] = [
  {
    department: 'CITE',
    name: 'PAU',
    room: '303',
    focus: 'Programming Fundamentals',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'SA101 - 4C', W: 'CC102 - 1A', TH: 'CC102 - 1A', F: 'SA101 - 4C' } },
      { time: '9:30 - 12:00', values: { T: 'SA101 - 4D', W: 'CC102 - 1B', TH: 'CC102 - 1B', F: 'SA101 - 4D' } },
      { time: '12:00 - 2:30', values: { M: 'SA101 - 4A', T: 'CC102 - 1E', W: 'CC102 - 1C', TH: 'CC102 - 1C', F: 'CC102 - 1E' } },
      { time: '2:30 - 5:00', values: { M: 'SA101 - 4A', T: 'CC102 - 1F', W: 'CC102 - 1D', TH: 'CC102 - 1D', F: 'CC102 - 1F' } },
    ],
  },
  {
    department: 'CITE',
    name: 'JOY',
    room: '304',
    focus: 'Intro to Information Management',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'IM101 - 2A', T: 'CC101 - 1A', W: 'IM101 - 2E', TH: 'IM101 - 2A', F: 'CC101 - 1A' } },
      { time: '9:30 - 12:00', values: { M: 'IM101 - 2B', T: 'CC101 - 1B', W: 'CC101 - 1E', TH: 'IM101 - 2B', F: 'CC101 - 1B', S: 'IM101 - 2E' } },
      { time: '12:00 - 2:30', values: { M: 'IM101 - 2C', T: 'CC101 - 1C', W: 'CC101 - 1F', TH: 'IM101 - 2C', F: 'CC101 - 1C', S: 'CC101 - 1E' } },
      { time: '2:30 - 5:00', values: { M: 'IM101 - 2D', T: 'CC101 - 1D', TH: 'IM101 - 2D', F: 'CC101 - 1D', S: 'CC101 - 1F' } },
    ],
  },
  {
    department: 'CITE',
    name: 'JV',
    room: '302',
    focus: 'IT Electives and Research',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'ITELEC1 - 3A', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3A' } },
      { time: '9:30 - 12:00', values: { T: 'ITELEC1 - 3B', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3B' } },
      { time: '12:00 - 2:30', values: { T: 'ITELEC1 - 3C', TH: 'ITELEC1 - 3E', S: 'ITELEC1 - 3C' } },
      { time: '2:30 - 5:00', values: { T: 'ITELEC1 - 3D', TH: 'ITELEC1 - 3F', S: 'ITELEC1 - 3D' } },
    ],
  },
  {
    department: 'CITE',
    name: 'KAI',
    room: '402',
    focus: 'Information Management and IT Elective 4',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'IM102 - 3A', T: 'IM102 - 3E', W: 'IM102 - 3A', TH: 'IM102 - 3E', F: 'CAPS2 - 4A' } },
      { time: '9:30 - 12:00', values: { M: 'IM102 - 3B', T: 'IM102 - 3F', W: 'IM102 - 3B', TH: 'IM102 - 3F' } },
      { time: '12:00 - 2:30', values: { M: 'IM102 - 3C', T: 'ITELEC4 - 4A', W: 'IM102 - 3C', TH: 'ITELEC4 - 4A', F: 'CAPS2 - 4B' } },
      { time: '2:30 - 5:00', values: { M: 'IM102 - 3D', T: 'ITELEC4 - 4B', W: 'IM102 - 3D', TH: 'ITELEC4 - 4B' } },
    ],
  },
  {
    department: 'CBA',
    name: 'MIA',
    room: '201',
    focus: 'Marketing Management',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'MKTG101 - 2A', W: 'MKTG101 - 2A', F: 'MKTG101 - 2A' } },
      { time: '9:30 - 12:00', values: { T: 'MKTG102 - 2B', TH: 'MKTG102 - 2B', S: 'MKTG102 - 2B' } },
      { time: '12:00 - 2:30', values: { M: 'ENTREP1 - 3A', W: 'ENTREP1 - 3A' } },
      { time: '2:30 - 5:00', values: { T: 'BUSFIN1 - 3B', TH: 'BUSFIN1 - 3B' } },
    ],
  },
  {
    department: 'CBA',
    name: 'RON',
    room: '202',
    focus: 'Financial Management',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'ACCTG1 - 1A', TH: 'ACCTG1 - 1A' } },
      { time: '9:30 - 12:00', values: { M: 'ACCTG2 - 1B', W: 'ACCTG2 - 1B', F: 'ACCTG2 - 1B' } },
      { time: '12:00 - 2:30', values: { T: 'ECON1 - 2A', TH: 'ECON1 - 2A' } },
      { time: '2:30 - 5:00', values: { M: 'BUSSTAT - 2B', W: 'BUSSTAT - 2B', F: 'BUSSTAT - 2B' } },
    ],
  },
  {
    department: 'COE',
    name: 'ANA',
    room: '105',
    focus: 'Professional Education',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'PROFED1 - 2A', T: 'PROFED1 - 2B', W: 'PROFED1 - 2A' } },
      { time: '9:30 - 12:00', values: { TH: 'PROFED2 - 3A', F: 'PROFED2 - 3A' } },
      { time: '12:00 - 2:30', values: { T: 'ASSESS1 - 3B', TH: 'ASSESS1 - 3B' } },
      { time: '2:30 - 5:00', values: { W: 'CURRIC1 - 4A', F: 'CURRIC1 - 4A' } },
    ],
  },
  {
    department: 'COE',
    name: 'LEI',
    room: '106',
    focus: 'Field Study',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'FS1 - 4A', TH: 'FS1 - 4A', S: 'FS1 - 4A' } },
      { time: '9:30 - 12:00', values: { M: 'FS2 - 4B', W: 'FS2 - 4B' } },
      { time: '12:00 - 2:30', values: { T: 'TEACHPRAC - 4C', TH: 'TEACHPRAC - 4C' } },
      { time: '2:30 - 5:00', values: { F: 'EDTECH - 3C' } },
    ],
  },
  {
    department: 'CCJ',
    name: 'JAY',
    room: '310',
    focus: 'Criminal Law',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'CRIMLAW1 - 2A', W: 'CRIMLAW1 - 2A', F: 'CRIMLAW1 - 2A' } },
      { time: '9:30 - 12:00', values: { T: 'CRIMLAW2 - 2B', TH: 'CRIMLAW2 - 2B' } },
      { time: '12:00 - 2:30', values: { M: 'CRIMPROC - 3A', W: 'CRIMPROC - 3A' } },
      { time: '2:30 - 5:00', values: { T: 'EVIDENCE - 3B', TH: 'EVIDENCE - 3B', S: 'EVIDENCE - 3B' } },
    ],
  },
  {
    department: 'CCJ',
    name: 'KIM',
    room: '311',
    focus: 'Forensics',
    slots: [
      { time: '7:00 - 9:30', values: { T: 'FORENSIC1 - 2A', TH: 'FORENSIC1 - 2A' } },
      { time: '9:30 - 12:00', values: { M: 'CRIMRES - 3A', W: 'CRIMRES - 3A', F: 'CRIMRES - 3A' } },
      { time: '12:00 - 2:30', values: { T: 'CRIMLAB - 3B', TH: 'CRIMLAB - 3B' } },
      { time: '2:30 - 5:00', values: { S: 'FORENSIC2 - 2B' } },
    ],
  },
  {
    department: 'CTE',
    name: 'BALZ',
    room: '303',
    focus: 'Computer Technology Fundamentals',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'CC106 - 3A', T: 'CC106 - 3E', W: 'CC106 - 3A', TH: 'CC106 - 3E' } },
      { time: '9:30 - 12:00', values: { M: 'CC106 - 3B', T: 'CC106 - 3F', W: 'CC106 - 3B', TH: 'CC106 - 3F', F: 'OS101 - 4C' } },
      { time: '12:00 - 2:30', values: { M: 'CC106 - 3C', T: 'ITELEC4 - 4C', W: 'CC106 - 3C', TH: 'ITELEC4 - 4C' } },
      { time: '2:30 - 5:00', values: { M: 'CC106 - 3D', T: 'OS101 - 4A', W: 'CC106 - 3D', TH: 'OS101 - 4B', F: 'OS101 - 4D' } },
    ],
  },
  {
    department: 'CTE',
    name: 'FAT',
    room: '403',
    focus: 'Programming and Systems',
    slots: [
      { time: '7:00 - 9:30', values: { M: 'OOP - 2B', T: 'IAS - 3A', W: 'OOP - 2B', TH: 'IAS - 3B', F: 'IAS - 3C', S: 'IAS - 3F' } },
      { time: '9:30 - 12:00', values: { M: 'OOP - 2A', W: 'OOP - 2A', F: 'IAS - 3D' } },
      { time: '12:00 - 2:30', values: { M: 'OOP - 2D', T: 'ITELEC4 - 4D', W: 'OOP - 2D', TH: 'ITELEC4 - 4D', F: 'IAS - 3E' } },
      { time: '2:30 - 5:00', values: { M: 'OOP - 2C', T: 'OOP - 2E', W: 'OOP - 2C', TH: 'OOP - 2E' } },
    ],
  },
]
