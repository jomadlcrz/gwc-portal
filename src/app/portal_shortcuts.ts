import { ROUTES } from './routes'

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
    r: ROUTES.REGISTRAR_STAFF_LOGIN,
    d: ROUTES.DEPARTMENT_LOGIN,
    h: ROUTES.HR_LOGIN,
  }

  return shortcutRouteByKey[key] ?? null
}
