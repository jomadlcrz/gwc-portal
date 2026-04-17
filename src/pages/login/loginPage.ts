import gwcLogo from '../../assets/gwc-logo-laurel.png'
import { renderPortalHeader } from '../../components/siteHeader'

export function renderLoginPage(): string {
  return `
    <main class="login-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center justify-content-lg-end">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <section class="card shadow-sm border-0 login-card">
                <div class="card-body p-4 p-md-4">
                  <h2 class="login-heading mb-2">Login to GWC Portal</h2>
                  <p class="login-subheading mb-4">Enter your email and password to use the system</p>
                  <form>
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="email" placeholder="Email address" required />
                      <label for="email">Email address</label>
                    </div>
                    <div class="form-floating mb-4">
                      <input type="password" class="form-control form-control-lg login-input password-input" id="password" placeholder="Password" required />
                      <label for="password">Password</label>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Log in</button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <footer class="portal-footer">
        <p class="mb-0">All rights reserved, GOLDEN WEST COLLEGES, INC.</p>
      </footer>
    </main>
  `
}
