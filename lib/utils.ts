export function formatMMSS(totalMs: number): string {
  const totalSec = Math.max(0, Math.round(totalMs / 1000));
  const mm = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = (totalSec % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

import { useEffect, useReducer, useState } from "react";

export function useNowTick(enabled: boolean, stepMs: number = 250) {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(force, stepMs);
    return () => clearInterval(id);
  }, [enabled, stepMs]);
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      if (typeof window !== "undefined")
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
