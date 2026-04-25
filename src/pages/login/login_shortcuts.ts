import { getPortalShortcutRoute } from '../../app/portal_shortcuts'

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
