import gwcLogo from '../../assets/gwc_logo_laurel\.avif'
import { renderPortalHeader } from '../../components/layout/header'
import { renderPortalSiteFooter } from '../../components/layout/footer'

export function renderregistrar_staff_login_page(): string {
  return `
    <main class="login-page registrar_staff-login-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        portalTitle: 'REGISTRAR STAFF PORTAL',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center justify-content-lg-end">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <section class="login-card p-4 p-md-4">
                  <h2 class="login-heading mb-2">Registrar Staff Login</h2>
                  <p class="login-subheading mb-4">Sign in with your registrar staff account</p>
                  <form>
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="registrar_staff-email" placeholder="Email address" required />
                      <label for="registrar_staff-email">Email address</label>
                    </div>
                    <div class="form-floating mb-4">
                      <input type="password" class="form-control form-control-lg login-input password-input" id="registrar_staff-password" placeholder="Password" required />
                      <label for="registrar_staff-password">Password</label>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Log in</button>
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

