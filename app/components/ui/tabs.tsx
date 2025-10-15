"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 sm:h-14 items-center justify-center rounded-lg bg-transparent p-1 text-[var(--fg-muted)] border border-[var(--border)] w-full relative",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-3.5 text-base sm:text-lg font-medium relative z-10 text-white",
      className,
    )}
    {...props}
  >
    <span className="transition-transform duration-200 ease-in-out group-data-[state=active]:scale-105 group-data-[state=inactive]:scale-100">
      {children}
    </span>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Animated Tabs with Framer Motion
const AnimatedTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    children: React.ReactNode;
  }
>(({ children, value, onValueChange, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState<string>(value || "");
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  React.useEffect(() => {
    const computeIndicator = () => {
      if (!activeTab) return;
      const activeElement = document.querySelector(
        `[data-value="${activeTab}"]`,
      ) as HTMLElement | null;
      const containerEl =
        containerRef.current ?? activeElement?.parentElement ?? null;
      if (!activeElement || !containerEl) return;
      const rect = activeElement.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      setIndicatorStyle({
        left: rect.left - containerRect.left,
        width: rect.width,
      });
    };

    // Initial compute on mount/value change
    computeIndicator();

    // Recompute on resize/orientation change
    if (typeof window !== "undefined") {
      const onResize = () => {
        // use rAF to wait for layout to settle (fonts/responsive text)
        requestAnimationFrame(computeIndicator);
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      // Observe container size changes
      const ro = new ResizeObserver(() => onResize());
      if (containerRef.current) ro.observe(containerRef.current);

      // Also observe active element (text size may change across breakpoints)
      const activeElement = document.querySelector(
        `[data-value="${activeTab}"]`,
      ) as HTMLElement | null;
      if (activeElement) ro.observe(activeElement);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        ro.disconnect();
      };
    }
  }, [activeTab]);

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={activeTab}
      onValueChange={handleValueChange}
      {...props}
    >
      <div ref={containerRef} className="relative">
        {children}
        {activeTab && (
          <motion.div
            className="absolute top-1 bottom-1 bg-[var(--purple-button)] rounded-md z-0"
            style={indicatorStyle}
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </TabsPrimitive.Root>
  );
});
AnimatedTabs.displayName = "AnimatedTabs";

export { Tabs, TabsList, TabsTrigger, TabsContent, AnimatedTabs };
