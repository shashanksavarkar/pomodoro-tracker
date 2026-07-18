export const SESSION_TYPES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

export const SESSION_LABELS = {
  [SESSION_TYPES.WORK]: 'Work',
  [SESSION_TYPES.SHORT_BREAK]: 'Short Break',
  [SESSION_TYPES.LONG_BREAK]: 'Long Break',
};

export const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4,
};

export const SETTINGS_STORAGE_KEY = 'pomodoro-settings';
