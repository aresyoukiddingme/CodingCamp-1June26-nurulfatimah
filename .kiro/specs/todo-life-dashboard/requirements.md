# Requirements

## Project Overview

Simple single-page "To-Do Life Dashboard" app that provides a greeting, theme toggle (light/dark), a persistent to-do list, a focus timer with focus overlay, and quick links. The app persists user data in `localStorage`.

## Functional Requirements

- Greeting: show time, date, and contextual greeting depending on hour, including the user's name.
- Theme toggle: switch between light and dark themes and persist choice.
- User name: allow editing and persist the user name.
- To-do list: create, read, update, delete tasks; mark tasks completed; persist tasks.
- Focus timer: set duration (minutes), start/stop/reset timer; open a focus overlay while timer runs; notify on completion.
- Quick links: add/edit/delete links with name and URL; open links in new tab; persist links.
- Modals: use modals for editing name, tasks, and links.

## Non-functional Requirements

- Persistence: use `localStorage` with defined keys for todos, links, theme, user name, and timer duration.
- Responsiveness: layout adapts from two-column to single column on small screens.
- Accessibility: keyboard support for Enter key on inputs and buttons; visible focus states; ARIA labels present in markup.
- Performance: lightweight, no framework, targeted for modern browsers.

## Data Model

- Todo: `{ id, text, completed, createdAt }`
- Link: `{ id, name, url, createdAt }`
- Settings: `theme`, `userName`, `timerDuration`

## Storage Keys

- `dashboard-todos`
- `dashboard-links`
- `dashboard-theme`
- `dashboard-user-name`
- `dashboard-timer-duration`

## Browser / API Dependencies

- Plain HTML/CSS/JavaScript (ES6)
- Web Audio API for timer notification (optional, graceful fallback to console)

## Testing Notes

- Manual: verify add/edit/delete flows, timer countdown and notification, theme persistence across reloads, and responsive layout.
- Edge cases: invalid URLs, empty task names, very long input, timer set to 0, and `localStorage` quota errors.
