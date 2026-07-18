import { useEffect, useRef, useState } from 'react';
import styles from './SettingsPanel.module.css';

const FIELDS = [
  { key: 'work', label: 'Work (minutes)' },
  { key: 'shortBreak', label: 'Short break (minutes)' },
  { key: 'longBreak', label: 'Long break (minutes)' },
  { key: 'sessionsUntilLongBreak', label: 'Work sessions before long break' },
];

export function SettingsPanel({ settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleChange(key, value) {
    const numeric = Math.max(1, Math.min(180, Number(value) || 1));
    setDraft((prev) => ({ ...prev, [key]: numeric }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" className={styles.title}>
          Timer Settings
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {FIELDS.map((field, index) => (
            <label key={field.key} className={styles.field}>
              <span>{field.label}</span>
              <input
                ref={index === 0 ? firstFieldRef : undefined}
                type="number"
                min="1"
                max="180"
                value={draft[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </label>
          ))}

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.save}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
