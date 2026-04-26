# Keyboard Shortcuts

## Overview
This feature enables quick navigation to key routes using keyboard combinations. It supports both Mac and Windows/Linux environments.

---

## Key Combinations

### Mac
- `⌘ + Shift + A` → Administrator Login
- `⌘ + Shift + R` → Registrar Staff Login
- `⌘ + Shift + D` → Dean Login
- `⌘ + Shift + H` → HR Login

### Windows / Linux
- `Ctrl + Shift + A` → Administrator Login
- `Ctrl + Shift + R` → Registrar Staff Login
- `Ctrl + Shift + D` → Dean Login
- `Ctrl + Shift + H` → HR Login


---

## Behavior

- Shortcuts trigger **route navigation**.
- Automatically:
  - Closes any open overlays
  - Prevents default browser behavior
- Uses `event.code` for consistent key detection.

---

## Input Safety

Shortcuts are **disabled** when the user is typing in:
- `<input>`
- `<textarea>`
- `<select>`
- `contenteditable` elements

---

## Escape Key

- `Esc` → Closes all overlays (menu, search, submenus)

---

## Implementation Details

- Detects platform via `navigator.platform`
- Supports:
  - `metaKey` (Mac)
  - `ctrlKey` (Windows/Linux)
- Requires `Shift` key to avoid accidental triggers
- Ignores:
  - Repeated key events
  - Prevented events

---

## Key Mapping

| Key | Route Constant |
|-----|--------------|
| A   | `ROUTES.ADMINISTRATOR_LOGIN` |
| R   | `ROUTES.REGISTRAR_STAFF_LOGIN` |
| D   | `ROUTES.DEAN_LOGIN` |

---

## Summary

This system provides:
- Fast navigation for internal users
- Cross-platform consistency
- Safe, non-intrusive keyboard handling


