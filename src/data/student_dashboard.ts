export const STUDENT_DASHBOARD_CONTENT = {
  title: 'Student Dashboard',
  subtitle: 'Overview of your schedules and latest registrar announcements.',
  actions: {
    viewSubjects: 'View Subjects',
    openSchedule: 'Open Schedule',
  },
  kpis: {
    published: 'Published Classes',
    updates: 'Schedule Updates',
    approved: 'Approved Batches',
    finalized: 'Finalized Batches',
  },
  panels: {
    latestNotifications: 'Latest Notifications',
    quickAccess: 'Quick Access',
  },
  emptyStates: {
    updates: 'No updates yet.',
  },
  links: {
    mySchedule: 'My Schedule',
    myGrades: 'My Grades',
    mySubjects: 'My Subjects',
    settings: 'Settings',
  },
} as const
