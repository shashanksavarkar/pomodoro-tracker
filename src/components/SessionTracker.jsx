import styles from './SessionTracker.module.css';

export function SessionTracker({ cycleCount, sessionsUntilLongBreak, completedWorkSessions }) {
  const dots = Array.from({ length: sessionsUntilLongBreak }, (_, i) => i < cycleCount);

  return (
    <div className={styles.tracker}>
      <ul className={styles.dots} aria-hidden="true">
        {dots.map((filled, i) => (
          <li key={i} className={`${styles.dot} ${filled ? styles.filled : ''}`} />
        ))}
      </ul>
      <p className={styles.count}>
        <span className={styles.countNumber}>{completedWorkSessions}</span>{' '}
        work {completedWorkSessions === 1 ? 'session' : 'sessions'} completed
      </p>
    </div>
  );
}
