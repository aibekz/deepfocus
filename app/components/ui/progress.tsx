import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded bg-[var(--bg-card)]",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      {...props}
    >
      <motion.div
        className="h-full w-full flex-1 bg-[var(--purple-button)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: Math.max(0, Math.min(1, value / 100)) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  ),
);
Progress.displayName = "Progress";

export { Progress };
