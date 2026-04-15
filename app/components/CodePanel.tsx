"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  code: string;
  copyLabel?: string;
};

export function CodePanel({ title, code, copyLabel = "Copiar" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const canCopy = useMemo(() => code.trim().length > 0, [code]);

  async function handleCopy() {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-900">
          {title}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canCopy}
          className={[
            "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
            canCopy
              ? "bg-black text-white hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-200 text-zinc-500",
          ].join(" ")}
        >
          {status === "copied"
            ? "Copiado!"
            : status === "error"
              ? "Falhou"
              : copyLabel}
        </button>
      </div>

      <pre className="min-h-0 flex-1 overflow-auto rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-800">
        <code>{code}</code>
      </pre>

      {status === "error" ? (
        <p className="mt-3 text-xs text-zinc-600">
          Não foi possível copiar automaticamente. Selecione e copie manualmente.
        </p>
      ) : null}
    </div>
  );
}

