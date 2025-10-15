"use client";
import React from "react";
import { Button } from "@/app/components/ui/button";
import type { DeepFocusProps, PomodoroMode, PomodoroStore } from "@/data/types";
import { beep, formatMMSS, useLocalStorage, useNowTick } from "@/lib/utils";
import Layout from "./Layout";
import Toolbar from "./ui/Toolbar";

export function DeepFocus({
  focusMinutes = 25, // 25 minutes
  shortMinutes = 5, // 5 minutes
  longMinutes = 15, // 15 minutes
}: DeepFocusProps) {
  const [store, setStore] = useLocalStorage<PomodoroStore>(
    "deepFocusPomodoro",
    React.useMemo(
      () => ({
        mode: "focus",
        isRunning: false,
        targetAt: null,
        remainingMs: focusMinutes * 60 * 1000,
        history: {},
      }),
      [focusMinutes],
    ),
  );

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

  // Track whether localStorage has been loaded to prevent mode flashing
  const [localStorageLoaded, setLocalStorageLoaded] = React.useState(false);
  React.useEffect(() => {
    // Check if we have saved data in localStorage
    try {
      const saved = window.localStorage.getItem("deepFocusPomodoro");
      if (saved) {
        setLocalStorageLoaded(true);
      } else {
        setLocalStorageLoaded(true); // No saved data, we're ready
      }
    } catch {
      setLocalStorageLoaded(true);
    }
  }, []);

  // Only tick while running and after we've mounted (client-side). The
  // returned `tick` forces re-evaluation of Date.now()-based calculations
  // (see `effectiveRemaining` below).
  const tick = useNowTick(store.isRunning && mounted, 100);

  const effectiveRemaining = React.useMemo(() => {
    // Reference tick to satisfy linter and ensure recomputation on each tick
    void tick;
    if (store.isRunning && store.targetAt && mounted) {
      const remaining = Math.max(0, store.targetAt - Date.now());
      // Ensure we never go below 0 or above the mode duration
      const maxDuration = modeDurationMs[store.mode];
      return Math.min(Math.max(0, remaining), maxDuration);
    }
    return Math.max(0, store.remainingMs);
  }, [
    store.isRunning,
    store.targetAt,
    store.remainingMs,
    mounted,
    store.mode,
    modeDurationMs,
    tick,
  ]);

  React.useEffect(() => {
    if (!store.isRunning) return;
    if (effectiveRemaining > 0) return;

    beep(store.mode);
    const next = { ...store, isRunning: false, targetAt: null, remainingMs: 0 };

    const todayKey = new Date().toISOString().slice(0, 10);
    const hist = { ...(next.history || {}) };
    if (!hist[todayKey]) hist[todayKey] = { focusDone: 0 };

    if (store.mode === "focus") {
      hist[todayKey].focusDone = (hist[todayKey].focusDone || 0) + 1;
    }

    // After focus, do not auto-switch to break. Let user choose.
    if (store.mode === "focus") {
      next.mode = "focus";
      next.remainingMs = modeDurationMs.focus;
    } else {
      // If break finishes, automatically switch to Deep Focus
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
    // Ensure remaining time is valid
    const validRemaining = Math.max(
      0,
      Math.min(left, modeDurationMs[store.mode]),
    );
    setStore((s) => ({
      ...s,
      isRunning: false,
      targetAt: null,
      remainingMs: validRemaining,
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
    if (mode === store.mode) {
      if (store.isRunning) {
        reset(mode);
      }
      return;
    }
    reset(mode);
  }

  const { mode, isRunning } = store;

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const _label =
      mode === "focus"
        ? "Focus"
        : mode === "short"
          ? "Short Break"
          : "Long Break";
    const status = isRunning ? "" : " (Paused)";
    document.title = `${formatMMSS(effectiveRemaining)} — ${_label}${status} · DeepFocus`;
  }, [mode, effectiveRemaining, isRunning]);

  const dur = modeDurationMs[store.mode];
  const pct = 1 - effectiveRemaining / dur;

  return (
    <Layout progress={pct}>
      <div className="flex-1 flex flex-col">
        {/* Main Timer Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-lg space-y-6">
            {/* Toolbar - Mode Selection */}
            {localStorageLoaded && (
              <Toolbar mode={store.mode} onModeChange={switchMode} />
            )}

            {/* Timer Display Card */}
            <div className="bg-transparent border border-[var(--border)] rounded-2xl p-8 sm:p-12">
              <div className="text-center">
                <div className="text-6xl sm:text-7xl md:text-8xl font-bold tabular-nums text-[var(--fg-accent)] tracking-tight">
                  {formatMMSS(effectiveRemaining)}
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            {!store.isRunning ? (
              <Button
                onClick={start}
                className="w-full text-base sm:text-lg uppercase shadow-lg"
                size="lg"
              >
                Start
              </Button>
            ) : (
              <Button
                onClick={pause}
                className="w-full text-base sm:text-lg uppercase shadow-lg"
                size="lg"
              >
                Pause
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
