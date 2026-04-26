import { ROUTES } from '../../app/routes'

type ShortcutOptions = {
  allowWhenTyping?: boolean
}

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element?.isContentEditable === true
  )
}

export function getPortalShortcutRoute(event: KeyboardEvent, options: ShortcutOptions = {}): string | null {
  if (event.defaultPrevented || event.repeat) return null
  if (!options.allowWhenTyping && isTypingTarget(event.target)) return null

  const isMac = navigator.platform.toLowerCase().includes('mac')
  const isMacCombo = isMac && event.metaKey && event.shiftKey
  const isWindowsCombo = !isMac && event.ctrlKey && event.shiftKey
  if (!isMacCombo && !isWindowsCombo) return null

  const key = event.code.replace('Key', '').toLowerCase()
  const shortcutRouteByKey: Record<string, string> = {
    a: ROUTES.ADMINISTRATORS_LOGIN,
    r: ROUTES.REGISTRAR_LOGIN,
    d: ROUTES.DEPARTMENT_LOGIN,
    h: ROUTES.HR_LOGIN,
  }

  return shortcutRouteByKey[key] ?? null
}

export function setupLoginPageShortcuts(): () => void {
  const onKeydown = (event: KeyboardEvent): void => {
    const targetRoute = getPortalShortcutRoute(event, { allowWhenTyping: true })
    if (!targetRoute) return

    event.preventDefault()
    if (window.location.pathname === targetRoute) return
    window.location.assign(targetRoute)
  }

  document.addEventListener('keydown', onKeydown)
  return () => {
    document.removeEventListener('keydown', onKeydown)
  }
}

