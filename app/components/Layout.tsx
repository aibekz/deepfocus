import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Progress } from "@/app/components/ui/progress";

interface LayoutProps {
  children: React.ReactNode;
  progress?: number; // Progress percentage (0-1)
  isRunning?: boolean; // Whether timer is currently running
}

export default function Layout({ children, progress = 0, isRunning = false }: LayoutProps) {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "Timer is running. Changes you made may not be saved. Are you sure you want to leave?";
        return "Timer is running. Changes you made may not be saved. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    const handlePageHide = (e: PageTransitionEvent) => {
      if (isRunning) {
        e.preventDefault();
        return "Timer is running. Changes you made may not be saved. Are you sure you want to leave?";
      }
    };
    
    window.addEventListener("pagehide", handlePageHide);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isRunning]);

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

      {/* Header */}
      <header className="relative">
        <div className="flex flex-row justify-between items-center p-3 sm:p-4 gap-2 sm:gap-4">
          <div className="text-sm sm:text-base text-[var(--fg-muted)]">
            DeepFocus v1.0.0
          </div>

          {/* Info Dialog */}
          <Dialog open={showInfo} onOpenChange={setShowInfo}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-light)] hover:bg-[var(--border)] transition-all"
                aria-label="App Information"
              >
                <Info className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogCloseButton />
              <DialogHeader>
                <DialogClose asChild>
                  <DialogTitle className="text-[var(--fg-accent)] cursor-pointer hover:opacity-80 transition-opacity">
                    DeepFocus v1.0.0
                  </DialogTitle>
                </DialogClose>
                <DialogDescription>
                  Minimalist Pomodoro timer to boost your productivity.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {/* App Info */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                    What is DeepFocus?
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                    DeepFocus is a minimalist Pomodoro timer built to help you
                    boost your productivity with focused work sessions and
                    strategic breaks without distractions, clutter, or noise.
                  </p>
                </div>

                {/* Pomodoro Technique */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fg-accent)] mb-3">
                    The Pomodoro Technique
                  </h3>
                  <div className="text-sm text-[var(--fg-muted)] space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--purple-button)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <div>
                        <strong>Focus Session:</strong> Work for 25 minutes with
                        complete focus on a single task
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--purple-button)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <div>
                        <strong>Short Break:</strong> Take a 5-minute break to
                        recharge and reset
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--purple-button)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <div>
                        <strong>Long Break:</strong> After 4 sessions, take a
                        15-30 minute break
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--purple-button)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <div>
                        <strong>Repeat:</strong> Continue the cycle throughout
                        your workday
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
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Improved focus and concentration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Better time management
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Reduced mental fatigue
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
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
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Gentle sine-wave beeps, short and pleasant
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Focus complete: 5 quick beeps
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Short break complete: 1 beep
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Long break complete: 3 quick beeps
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--purple-button)] rounded-full"></div>
                      Auto-stops; no endless ringing
                    </div>
                  </div>
                </div>

                {/* Nvix I/O Branding */}
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--fg-muted)]">
                    Brought to you by{" "}
                    <a
                      href="https://nvix.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--fg-light)] hover:text-[var(--fg-accent)] transition-colors font-medium"
                    >
                      Nvix I/O
                    </a>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Progress Bar - Independent from header */}
      <div className="w-full">
        <Progress value={Math.max(0, Math.min(100, (progress || 0) * 100))} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">{children}</div>

      {/* Footer */}
      <footer>
        <div className="text-center text-xs text-[var(--fg-muted)] py-2">
          © 2025 DeepFocus from{" "}
          <a
            href="https://nvix.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--fg-light)] hover:opacity-80 transition-opacity"
          >
            Nvix I/O
          </a>
        </div>
      </footer>

      {/* Dialog content is handled above via Radix dialog */}
    </div>
  );
}
