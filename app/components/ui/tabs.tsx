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

const AnimatedTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    children: React.ReactNode;
  }
>(({ children, value, onValueChange, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getIndicatorStyle = (val: string) => {
    if (val === "focus") {
      return { left: "4px", width: "calc(33.333% - 8px)" };
    } else if (val === "short") {
      return { left: "33.333%", width: "calc(33.333% - 8px)" };
    } else if (val === "long") {
      return { left: "66.666%", width: "calc(33.333% - 8px)" };
    }
    return { left: "4px", width: "calc(33.333% - 8px)" };
  };

  const indicatorStyle = getIndicatorStyle(value || "focus");

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <div className="relative">
        {children}
        {value && mounted && (
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
        {value && !mounted && (
          <div
            className="absolute top-1 bottom-1 bg-[var(--purple-button)] rounded-md z-0"
            style={indicatorStyle}
          />
        )}
      </div>
    </TabsPrimitive.Root>
  );
});
AnimatedTabs.displayName = "AnimatedTabs";

export { Tabs, TabsList, TabsTrigger, TabsContent, AnimatedTabs };
