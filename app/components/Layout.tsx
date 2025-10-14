import { useEffect, useRef, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  progress?: number; // Progress percentage (0-1)
}

export default function Layout({ children, progress = 0 }: LayoutProps) {
  const [showInfo, setShowInfo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);
  return (
    <div className="h-screen bg-[var(--bg-dark)] text-[var(--fg-light)] font-sans flex flex-col">
      {/* SEO Heading - Hidden but accessible to screen readers */}
      <h1 className="sr-only">DeepFocus - Pomodoro Timer</h1>

      {/* Header with Progress Bar */}
      <header className="relative">
        <div className="flex flex-row justify-between items-center p-3 sm:p-4 gap-2 sm:gap-4">
          <div className="text-sm sm:text-base text-[var(--fg-muted)]">
            DeepFocus v1.0.0
          </div>

          {/* Info Icon */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-light)] hover:bg-[var(--border)] transition-all"
              aria-label="App Information"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Information</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Info Dropdown */}
            {showInfo && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  {/* App Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg-accent)] mb-2">
                      About DeepFocus
                    </h3>
                    <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                      A modern Pomodoro timer designed to boost your
                      productivity with focused work sessions and strategic
                      breaks.
                    </p>
                  </div>

                  {/* Pomodoro Technique */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg-accent)] mb-2">
                      The Pomodoro Technique
                    </h3>
                    <div className="text-xs text-[var(--fg-muted)] space-y-2">
                      <p>
                        <strong>1. Focus Session:</strong> Work for 25 minutes
                        with complete focus
                      </p>
                      <p>
                        <strong>2. Short Break:</strong> Take a 5-minute break
                        to recharge
                      </p>
                      <p>
                        <strong>3. Long Break:</strong> After 4 sessions, take a
                        15-30 minute break
                      </p>
                      <p>
                        <strong>4. Repeat:</strong> Continue the cycle
                        throughout your workday
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg-accent)] mb-2">
                      Benefits
                    </h3>
                    <ul className="text-xs text-[var(--fg-muted)] space-y-1">
                      <li>• Improved focus and concentration</li>
                      <li>• Better time management</li>
                      <li>• Reduced mental fatigue</li>
                      <li>• Increased productivity</li>
                    </ul>
                  </div>

                  {/* Sound notifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg-accent)] mb-2">
                      Sound notifications
                    </h3>
                    <ul className="text-xs text-[var(--fg-muted)] space-y-1">
                      <li>• Gentle sine-wave beeps, short and pleasant</li>
                      <li>• Focus complete: 5 quick beeps</li>
                      <li>• Short break complete: 1 beep</li>
                      <li>• Long break complete: 3 quick beeps</li>
                      <li>• Auto-stops; no endless ringing</li>
                    </ul>
                  </div>

                  {/* Nvixio Branding */}
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-xs text-[var(--fg-muted)]">
                      Brought to you by{" "}
                      <a
                        href="https://nvixio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--fg-light)] hover:text-[var(--fg-accent)] transition-colors"
                      >
                        Nvixio
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-card)]">
          <div
            className="h-full bg-[var(--fg-accent)] transition-all duration-300 ease-out"
            style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">{children}</div>

      {/* Footer */}
      <footer>
        <div className="text-center text-xs text-[var(--fg-muted)] py-2">
          © 2025 DeepFocus from{" "}
          <a
            href="https://nvixio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--fg-light)] hover:opacity-80 transition-opacity"
          >
            Nvixio
          </a>
        </div>
      </footer>
    </div>
  );
}
