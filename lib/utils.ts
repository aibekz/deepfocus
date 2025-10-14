export function formatMMSS(totalMs: number): string {
  const totalSec = Math.max(0, Math.round(totalMs / 1000));
  const mm = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = (totalSec % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

import { useEffect, useReducer, useState } from "react";

export function useNowTick(enabled: boolean, stepMs: number = 100): number {
  // Return a numeric tick that increments on the given interval. Components
  // can include the returned tick in dependency arrays so values derived
  // from Date.now() are recomputed on each tick.
  // Reduced stepMs from 250ms to 100ms for better accuracy
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

export function beep(
  timerType: "focus" | "short" | "long" = "focus",
): () => void {
  let audioContext: AudioContext | null = null;

  try {
    // Simple, quick beep configuration
    const getSoundConfig = (timerType: "focus" | "short" | "long") => {
      switch (timerType) {
        case "focus":
          return { frequency: 600, volume: 0.1, beepCount: 5, interval: 200 };
        case "short":
          return { frequency: 500, volume: 0.08, beepCount: 1, interval: 0 };
        case "long":
          return { frequency: 400, volume: 0.06, beepCount: 3, interval: 300 };
        default:
          return { frequency: 500, volume: 0.08, beepCount: 1, interval: 0 };
      }
    };

    const playBeep = (frequency: number, volume: number) => {
      try {
        if (!audioContext) {
          const w = window as unknown as {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
          };
          const Ctor = w.AudioContext ?? w.webkitAudioContext;
          if (!Ctor) throw new Error("Web Audio API is not supported");
          audioContext = new Ctor();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime,
        );
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + 0.01,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.2, // Shorter beep duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.warn("Failed to play beep:", error);
      }
    };

    const showVisualNotification = () => {
      // Browser notification
      if (Notification.permission === "granted") {
        new Notification("Timer Complete!", {
          body: "Your Pomodoro session has finished.",
          icon: "/favicon.svg",
          tag: "pomodoro-timer",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Timer Complete!", {
              body: "Your Pomodoro session has finished.",
              icon: "/favicon.svg",
              tag: "pomodoro-timer",
            });
          }
        });
      }
    };

    const config = getSoundConfig(timerType);

    // Play limited number of quick beeps
    const playBeepSequence = () => {
      for (let i = 0; i < config.beepCount; i++) {
        setTimeout(() => {
          playBeep(config.frequency, config.volume);
        }, i * config.interval);
      }
    };

    // Start immediately
    playBeepSequence();
    showVisualNotification();

    // Return cleanup function
    return () => {
      if (audioContext) {
        try {
          audioContext.close();
        } catch (error) {
          console.warn("Failed to cleanup audio context:", error);
        }
        audioContext = null;
      }
    };
  } catch (error) {
    console.warn("Failed to create digital beep:", error);
    return () => {};
  }
}
