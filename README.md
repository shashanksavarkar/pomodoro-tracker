# Pomodoro Timer

A Pomodoro Timer web app built with React and Vite.

Built for the [roadmap.sh Pomodoro Timer project](https://roadmap.sh/projects/pomodoro-timer).

## Features

- Start, pause/stop, and resume a work session timer
- Configurable durations: work (default 25 min), short break (default 5 min), long break (default 15 min, triggered after 4 work sessions)
- Displays the current session type (Work / Short Break / Long Break) and lets you jump between them
- Tracks completed work sessions
- Plays a sound when a session ends
- Responsive, accessible UI (keyboard navigable, ARIA labels, light/dark theme support)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run preview` — preview the production build
- `npm run lint` — lint the source with oxlint

## Project structure

```
src/
  hooks/usePomodoroTimer.js   # timer state machine (sessions, counts, settings)
  components/                 # TimerDisplay, TimerControls, SessionTabs, SessionTracker, SettingsPanel
  utils/                       # constants, formatting, sound, settings persistence
```
