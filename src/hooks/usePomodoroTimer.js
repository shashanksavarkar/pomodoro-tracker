import { useEffect, useReducer, useRef, useCallback } from 'react';
import { SESSION_TYPES } from '../utils/constants';
import { loadSettings, saveSettings } from '../utils/settingsStorage';
import { playSessionEndSound } from '../utils/sound';

const SESSION_ORDER_KEY = {
  [SESSION_TYPES.WORK]: 'work',
  [SESSION_TYPES.SHORT_BREAK]: 'shortBreak',
  [SESSION_TYPES.LONG_BREAK]: 'longBreak',
};

function durationFor(sessionType, settings) {
  return settings[SESSION_ORDER_KEY[sessionType]] * 60;
}

function nextSession(state) {
  const { sessionType, settings, cycleCount } = state;

  if (sessionType === SESSION_TYPES.WORK) {
    const completedWorkSessions = state.completedWorkSessions + 1;
    const newCycleCount = cycleCount + 1;
    const isLongBreakDue = newCycleCount >= settings.sessionsUntilLongBreak;
    const type = isLongBreakDue ? SESSION_TYPES.LONG_BREAK : SESSION_TYPES.SHORT_BREAK;

    return {
      sessionType: type,
      cycleCount: isLongBreakDue ? 0 : newCycleCount,
      completedWorkSessions,
      secondsLeft: durationFor(type, settings),
    };
  }

  return {
    sessionType: SESSION_TYPES.WORK,
    cycleCount,
    completedWorkSessions: state.completedWorkSessions,
    secondsLeft: durationFor(SESSION_TYPES.WORK, settings),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };

    case 'PAUSE':
      return { ...state, isRunning: false };

    case 'TICK':
      if (state.secondsLeft <= 0) return state;
      return { ...state, secondsLeft: state.secondsLeft - 1 };

    case 'COMPLETE_SESSION':
      return { ...state, ...nextSession(state), isRunning: state.autoStart };

    case 'SKIP':
      return { ...state, ...nextSession(state), isRunning: false };

    case 'RESET_SESSION':
      return {
        ...state,
        isRunning: false,
        secondsLeft: durationFor(state.sessionType, state.settings),
      };

    case 'SET_SESSION_TYPE':
      return {
        ...state,
        isRunning: false,
        sessionType: action.payload,
        secondsLeft: durationFor(action.payload, state.settings),
      };

    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings,
        isRunning: false,
        secondsLeft: durationFor(state.sessionType, settings),
      };
    }

    default:
      return state;
  }
}

function createInitialState() {
  const settings = loadSettings();
  return {
    settings,
    sessionType: SESSION_TYPES.WORK,
    secondsLeft: durationFor(SESSION_TYPES.WORK, settings),
    isRunning: false,
    cycleCount: 0,
    completedWorkSessions: 0,
    autoStart: true,
  };
}

export function usePomodoroTimer() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!state.isRunning) return undefined;

    intervalRef.current = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => window.clearInterval(intervalRef.current);
  }, [state.isRunning]);

  useEffect(() => {
    if (state.secondsLeft === 0 && state.isRunning) {
      playSessionEndSound();
      dispatch({ type: 'COMPLETE_SESSION' });
    }
  }, [state.secondsLeft, state.isRunning]);

  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);
  const skip = useCallback(() => dispatch({ type: 'SKIP' }), []);
  const setSessionType = useCallback(
    (payload) => dispatch({ type: 'SET_SESSION_TYPE', payload }),
    []
  );
  const updateSettings = useCallback(
    (payload) => dispatch({ type: 'UPDATE_SETTINGS', payload }),
    []
  );

  const totalSeconds = durationFor(state.sessionType, state.settings);

  return {
    ...state,
    totalSeconds,
    start,
    pause,
    resetSession,
    skip,
    setSessionType,
    updateSettings,
  };
}
