# Design

## High-level Architecture

- Single-page app (no framework) using modular classes in `js/script.js`.
- Key modules/classes:
  - `DataManager` — localStorage abstraction (get/save for todos, links, theme, user name, timer duration).
  - `ThemeManager` — apply/toggle theme and update UI icon.
  - `TimeManager` — clock update and greeting logic.
  - `UserNameManager` — show/edit user name and persist.
  - `TodoManager` — CRUD for tasks, rendering list, edit modal.
  - `TimerManager` — countdown logic, focus overlay, audio notification.
  - `LinksManager` — CRUD for quick links, URL validation, rendering.

## State

- `AppState` central object holds:
  - `todos`, `links`
  - `theme`, `userName`
  - `timerDuration`, `timeRemaining`, `isTimerRunning`, `timerInterval`
  - `editingTaskId`, `editingLinkId`

## DOM Structure (from `index.html`)

- Header: theme toggle and app title.
- Greeting section: greeting text, current time/date, user name + edit button, name modal.
- Left column: todo section (input, list, empty state) and timer section (duration input, display, controls).
- Right column: quick links (name/url inputs, grid of link cards, empty state) and link edit modal.
- Focus overlay: full-screen modal shown during active timer.

## Data Flow

- User actions → Manager methods (e.g., `TodoManager.addTodo`) → update `AppState` → `DataManager.save*` → `render()` updates DOM.

## Theming & Styling

- CSS variables in `css/style.css` control light/dark palettes via `[data-theme="dark"]`.
- Components use `var(--...)` tokens for color, spacing, and radii for consistent styling and easy theme changes.

## Timer Behavior

- Timer duration set via input (minutes) and persisted.
- On `start()`: saves duration, disables controls, opens focus overlay, starts interval decrementing `timeRemaining` each second, updates both `timer-time` and `focus-timer` displays.
- On completion: stop interval, close overlay, and attempt a notification via Web Audio API.

## Modals & Accessibility

- Modals are shown/hidden via `.hidden` class and are focusable; Enter key handlers exist on inputs to submit.
- ARIA labels are present for important controls (e.g., `theme-toggle`, add buttons).

## Extensibility Points

- Swap `localStorage` to IndexedDB or remote backend by replacing `DataManager` methods.
- Add service worker for offline support and richer notifications.
- Extract UI components into Web Components or framework components if migrating to a framework.
