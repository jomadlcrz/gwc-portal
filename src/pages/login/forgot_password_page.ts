import '../../styles/login.css'
const gwcLogo = '/images/gwc_logo.avif'
import { renderPortalHeader } from '../../components/layout/header'
import { renderPortalSiteFooter } from '../../components/layout/footer'

/**
 * SECURITY NOTES FOR BACKEND IMPLEMENTATION:
 * 
 * 1. OTP DELIVERY (Step 2)
 *    - Send OTP ONLY to registered email (prevents account enumeration)
 *    - Never reveal if account exists or not
 *    - Always show same success message regardless of account existence
 *    - Message: "If the account exists, an OTP has been sent to the registered email."
 * 
 * 2. OTP SECURITY
 *    - Generate 6-digit random OTP
 *    - Set expiration to 5 minutes
 *    - Limit to 3 failed attempts per OTP
 *    - Store hashed OTP (never store plain text)
 * 
 * 3. RATE LIMITING (Backend)
 *    - Max 5 password reset requests per hour per IP address
 *    - Lock account temporarily after exceeded attempts
 *    - Log all reset attempts for security audit
 * 
 * 4. SECURITY ALERT EMAIL (Server-side)
 *    - Send notification to real owner when reset is requested:
 *      "A password reset was requested for your account."
 *      "If this wasn't you, you can ignore this email."
 *      "Time: [timestamp], IP: [user IP]"
 * 
 * 5. VERIFICATION LAYERS (Step 1)
 *    - Email address (required)
 *    - Date of Birth (required) - adds layer for school portal
 *    - Both must match records in database
 *    - Only proceed if BOTH match
 * 
 * 6. PASSWORD RESET (Step 3)
 *    - Only accessible after OTP verification (frontend enforces display, backend validates)
 *    - Validate password meets requirements before submission
 *    - Store password as hashed (bcrypt, argon2, etc.)
 *    - Invalidate all existing sessions after password change
 *    - Send confirmation email to account owner
 */

// ===================================================================
// REFACTORED TIMELINE RENDER FUNCTION
// ===================================================================
// CHANGES:
// 1. Lines now span from the beginning of the container to the end, ensuring the connection
//    does not stop at the "Reset Password" step but continues visually as a whole.
// 2. Instead of positioning fixed-width lines between steps, the CSS flex layout is enhanced
//    with pseudo-elements and proper absolute positioning that spans the entire track.
// 3. The "timeline-line" elements are now removed — we use a single background track line plus
//    dynamic progress fill that connects from the first step all the way to the last.
// 4. Maintains same active/completed states but lines now reflect progress across the whole timeline.
// ===================================================================

function renderPasswordResetTimeline(currentStep: number): string {
  // Step 1 = 0, Step 2 = 0.5, Step 3+ = 1
  let progressRatio = 0
  if (currentStep === 2) progressRatio = 0.5
  else if (currentStep >= 3) progressRatio = 1
  
  return `
    <div class="password-reset-timeline mb-4">
      <div class="timeline-container refactored-full-line" style="--password-reset-progress: ${progressRatio};">
        <!-- Background track line (connects from left to right edge) -->
        <div class="timeline-track-line"></div>
        <!-- Dynamic progress line (fills based on step, connects all the way across) -->
        <div class="timeline-progress-line"></div>
        
        <div class="timeline-step" data-step="1">
          <div class="timeline-circle ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}">
            ${currentStep > 1 ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : '1'}
          </div>
          <span class="admission-stepper-label timeline-label">Verify Account</span>
        </div>
        
        <div class="timeline-step" data-step="2">
          <div class="timeline-circle ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}">
            ${currentStep > 2 ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : '2'}
          </div>
          <span class="admission-stepper-label timeline-label">Verify OTP</span>
        </div>
        
        <div class="timeline-step" data-step="3">
          <div class="timeline-circle ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}">
            ${currentStep > 3 ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : '3'}
          </div>
          <span class="admission-stepper-label timeline-label">Reset Password</span>
        </div>
      </div>
    </div>
  `
}

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
                ${renderPasswordResetTimeline(1)}
                
                <!-- Step 1: Verify Account -->
                <div id="step-1" class="password-reset-step active">
                  <h2 class="login-heading mb-2">Forgot Password</h2>
                  <p class="login-subheading mb-4">Let's find your account. Please provide the information below.</p>
                  <form id="verify-account-form">
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="verify-account-email" placeholder="Email address" required />
                      <label for="verify-account-email">Email Address</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input type="date" class="form-control form-control-lg login-input" id="verify-account-dob" placeholder="Date of birth" required />
                      <label for="verify-account-dob">Date of Birth</label>
                    </div>
                    <small class="d-block text-muted mb-3">For security reasons, we need to verify your identity.</small>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Send OTP</button>
                    <div id="step-1-alert" class="alert alert-info mt-3" role="alert" style="display: none;">
                      <small id="step-1-alert-text"></small>
                    </div>
                  </form>
                </div>

                <!-- Step 2: Verify OTP -->
                <div id="step-2" class="password-reset-step">
                  <h2 class="login-heading mb-2">Verify OTP</h2>
                  <p class="login-subheading mb-4">We sent a 6-digit verification code to <span id="otp-email-display">your registered email</span>.</p>
                  <form id="verify-otp-form">
                    <div class="otp-input-group mb-3">
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                      <input type="text" class="otp-input" maxlength="1" inputmode="numeric" placeholder="0" required />
                    </div>
                    <div class="otp-footer mb-3 d-flex justify-content-between align-items-center">
                      <small class="text-muted">Code expires in <strong id="otp-timer">05:00</strong></small>
                      <small id="otp-attempts" class="text-muted">Attempts: <strong>3</strong></small>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn mb-2">Verify OTP</button>
                    <div class="text-center">
                      <small class="text-muted">Didn't receive the code? <a href="#" id="resend-otp-link" class="text-decoration-none fw-semibold">Resend OTP</a> or <a href="#" id="change-email-link" class="text-decoration-none fw-semibold">Change Email</a></small>
                    </div>
                    <div id="step-2-alert" class="alert mt-3" role="alert" style="display: none;">
                      <small id="step-2-alert-text"></small>
                    </div>
                  </form>
                </div>

                <!-- Step 3: Reset Password -->
                <div id="step-3" class="password-reset-step">
                  <h2 class="login-heading mb-2">Create New Password</h2>
                  <p class="login-subheading mb-4">Please create a strong password you don't use on other websites.</p>
                  <form id="reset-password-form">
                    <div class="form-floating mb-3 position-relative">
                      <input type="password" class="form-control form-control-lg login-input" id="new-password" placeholder="Password" required />
                      <label for="new-password">New Password</label>
                      <button type="button" class="password-toggle" data-target="new-password" aria-label="Toggle password visibility">
                        <i class="bi bi-eye" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div class="password-strength mb-3">
                      <div class="strength-bar">
                        <div class="strength-progress" id="strength-progress"></div>
                      </div>
                      <small id="strength-text" class="d-block text-muted">Weak</small>
                    </div>
                    <ul class="password-requirements mb-3 ps-3">
                      <li><small><span class="requirement-check" data-requirement="length">✓</span> At least 8 characters</small></li>
                      <li><small><span class="requirement-check" data-requirement="letters">✓</span> Contains letters and numbers</small></li>
                      <li><small><span class="requirement-check" data-requirement="special">✓</span> Contains special characters</small></li>
                    </ul>
                    <div class="form-floating mb-3 position-relative">
                      <input type="password" class="form-control form-control-lg login-input" id="confirm-password" placeholder="Confirm password" required />
                      <label for="confirm-password">Confirm New Password</label>
                      <button type="button" class="password-toggle" data-target="confirm-password" aria-label="Toggle password visibility">
                        <i class="bi bi-eye" aria-hidden="true"></i>
                      </button>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Reset Password</button>
                    <div id="step-3-alert" class="alert mt-3" role="alert" style="display: none;">
                      <small id="step-3-alert-text"></small>
                    </div>
                  </form>
                </div>

                <!-- Success Message -->
                <div id="step-success" class="password-reset-step text-center">
                  <div class="success-icon mb-3">
                    <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
                  </div>
                  <h2 class="login-heading mb-2">Password Reset Successful</h2>
                  <p class="login-subheading mb-4">Your password has been updated. You can now log in using your new password.</p>
                  <a href="/login" class="btn btn-lg w-100 login-submit-btn">Go to Login</a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      ${renderPortalSiteFooter()}
    </main>
  `
}
