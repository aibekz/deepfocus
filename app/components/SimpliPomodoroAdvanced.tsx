"use client";
import React from "react";
import type {
  PomodoroMode,
  PomodoroStore,
  SimpliPomodoroAdvancedProps,
} from "@/data/types";
import { beep, formatMMSS, useLocalStorage, useNowTick } from "@/lib/utils";

export function SimpliPomodoroAdvanced({
  focusMinutes = 25, // 25 minutes for test
  shortMinutes = 5, // 5 minutes for test
  longMinutes = 15, // 15 minutes for test
  size = 240,
}: SimpliPomodoroAdvancedProps) {
  const todayKey = new Date().toISOString().slice(0, 10);

  const [store, setStore] = useLocalStorage<PomodoroStore>("simpliPomodoro", {
    mode: "focus",
    isRunning: false,
    targetAt: null,
    remainingMs: focusMinutes * 60 * 1000,
    history: { [todayKey]: { focusDone: 0 } },
  });

  const modeDurationMs: Record<PomodoroMode, number> = React.useMemo(
    () => ({
      focus: focusMinutes * 60 * 1000,
      short: shortMinutes * 60 * 1000,
      long: longMinutes * 60 * 1000,
    }),
    [focusMinutes, shortMinutes, longMinutes],
  );

  // Track whether we've mounted so the initial server render is deterministic
  // (no Date.now() calls during render). Live time (using Date.now) is only
  // computed after mount which prevents hydration mismatches.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Only tick while running and after we've mounted (client-side). The
  // returned `tick` forces re-evaluation of Date.now()-based calculations
  // (see `effectiveRemaining` below).
  const tick = useNowTick(store.isRunning && mounted, 250);

  const effectiveRemaining = React.useMemo(() => {
    if (store.isRunning && store.targetAt && mounted) {
      return Math.max(0, store.targetAt - Date.now());
    }
    return store.remainingMs;
  }, [store.isRunning, store.targetAt, store.remainingMs, mounted, tick]);

  const [ringing, setRinging] = React.useState(false);
  const ringStopRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (!store.isRunning) return;
    if (effectiveRemaining > 0) return;

    ringStopRef.current = beep();
    setRinging(true);
    const next = { ...store, isRunning: false, targetAt: null, remainingMs: 0 };

    const key = new Date().toISOString().slice(0, 10);
    const hist = { ...(next.history || {}) };
    if (!hist[key]) hist[key] = { focusDone: 0 };

    if (store.mode === "focus") {
      hist[key].focusDone = (hist[key].focusDone || 0) + 1;
    }

    // After focus, do not auto-switch to break. Let user choose.
    if (store.mode === "focus") {
      next.mode = "focus";
      next.remainingMs = modeDurationMs.focus;
    } else {
      // If break finishes, reset to focus
      next.mode = "focus";
      next.remainingMs = modeDurationMs.focus;
    }
    next.history = hist;

    // No auto cycle: do not start next session automatically

    setStore(next);
  }, [effectiveRemaining, store, setStore, modeDurationMs.focus]);

  function start() {
    if (store.isRunning) return;
    setStore((s) => ({
      ...s,
      isRunning: true,
      targetAt: Date.now() + (s.remainingMs ?? modeDurationMs[s.mode]),
      remainingMs: s.remainingMs ?? modeDurationMs[s.mode],
    }));
  }
  function pause() {
    if (!store.isRunning) return;
    const left = Math.max(0, (store.targetAt || Date.now()) - Date.now());
    setStore((s) => ({
      ...s,
      isRunning: false,
      targetAt: null,
      remainingMs: left,
    }));
  }
  function reset(mode: PomodoroMode = store.mode) {
    setStore((s) => ({
      ...s,
      isRunning: false,
      targetAt: null,
      remainingMs: modeDurationMs[mode],
      mode,
    }));
  }
  function switchMode(mode: PomodoroMode) {
    if (mode === store.mode) return;
    reset(mode);
  }

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const label =
      store.mode === "focus"
        ? "Focus"
        : store.mode === "short"
          ? "Short Break"
          : "Long Break";
    document.title = `${formatMMSS(effectiveRemaining)} — ${label} · Simpli Pomodoro`;
  }, [store.mode, effectiveRemaining]);

  const dur = modeDurationMs[store.mode];
  const pct = 1 - effectiveRemaining / dur;
  const circleStyle = {
    width: size,
    height: size,
    background: `conic-gradient(rgba(255,255,255,0.95) ${pct * 360}deg, rgba(255,255,255,0.06) 0deg)`,
  };

  const label =
    store.mode === "focus"
      ? "Focus"
      : store.mode === "short"
        ? "Short Break"
        : "Long Break";

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simpli Pomodoro
          </h2>
          
        </div>

        <div className="flex items-center justify-center">
          <div
            className="relative rounded-full p-1"
            style={{
              background:
                "radial-gradient(400px 120px at 50% -20%, rgba(255,255,255,0.06), transparent 60%)",
            }}
          >
            <div
              className="rounded-full shadow-xl ring-1 ring-white/10"
              style={circleStyle}
            >
              <div className="absolute inset-0 m-3 rounded-full bg-neutral-950 grid place-items-center">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wide text-neutral-400">
                    {label}
                  </div>
                  <div className="text-5xl md:text-6xl font-semibold tabular-nums">
                    {formatMMSS(effectiveRemaining)}
                  </div>
                  {/* Cycle info removed */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {ringing && (
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-lg shadow-lg hover:bg-neutral-200"
              onClick={() => {
                setRinging(false);
                if (ringStopRef.current) {
                  ringStopRef.current();
                  ringStopRef.current = null;
                }
              }}
            >
              Stop Ringing
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => switchMode("focus")}
              disabled={ringing}
              className={`px-3 py-1 rounded-lg text-sm ${store.mode === "focus" ? "bg-white text-neutral-950" : "text-white/80 hover:bg-white/10"}${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              Focus
            </button>
            <button
              type="button"
              onClick={() => switchMode("short")}
              disabled={ringing}
              className={`px-3 py-1 rounded-lg text-sm ${store.mode === "short" ? "bg-white text-neutral-950" : "text-white/80 hover:bg-white/10"}${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              Short Break
            </button>
            <button
              type="button"
              onClick={() => switchMode("long")}
              disabled={ringing}
              className={`px-3 py-1 rounded-lg text-sm ${store.mode === "long" ? "bg-white text-neutral-950" : "text-white/80 hover:bg-white/10"}${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              Long Break
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {!store.isRunning ? (
            <button
              type="button"
              onClick={start}
              disabled={ringing}
              className={`px-4 py-2 rounded-xl bg-white text-neutral-950 font-medium hover:opacity-90 active:opacity-80${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              Start
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              disabled={ringing}
              className={`px-4 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={() => reset()}
            disabled={ringing}
            className={`px-3 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700${ringing ? " opacity-50 cursor-not-allowed" : ""}`}
          >
            Reset
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-neutral-400">
          © 2025 Brought to you by{' '}
          <a
            href="https://simpliprompt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
          >
            Simpli Prompt
          </a>
        </div>
      </div>
    </div>
  );
}
