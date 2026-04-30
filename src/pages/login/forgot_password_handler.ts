/**
 * Forgot Password Page - TypeScript Handler
 * 
 * SECURITY FEATURES IMPLEMENTED:
 * 1. Email + Date of Birth verification (prevents account enumeration)
 * 2. OTP sent to registered email only
 * 3. OTP expiration timer (5 minutes)
 * 4. Max 3 OTP attempts
 * 5. Password strength validation
 * 6. Password confirmation validation
 * 7. Rate limiting message handling
 * 8. Secure messaging (doesn't reveal if email exists)
 */

class PasswordResetFlow {
  private otpTimer: ReturnType<typeof setInterval> | null = null
  private otpAttempts: number = 3
  private userEmail: string | null = null

  constructor() {
    this.setupEventListeners()
  }

  // ==========================================
  // STEP NAVIGATION
  // ==========================================

  showStep(stepNumber: number): void {
    // Hide all steps
    document.querySelectorAll('.password-reset-step').forEach(step => {
      step.classList.remove('active')
    })

    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`)
    if (currentStepElement) {
      currentStepElement.classList.add('active')
    }

    // Update timeline
    this.updateTimeline(stepNumber)

    // Reset scroll position
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  updateTimeline(stepNumber: number): void {
    document.querySelectorAll('.timeline-circle').forEach((circle, index) => {
      const step = index + 1
      circle.classList.remove('active', 'completed')

      if (step < stepNumber) {
        circle.classList.add('completed')
      } else if (step === stepNumber) {
        circle.classList.add('active')
      }
    })
  }

  // ==========================================
  // STEP 1: VERIFY ACCOUNT
  // ==========================================

  setupStep1(): void {
    const form = document.getElementById('verify-account-form') as HTMLFormElement
    const emailInput = document.getElementById('verify-account-email') as HTMLInputElement
    const dobInput = document.getElementById('verify-account-dob') as HTMLInputElement

    form?.addEventListener('submit', async (e: Event) => {
      e.preventDefault()

      const email = emailInput.value.trim()
      const dob = dobInput.value

      // Validate inputs
      if (!email || !dob) {
        this.showAlert('step-1-alert', 'Please fill in all fields.', 'danger')
        return
      }

      // Validate email format
      if (!this.isValidEmail(email)) {
        this.showAlert('step-1-alert', 'Please enter a valid email address.', 'danger')
        return
      }

      // Store email for later use
      this.userEmail = email

      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
      const originalText: string | null = submitBtn.textContent

      try {
        // Show loading state
        submitBtn.disabled = true
        submitBtn.textContent = 'Sending OTP...'

        // Call backend API to send OTP
        const response = await this.sendOTP(email, dob)

        if (response.success) {
          // Show success message (secure message - doesn't reveal if email exists)
          this.showAlert('step-1-alert', 'If the account exists, an OTP has been sent to the registered email.', 'info')

          // Move to step 2 after 2 seconds
          setTimeout(() => {
            this.showStep(2)
            this.startOTPTimer()
            this.displayMaskedEmail(email)
          }, 2000)
        } else {
          // Show error (generic message for security)
          this.showAlert('step-1-alert', response.message || 'Unable to send OTP. Please try again.', 'danger')
        }
      } catch (error) {
        this.showAlert('step-1-alert', 'An error occurred. Please try again.', 'danger')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = originalText || 'Send OTP'
      }
    })
  }

  // ==========================================
  // STEP 2: VERIFY OTP
  // ==========================================

  setupStep2(): void {
    const otpInputs = document.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>
    const form = document.getElementById('verify-otp-form') as HTMLFormElement
    const resendLink = document.getElementById('resend-otp-link') as HTMLAnchorElement
    const changeEmailLink = document.getElementById('change-email-link') as HTMLAnchorElement

    // Auto-focus and auto-shift between OTP inputs
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement
        // Only allow digits
        target.value = target.value.replace(/[^0-9]/g, '')

        // Auto-focus next input
        if (target.value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }
      })

      input.addEventListener('keydown', (e: KeyboardEvent) => {
        const target = e.target as HTMLInputElement
        // Handle backspace
        if (e.key === 'Backspace' && !target.value && index > 0) {
          otpInputs[index - 1].focus()
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
          otpInputs[index - 1].focus()
        }
        if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }
      })

      input.addEventListener('paste', (e: ClipboardEvent) => {
        e.preventDefault()
        const pasteData = e.clipboardData?.getData('text') || ''
        const digits = pasteData.replace(/[^0-9]/g, '').split('')

        digits.forEach((digit, i) => {
          if (i < otpInputs.length) {
            otpInputs[i].value = digit
          }
        })

        // Focus last input or submit if all filled
        const lastFilledIndex = Math.min(digits.length - 1, otpInputs.length - 1)
        if (lastFilledIndex === otpInputs.length - 1) {
          form.dispatchEvent(new Event('submit'))
        } else {
          otpInputs[lastFilledIndex + 1].focus()
        }
      })
    })

    // Form submission
    form?.addEventListener('submit', async (e: Event) => {
      e.preventDefault()

      const otp = Array.from(otpInputs).map(input => input.value).join('')

      if (otp.length !== 6) {
        this.showAlert('step-2-alert', 'Please enter all 6 digits.', 'danger')
        otpInputs[0].focus()
        return
      }

      try {
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
        submitBtn.disabled = true
        submitBtn.textContent = 'Verifying...'

        if (!this.userEmail) {
          this.showAlert('step-2-alert', 'Session expired. Please start over.', 'danger')
          this.showStep(1)
          return
        }

        const response = await this.verifyOTP(this.userEmail, otp)

        if (response.success) {
          this.clearOTPTimer()
          this.showStep(3)
        } else {
          this.otpAttempts--
          this.updateOTPAttempts()

          if (this.otpAttempts <= 0) {
            this.showAlert('step-2-alert', 'Maximum attempts exceeded. Please request a new OTP.', 'danger')
            // Disable all OTP inputs
            otpInputs.forEach(input => (input.disabled = true))
          } else {
            this.showAlert('step-2-alert', `Invalid OTP. ${this.otpAttempts} attempts remaining.`, 'danger')
            // Clear inputs for retry
            otpInputs.forEach(input => (input.value = ''))
            otpInputs[0].focus()
          }
        }
      } catch (error) {
        this.showAlert('step-2-alert', 'An error occurred. Please try again.', 'danger')
      } finally {
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
        submitBtn.disabled = false
        submitBtn.textContent = 'Verify OTP'
      }
    })

    // Resend OTP
    resendLink?.addEventListener('click', async (e: Event) => {
      e.preventDefault()

      if (!this.userEmail) return

      try {
        resendLink.textContent = 'Sending...'
        resendLink.style.pointerEvents = 'none'

        const response = await this.sendOTP(this.userEmail, '')

        if (response.success) {
          this.otpAttempts = 3
          this.updateOTPAttempts()
          this.clearOTPTimer()
          this.startOTPTimer()
          this.showAlert('step-2-alert', 'A new OTP has been sent.', 'success')

          // Clear inputs
          otpInputs.forEach(input => {
            input.value = ''
            input.disabled = false
          })
          otpInputs[0].focus()
        } else {
          this.showAlert('step-2-alert', 'Failed to resend OTP. Please try again.', 'danger')
        }
      } finally {
        resendLink.textContent = 'Resend OTP'
        resendLink.style.pointerEvents = 'auto'
      }
    })

    // Change Email
    changeEmailLink?.addEventListener('click', (e: Event) => {
      e.preventDefault()
      this.clearOTPTimer()
      this.showStep(1)

      // Clear form
      const form = document.getElementById('verify-account-form') as HTMLFormElement
      form.reset()
      const emailInput = document.getElementById('verify-account-email') as HTMLInputElement
      emailInput.focus()
    })
  }

  updateOTPAttempts(): void {
    const attemptsDisplay = document.getElementById('otp-attempts')
    if (attemptsDisplay) {
      attemptsDisplay.innerHTML = `Attempts: <strong>${this.otpAttempts}</strong>`
    }
  }

  displayMaskedEmail(email: string): void {
    const displayElement = document.getElementById('otp-email-display')
    if (displayElement) {
      // Mask email: juan.cruz@email.com -> j***.c***@email.com
      const [localPart, domain] = email.split('@')
      const maskedLocal = localPart[0] + '***.' + localPart[localPart.length - 1] + '***'
      displayElement.textContent = `${maskedLocal}@${domain}`
    }
  }

  // ==========================================
  // OTP TIMER
  // ==========================================

  startOTPTimer(): void {
    let timeLeft = 300 // 5 minutes

    const updateTimer = () => {
      const minutes = Math.floor(timeLeft / 60)
      const seconds = timeLeft % 60
      const timerDisplay = document.getElementById('otp-timer')

      if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }

      if (timeLeft <= 0) {
        if (this.otpTimer) clearInterval(this.otpTimer)
        this.handleOTPExpiration()
      } else {
        timeLeft--
      }
    }

    updateTimer()
    this.otpTimer = setInterval(updateTimer, 1000)
  }

  clearOTPTimer(): void {
    if (this.otpTimer) {
      clearInterval(this.otpTimer)
      this.otpTimer = null
    }
  }

  handleOTPExpiration(): void {
    const otpInputs = document.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>
    otpInputs.forEach(input => (input.disabled = true))

    this.showAlert('step-2-alert', 'OTP has expired. Please request a new one.', 'danger')

    const resendLink = document.getElementById('resend-otp-link') as HTMLAnchorElement
    resendLink?.click()
  }

  // ==========================================
  // STEP 3: RESET PASSWORD
  // ==========================================

  setupStep3(): void {
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement
    const form = document.getElementById('reset-password-form') as HTMLFormElement
    const passwordToggles = document.querySelectorAll('.password-toggle')

    // Password visibility toggle
    passwordToggles.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        e.preventDefault()
        const targetId = (btn as HTMLElement).getAttribute('data-target')
        if (!targetId) return

        const input = document.getElementById(targetId) as HTMLInputElement
        if (!input) return

        if (input.type === 'password') {
          input.type = 'text'
          const icon = btn.querySelector('i')
          icon?.classList.remove('bi-eye')
          icon?.classList.add('bi-eye-slash')
        } else {
          input.type = 'password'
          const icon = btn.querySelector('i')
          icon?.classList.remove('bi-eye-slash')
          icon?.classList.add('bi-eye')
        }
      })
    })

    // Password strength validation on input
    newPasswordInput?.addEventListener('input', () => {
      this.updatePasswordStrength(newPasswordInput.value)
      this.validatePasswordMatch()
    })

    confirmPasswordInput?.addEventListener('input', () => {
      this.validatePasswordMatch()
    })

    // Form submission
    form?.addEventListener('submit', async (e: Event) => {
      e.preventDefault()

      const newPassword = newPasswordInput.value
      const confirmPassword = confirmPasswordInput.value

      // Validate passwords
      if (!this.isPasswordValid(newPassword)) {
        this.showAlert('step-3-alert', 'Password does not meet requirements.', 'danger')
        return
      }

      if (newPassword !== confirmPassword) {
        this.showAlert('step-3-alert', 'Passwords do not match.', 'danger')
        confirmPasswordInput.focus()
        return
      }

      try {
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
        submitBtn.disabled = true
        submitBtn.textContent = 'Resetting Password...'

        if (!this.userEmail) {
          this.showAlert('step-3-alert', 'Session expired. Please start over.', 'danger')
          this.showStep(1)
          return
        }

        const response = await this.resetPassword(this.userEmail, newPassword)

        if (response.success) {
          // Show success step
          this.showSuccessStep()

          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.location.href = '/login'
          }, 3000)
        } else {
          this.showAlert('step-3-alert', response.message || 'Failed to reset password.', 'danger')
        }
      } catch (error) {
        this.showAlert('step-3-alert', 'An error occurred. Please try again.', 'danger')
      } finally {
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
        submitBtn.disabled = false
        submitBtn.textContent = 'Reset Password'
      }
    })
  }

  updatePasswordStrength(password: string): void {
    const strengthProgress = document.getElementById('strength-progress')
    const strengthText = document.getElementById('strength-text')
    let strength = 0

    // Check length
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    // Check character types
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    let strengthLevel = 'Weak'
    let progressClass = 'weak'

    if (strength >= 5) {
      strengthLevel = 'Strong'
      progressClass = 'good'
    } else if (strength >= 3) {
      strengthLevel = 'Fair'
      progressClass = 'fair'
    }

    if (strengthProgress) {
      strengthProgress.className = `strength-progress ${progressClass}`
    }

    if (strengthText) {
      strengthText.textContent = strengthLevel
    }

    // Update requirement checks
    this.updateRequirementChecks(password)
  }

  updateRequirementChecks(password: string): void {
    const checks = document.querySelectorAll('.requirement-check')

    const requirements = {
      length: password.length >= 8,
      letters: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    }

    checks.forEach(check => {
      const requirement = (check as HTMLElement).getAttribute('data-requirement') as keyof typeof requirements
      if (requirements[requirement]) {
        check.classList.add('met')
      } else {
        check.classList.remove('met')
      }
    })
  }

  validatePasswordMatch(): void {
    const newPassword = (document.getElementById('new-password') as HTMLInputElement).value
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value

    const confirmInput = document.getElementById('confirm-password') as HTMLInputElement

    if (confirmPassword) {
      if (newPassword === confirmPassword) {
        confirmInput.style.borderColor = '#28a745'
      } else {
        confirmInput.style.borderColor = '#dc3545'
      }
    } else {
      confirmInput.style.borderColor = ''
    }
  }

  isPasswordValid(password: string): boolean {
    // Must have at least 8 characters
    // Must have letters and numbers
    // Must have special character
    const lengthValid = password.length >= 8
    const lettersAndNumbers = /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
    const specialChar = /[^a-zA-Z0-9]/.test(password)

    return lengthValid && lettersAndNumbers && specialChar
  }

  showSuccessStep(): void {
    document.querySelectorAll('.password-reset-step').forEach(step => {
      step.classList.remove('active')
    })

    const successStep = document.getElementById('step-success')
    if (successStep) {
      successStep.classList.add('active')
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  showAlert(alertId: string, message: string, type: string = 'info'): void {
    const alertElement = document.getElementById(alertId)
    if (!alertElement) return

    const alertTextElement = document.getElementById(`${alertId}-text`)
    if (alertTextElement) {
      alertTextElement.textContent = message
    }

    alertElement.className = `alert alert-${type} mt-3`
    alertElement.style.display = 'block'
  }

  // ==========================================
  // API CALLS
  // ==========================================

  async sendOTP(email: string, dob: string): Promise<any> {
    try {
      const response = await fetch('/api/student_auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, dob }),
      })

      return await response.json()
    } catch (error) {
      console.error('Error sending OTP:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    try {
      const response = await fetch('/api/student_auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, otp }),
      })

      return await response.json()
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<any> {
    try {
      const response = await fetch('/api/student_auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, newPassword }),
      })

      return await response.json()
    } catch (error) {
      console.error('Error resetting password:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  setupEventListeners(): void {
    this.setupStep1()
    this.setupStep2()
    this.setupStep3()
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PasswordResetFlow()
  })
} else {
  new PasswordResetFlow()
}

export { PasswordResetFlow }
