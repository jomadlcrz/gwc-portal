import { ROUTES } from '../app/routes'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in .env.')
}

type LoginResponse = {
  message?: string
  token?: string
  email?: string
  first_name?: string
  user_id?: number
  is_temporary?: boolean
}

const setMessage = (el: HTMLElement | null, message: string, isError: boolean): void => {
  if (!el) return
  el.textContent = message
  el.classList.toggle('text-danger', isError)
  el.classList.toggle('text-success', !isError)
}

export function setupStudentLoginPage(root: HTMLElement): () => void {
  const form = root.querySelector<HTMLFormElement>('#student-login-form')
  const emailInput = root.querySelector<HTMLInputElement>('#student-login-email')
  const passwordInput = root.querySelector<HTMLInputElement>('#student-login-password')
  const messageEl = root.querySelector<HTMLElement>('#student-login-message')

  if (!form || !emailInput || !passwordInput) return () => {}

  const onSubmit = async (event: Event): Promise<void> => {
    event.preventDefault()
    setMessage(messageEl, 'Signing in...', false)

    const email = emailInput.value.trim()
    const password = passwordInput.value

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = (await response.json()) as LoginResponse
      if (!response.ok) {
        setMessage(messageEl, result.message || 'Invalid email or password.', true)
        return
      }

      if (result.token) localStorage.setItem('token', result.token)
      if (result.email) localStorage.setItem('email', result.email)
      if (result.first_name) localStorage.setItem('first_name', result.first_name)
      if (typeof result.user_id === 'number') localStorage.setItem('user_id', String(result.user_id))
      localStorage.setItem('is_temporary', String(Boolean(result.is_temporary)))

      if (result.is_temporary) {
        window.location.assign(ROUTES.CHANGE_PASSWORD)
        return
      }

      window.location.assign(ROUTES.STUDENT_DASHBOARD)
    } catch {
      setMessage(messageEl, 'Unable to reach server. Please try again.', true)
    }
  }

  form.addEventListener('submit', onSubmit)
  return () => {
    form.removeEventListener('submit', onSubmit)
  }
}

export function setupChangePasswordPage(root: HTMLElement): () => void {
  const form = root.querySelector<HTMLFormElement>('#change-password-form')
  const newPasswordInput = root.querySelector<HTMLInputElement>('#change-password-new')
  const confirmPasswordInput = root.querySelector<HTMLInputElement>('#change-password-confirm')
  const messageEl = root.querySelector<HTMLElement>('#change-password-message')

  if (!form || !newPasswordInput || !confirmPasswordInput) return () => {}

  const storedUserId = localStorage.getItem('user_id')
  const isTemporary = localStorage.getItem('is_temporary') === 'true'

  if (!storedUserId || !isTemporary) {
    window.location.assign(ROUTES.STUDENT_LOGIN)
    return () => {}
  }

  const onSubmit = async (event: Event): Promise<void> => {
    event.preventDefault()

    const newPassword = newPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (newPassword.length < 6) {
      setMessage(messageEl, 'Password must be at least 6 characters.', true)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage(messageEl, 'Passwords do not match.', true)
      return
    }

    setMessage(messageEl, 'Updating password...', false)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-password/${storedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ newPassword }),
      })

      const result = (await response.json()) as { message?: string }
      if (!response.ok) {
        setMessage(messageEl, result.message || 'Failed to update password.', true)
        return
      }

      localStorage.setItem('is_temporary', 'false')
      setMessage(messageEl, 'Password updated. Redirecting...', false)
      window.setTimeout(() => {
        window.location.assign(ROUTES.STUDENT_DASHBOARD)
      }, 500)
    } catch {
      setMessage(messageEl, 'Unable to reach server. Please try again.', true)
    }
  }

  form.addEventListener('submit', onSubmit)
  return () => {
    form.removeEventListener('submit', onSubmit)
  }
}


