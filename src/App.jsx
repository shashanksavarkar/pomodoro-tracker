import { useEffect, useRef, useState } from 'react';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import { SESSION_LABELS } from './utils/constants';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { SessionTabs } from './components/SessionTabs';
import { SessionTracker } from './components/SessionTracker';
import { SettingsPanel } from './components/SettingsPanel';
import styles from './App.module.css';

function App() {
  const timer = usePomodoroTimer();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const settingsButtonRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAnnouncement(`${SESSION_LABELS[timer.sessionType]} session started.`);
  }, [timer.sessionType]);

  function closeSettings() {
    setSettingsOpen(false);
    settingsButtonRef.current?.focus();
  }

  function saveSettings(newSettings) {
    timer.updateSettings(newSettings);
    closeSettings();
  }

  const isFresh = timer.secondsLeft === timer.totalSeconds;

  return (
    <div className={`${styles.page} ${styles[timer.sessionType]}`}>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <header className={styles.header}>
        <h1 className={styles.brand}>Pomodoro</h1>
        <button
          ref={settingsButtonRef}
          type="button"
          className={styles.settingsButton}
          onClick={() => setSettingsOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open timer settings"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M19.14 12.94a7.14 7.14 0 0 0 .06-.94 7.14 7.14 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L1.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.4.32.6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.2.08.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58Zm-7.14 2.44a3.38 3.38 0 1 1 0-6.76 3.38 3.38 0 0 1 0 6.76Z"
            />
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        <SessionTabs sessionType={timer.sessionType} onSelect={timer.setSessionType} />

        <TimerDisplay
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          sessionType={timer.sessionType}
          sessionLabel={SESSION_LABELS[timer.sessionType]}
        />

        <TimerControls
          isRunning={timer.isRunning}
          isFresh={isFresh}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.resetSession}
          onSkip={timer.skip}
        />

        <SessionTracker
          cycleCount={timer.cycleCount}
          sessionsUntilLongBreak={timer.settings.sessionsUntilLongBreak}
          completedWorkSessions={timer.completedWorkSessions}
        />
      </main>

      {settingsOpen && (
        <SettingsPanel settings={timer.settings} onSave={saveSettings} onClose={closeSettings} />
      )}
    </div>
  );
}

export default App;
