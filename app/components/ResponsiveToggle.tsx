"use client";

type Mode = "desktop" | "mobile";

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

export function ResponsiveToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-xl border border-black/10 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("desktop")}
        className={[
          "rounded-lg px-3 py-1.5 transition-colors",
          value === "desktop"
            ? "bg-black text-white"
            : "text-zinc-700 hover:bg-black/5",
        ].join(" ")}
      >
        Desktop
      </button>
      <button
        type="button"
        onClick={() => onChange("mobile")}
        className={[
          "rounded-lg px-3 py-1.5 transition-colors",
          value === "mobile"
            ? "bg-black text-white"
            : "text-zinc-700 hover:bg-black/5",
        ].join(" ")}
      >
        Mobile
      </button>
    </div>
  );
}

