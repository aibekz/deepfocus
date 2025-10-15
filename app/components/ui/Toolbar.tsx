"use client";
import {
  AnimatedTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

interface ToolbarProps {
  mode: "focus" | "short" | "long";
  onModeChange: (mode: "focus" | "short" | "long") => void;
}

function Toolbar({ mode, onModeChange }: ToolbarProps) {
  const handleTriggerClick = (value: string) => {
    // Always call onModeChange, even if it's the same value
    onModeChange(value as ToolbarProps["mode"]);
  };

  return (
    <AnimatedTabs
      value={mode}
      onValueChange={(v) => onModeChange(v as ToolbarProps["mode"])}
    >
      <TabsList>
        <TabsTrigger 
          value="focus" 
          data-value="focus"
          onClick={() => handleTriggerClick("focus")}
        >
          Deep Focus
        </TabsTrigger>
        <TabsTrigger 
          value="short" 
          data-value="short"
          onClick={() => handleTriggerClick("short")}
        >
          Short Break
        </TabsTrigger>
        <TabsTrigger 
          value="long" 
          data-value="long"
          onClick={() => handleTriggerClick("long")}
        >
          Long Break
        </TabsTrigger>
      </TabsList>
      <TabsContent value="focus" />
      <TabsContent value="short" />
      <TabsContent value="long" />
    </AnimatedTabs>
  );
}

export default Toolbar;
