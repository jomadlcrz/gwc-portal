import '../../styles/login.css'
const gwcLogo = '/images/gwc_logo.avif'
import { renderPortalHeader } from '../../components/layout/header'
import { renderPortalSiteFooter } from '../../components/layout/footer'

export function renderdean_login_page(): string {
  return `
    <main class="login-page dean-login-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        portalTitle: 'DEAN PORTAL',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center justify-content-lg-end">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <section class="login-card p-4 p-md-4">
                  <h2 class="login-heading mb-2">Dean Login</h2>
                  <p class="login-subheading mb-4">Sign in with your dean portal account</p>
                  <form>
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="dean-email" placeholder="Email address" required />
                      <label for="dean-email">Email address</label>
                    </div>
                    <div class="form-floating mb-4">
                      <input type="password" class="form-control form-control-lg login-input password-input" id="dean-password" placeholder="Password" required />
                      <label for="dean-password">Password</label>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Log in</button>
                      <p class="mt-3 mb-0 small">
                      <a href="/forgot-password" class="no-underline">Forgot password</a>
                    </p>
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

