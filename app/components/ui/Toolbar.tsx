interface ToolbarProps {
  mode: "focus" | "short" | "long";
  onModeChange: (mode: "focus" | "short" | "long") => void;
}

function Toolbar({ mode, onModeChange }: ToolbarProps) {
  const modes = [
    { key: "focus" as const, label: "Deep Focus" },
    { key: "short" as const, label: "Short Break" },
    { key: "long" as const, label: "Long Break" },
  ];

  return (
    <div className="flex w-full gap-6">
      {modes.map((modeOption) => (
        <button
          key={modeOption.key}
          type="button"
          onClick={() => onModeChange(modeOption.key)}
          className={`flex-1 px-2 py-3 sm:px-4 sm:py-3 text-sm sm:text-base font-sans transition-all duration-200 rounded-lg ${
            mode === modeOption.key
              ? "bg-[var(--fg-accent)] text-[var(--bg-dark)]"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--border-light)] hover:text-[var(--fg-light)]"
          }`}
        >
          {modeOption.label}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
