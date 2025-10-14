import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  progress?: number; // Progress percentage (0-1)
}

export default function Layout({ children, progress = 0 }: LayoutProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Close modal with ESC key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
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
          <button
            type="button"
            onClick={() => setShowInfo(true)}
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

      {/* Full-Page Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] flex-shrink-0">
              <h2 className="text-xl font-semibold text-[var(--fg-accent)]">
                DeepFocus v1.0.0
              </h2>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-light)] hover:bg-[var(--border)] transition-all"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* App Info */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                  What is DeepFocus?
                </h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                  DeepFocus is a minimalist Pomodoro timer built to help you boost your productivity with focused work sessions and strategic breaks without distractions, clutter, or noise.
                </p>
              </div>

              {/* Pomodoro Technique */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                  The Pomodoro Technique
                </h3>
                <div className="text-sm text-[var(--fg-muted)] space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[var(--fg-accent)] text-[var(--bg-dark)] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <strong>Focus Session:</strong> Work for 25 minutes with complete focus on a single task
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[var(--fg-accent)] text-[var(--bg-dark)] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <strong>Short Break:</strong> Take a 5-minute break to recharge and reset
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[var(--fg-accent)] text-[var(--bg-dark)] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <strong>Long Break:</strong> After 4 sessions, take a 15-30 minute break
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[var(--fg-accent)] text-[var(--bg-dark)] rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <strong>Repeat:</strong> Continue the cycle throughout your workday
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                  Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Improved focus and concentration
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Better time management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Reduced mental fatigue
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Increased productivity
                  </div>
                </div>
              </div>

              {/* Sound notifications */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                  Sound Notifications
                </h3>
                <div className="text-sm text-[var(--fg-muted)] space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Gentle sine-wave beeps, short and pleasant
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Focus complete: 5 quick beeps
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Short break complete: 1 beep
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Long break complete: 3 quick beeps
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--fg-accent)] rounded-full"></div>
                    Auto-stops; no endless ringing
                  </div>
                </div>
              </div>


              {/* Nvixio Branding */}
              <div className="border-t border-[var(--border)] pt-4">
                <p className="text-sm text-[var(--fg-muted)]">
                  Brought to you by{" "}
                  <a
                    href="https://nvixio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--fg-light)] hover:text-[var(--fg-accent)] transition-colors font-medium"
                  >
                    Nvixio
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
