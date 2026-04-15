"use client";

import { useMemo, useState } from "react";

import { PreviewFrame } from "../../components/PreviewFrame";
import { ResponsiveToggle } from "../../components/ResponsiveToggle";
import type { RenderedTemplate } from "../../lib/templates/types";

type TabKey = "preview" | "html" | "css";
type Mode = "desktop" | "mobile";

type Props = {
  preview: { rendered: RenderedTemplate; title: string };
  htmlPanel: React.ReactNode;
  cssPanel?: React.ReactNode;
  enablePreviewModal?: boolean;
};

export function BuilderTabs({ preview, htmlPanel, cssPanel, enablePreviewModal }: Props) {
  const [tab, setTab] = useState<TabKey>("preview");
  const [mode, setMode] = useState<Mode>("desktop");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const frameWidth = useMemo(() => {
    if (mode === "mobile") return 390;
    return "full" as const;
  }, [mode]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "preview",
      label: "Preview",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      key: "html",
      label: "HTML",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    ...(cssPanel ? [{
      key: "css" as TabKey,
      label: "CSS",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    }] : []),
  ];

  return (
    <div className="flex h-full min-h-[600px] flex-col gap-4">
      {/* Tabs Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={[
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              ].join(" ")}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" && (
          <div className="flex items-center gap-2">
            {enablePreviewModal && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-press inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="hidden sm:inline">Expandir</span>
              </button>
            )}
            <ResponsiveToggle value={mode} onChange={setMode} />
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-0 flex-1">
        {tab === "preview" ? (
          <div className="flex h-full min-h-[520px] flex-col rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {mode === "mobile" ? "Mobile (390px)" : "Desktop (100%)"}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto scrollbar-subtle">
              <div
                className={[
                  "mx-auto transition-all duration-300",
                  mode === "mobile" ? "w-[390px]" : "w-full",
                ].join(" ")}
              >
                <PreviewFrame
                  rendered={preview.rendered}
                  title={preview.title}
                  width={frameWidth}
                  height={460}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        ) : tab === "html" ? (
          htmlPanel
        ) : (
          cssPanel
        )}
      </div>

      {/* Preview Modal */}
      {enablePreviewModal && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Preview em tela cheia</h3>
                  <p className="text-xs text-muted-foreground">Visualize como ficará em diferentes dispositivos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ResponsiveToggle value={mode} onChange={setMode} />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-press inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Fechar
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-5 scrollbar-subtle">
              <div
                className={[
                  "mx-auto transition-all duration-300",
                  mode === "mobile" ? "w-[390px]" : "w-full max-w-4xl",
                ].join(" ")}
              >
                <PreviewFrame
                  rendered={preview.rendered}
                  title={preview.title}
                  width={frameWidth}
                  height={800}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
