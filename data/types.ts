export type PomodoroMode = "focus" | "short" | "long";

export interface PomodoroHistory {
  focusDone: number;
}

export interface PomodoroStore {
  mode: PomodoroMode;
  isRunning: boolean;
  targetAt: number | null;
  remainingMs: number;
  history: Record<string, PomodoroHistory>;
}

export interface SimpliPomodoroAdvancedProps {
  focusMinutes?: number;
  shortMinutes?: number;
  longMinutes?: number;
  size?: number;
}
