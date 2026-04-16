export function renderNotFoundPage(): string {
  return `
    <main class="fallback-page d-flex align-items-center justify-content-center py-5">
      <div class="text-center">
        <h1 class="h4 mb-3">Page not found</h1>
        <a class="btn btn-primary" href="/student-portal/login">Go to Student Portal Login</a>
      </div>
    </main>
  `
}
