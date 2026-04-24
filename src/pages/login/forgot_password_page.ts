import '../../styles/login.css'
const gwcLogo = '/images/gwc_logo.avif'
import { renderPortalHeader } from '../../components/layout/header'
import { renderPortalSiteFooter } from '../../components/layout/footer'

export function renderForgotPasswordPage(): string {
  return `
    <main class="login-page forgot-password-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        portalTitle: 'ACCOUNT SECURITY',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center justify-content-lg-end">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <section class="login-card p-4 p-md-4">
                  <h2 class="login-heading mb-2">Forgot Password</h2>
                  <p class="login-subheading mb-4">Enter your email to receive a password reset link.</p>
                  <form id="forgot-password-form">
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="forgot-password-email" placeholder="Email address" required />
                      <label for="forgot-password-email">Email address</label>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Send Reset Link</button>
                  </form>
              </section>
            </div>
          </div>
        </div>
      </section>

      ${renderPortalSiteFooter()}
    </main>
  `
}