export function renderEnrollmentSessionStatus(): string {
  return `
    <div class="enrollment-session-status-container">
      <div class="card enrollment-status-card">
        <div class="card-body">
          <h5 class="card-title">Current Enrollment Session</h5>
          <div id="enrollment-status-content" class="enrollment-status-content">
            <div class="alert alert-info mb-0">
              <strong>Create a new enrollment session</strong>
              <p class="mb-0 mt-2">Use the form to create a new enrollment session for your academic year.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

interface EnrollmentSessionData {
  school_year: string
  semester: string
  year_level: string
  status: string
  opening_date: string
  closing_date: string
}

export function updateEnrollmentSessionStatus(
  container: HTMLElement,
  data: EnrollmentSessionData | null | undefined
): void {
  const contentEl = container.querySelector<HTMLElement>('#enrollment-status-content')
  if (!contentEl || !data) return

  const statusMap: Record<string, string> = {
    OPEN: 'bg-success',
    UPCOMING: 'bg-warning text-dark',
    CLOSED: 'bg-danger',
  }

  const statusBadgeClass = statusMap[data.status] || 'bg-secondary'

  contentEl.innerHTML = `
    <div class="enrollment-status-details">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Academic Year</small>
            <strong>${data.school_year}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Semester</small>
            <strong>${data.semester}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Year Level</small>
            <strong>${data.year_level}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Status</small>
            <span class="badge ${statusBadgeClass}">${data.status}</span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Opening Date</small>
            <strong>${new Date(data.opening_date).toLocaleDateString()}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="status-item">
            <small class="text-muted d-block">Closing Date</small>
            <strong>${new Date(data.closing_date).toLocaleDateString()}</strong>
          </div>
        </div>
      </div>
    </div>
  `
}
