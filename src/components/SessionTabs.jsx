import { SESSION_TYPES, SESSION_LABELS } from '../utils/constants';
import styles from './SessionTabs.module.css';

const ORDER = [SESSION_TYPES.WORK, SESSION_TYPES.SHORT_BREAK, SESSION_TYPES.LONG_BREAK];

export function SessionTabs({ sessionType, onSelect }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Session type">
      {ORDER.map((type) => {
        const isActive = type === sessionType;
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ''} ${styles[type]}`}
            onClick={() => onSelect(type)}
          >
            {SESSION_LABELS[type]}
          </button>
        );
      })}
    </div>
  );
}
