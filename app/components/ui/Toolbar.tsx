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
  return (
    <AnimatedTabs
      value={mode}
      onValueChange={(v) => onModeChange(v as ToolbarProps["mode"])}
    >
      <TabsList>
        <TabsTrigger value="focus" data-value="focus">
          Deep Focus
        </TabsTrigger>
        <TabsTrigger value="short" data-value="short">
          Short Break
        </TabsTrigger>
        <TabsTrigger value="long" data-value="long">
          Long Break
        </TabsTrigger>
      </TabsList>
      {/* content panes are not used; just triggers as toolbar */}
      <TabsContent value="focus" />
      <TabsContent value="short" />
      <TabsContent value="long" />
    </AnimatedTabs>
  );
}

export default Toolbar;
