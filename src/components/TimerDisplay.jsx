import { formatTime } from '../utils/formatTime';
import styles from './TimerDisplay.module.css';

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerDisplay({ secondsLeft, totalSeconds, sessionType, sessionLabel }) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className={styles.wrapper}>
      <svg className={styles.ring} viewBox="0 0 260 260" aria-hidden="true">
        <circle className={styles.track} cx="130" cy="130" r={RADIUS} />
        <circle
          className={`${styles.progress} ${styles[sessionType]}`}
          cx="130"
          cy="130"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className={styles.time}
        role="timer"
        aria-label={`${sessionLabel} session, ${formatTime(secondsLeft)} remaining`}
      >
        {formatTime(secondsLeft)}
      </div>
    </div>
  );
}
