export const FACULTY_DASHBOARD_CONTENT = {
  title: 'Faculty Dashboard',
  subtitle: 'Teaching overview, schedule highlights, and latest updates.',
  actions: {
    openClasses: 'Open Classes',
    openGradebook: 'Open Gradebook',
  },
  kpis: {
    totalAssigned: 'Total Assigned Classes',
    todaySuffix: 'Classes',
    onlineHybrid: 'Online / Hybrid Load',
    roomsThisTerm: 'Rooms This Term',
  },
  panels: {
    todayClasses: "Today's Classes",
    weeklyLoad: 'Upcoming Weekly Load',
    notifications: 'Notifications',
    quickActions: 'Quick Actions',
  },
  emptyStates: {
    today: 'No classes scheduled for today.',
    weekly: 'No assigned classes yet.',
    notifications: 'No notifications yet.',
  },
  links: {
    reportIssue: 'Report Schedule Issue',
    updateGradebook: 'Update Gradebook',
    settings: 'Portal Settings',
  },
} as const
