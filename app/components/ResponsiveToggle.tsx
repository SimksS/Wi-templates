"use client";

type Mode = "desktop" | "mobile";

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

export function ResponsiveToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("desktop")}
        className={[
          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
          value === "desktop"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        ].join(" ")}
        aria-label="Modo Desktop"
        aria-pressed={value === "desktop"}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Desktop</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("mobile")}
        className={[
          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
          value === "mobile"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        ].join(" ")}
        aria-label="Modo Mobile"
        aria-pressed={value === "mobile"}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Mobile</span>
      </button>
    </div>
  );
}
