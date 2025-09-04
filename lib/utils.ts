export function formatMMSS(totalMs: number): string {
  const totalSec = Math.max(0, Math.round(totalMs / 1000));
  const mm = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = (totalSec % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

import { useEffect, useReducer, useState } from "react";

export function useNowTick(enabled: boolean, stepMs: number = 250): number {
  // Return a numeric tick that increments on the given interval. Components
  // can include the returned tick in dependency arrays so values derived
  // from Date.now() are recomputed on each tick.
  const [tick, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(force, stepMs);
    return () => clearInterval(id);
  }, [enabled, stepMs]);
  return tick;
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Start with the provided initial value for a deterministic server render.
  // Read persisted value from localStorage only after mount to avoid
  // SSR/client hydration mismatches.
  const [state, setState] = useState<T>(initial);

  // On mount, load any saved value and replace the initial state.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist state changes to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}

export function beep(): () => void {
  let audio: HTMLAudioElement | null = null;
  try {
    audio = new window.Audio("/school-bell-199584.mp3");
    audio.loop = true;
    audio.play();
  } catch {}
  return () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
  };
}
