import styles from './TimerControls.module.css';

export function TimerControls({ isRunning, isFresh, onStart, onPause, onReset, onSkip }) {
  return (
    <div className={styles.controls}>
      <button type="button" className={styles.secondary} onClick={onReset} aria-label="Reset current session">
        Reset
      </button>

      {isRunning ? (
        <button type="button" className={styles.primary} onClick={onPause} aria-label="Pause timer">
          Pause
        </button>
      ) : (
        <button type="button" className={styles.primary} onClick={onStart} aria-label={isFresh ? 'Start timer' : 'Resume timer'}>
          {isFresh ? 'Start' : 'Resume'}
        </button>
      )}

      <button type="button" className={styles.secondary} onClick={onSkip} aria-label="Skip to next session">
        Skip
      </button>
    </div>
  );
}
