"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  code: string;
  copyLabel?: string;
};

export function CodePanel({ title, code, copyLabel = "Copiar" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [isHovered, setIsHovered] = useState(false);

  const canCopy = useMemo(() => code.trim().length > 0, [code]);

  async function handleCopy() {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  // Visual indicator for code length
  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div
      className="flex h-full min-h-[400px] flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {lineCount} linhas · {charCount.toLocaleString()} chars
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!canCopy}
          className={[
            "btn-press inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
            status === "copied"
              ? "bg-emerald-500 text-white"
              : status === "error"
              ? "bg-destructive text-destructive-foreground"
              : canCopy
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "cursor-not-allowed bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {status === "copied" ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copiado!
            </>
          ) : status === "error" ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Erro
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copyLabel}
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative min-h-0 flex-1 bg-muted/30">
        <pre className="h-full overflow-auto p-4 text-xs leading-relaxed scrollbar-subtle">
          <code className="block font-mono text-foreground/90 whitespace-pre">
            {code || "// Nenhum código gerado ainda"}
          </code>
        </pre>

        {/* Empty state overlay */}
        {status === "error" && (
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 animate-fade-in-up">
            <div className="flex items-center gap-2 text-xs text-destructive">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Não foi possível copiar automaticamente. Selecione e copie manualmente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
