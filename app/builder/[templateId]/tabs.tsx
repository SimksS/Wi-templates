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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "preview", label: "Preview" },
    { key: "html", label: "HTML" },
    ...(cssPanel ? [{ key: "css" as TabKey, label: "CSS" }] : []),
  ];

  return (
    <div className="flex h-full min-h-[520px] flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-xl border border-black/10 bg-white p-1 text-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={[
                "rounded-lg px-3 py-1.5 font-semibold transition-colors",
                tab === t.key
                  ? "bg-black text-white"
                  : "text-zinc-700 hover:bg-black/5",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" ? (
          <div className="flex items-center gap-2">
            {enablePreviewModal ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Abrir preview
              </button>
            ) : null}
            <ResponsiveToggle value={mode} onChange={setMode} />
          </div>
        ) : null}
      </div>

      {tab === "preview" ? (
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-zinc-900">Preview</div>
            <div className="text-xs text-zinc-600">
              {mode === "mobile" ? "Mobile (390px)" : "Desktop"}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <div
              className={[
                "mx-auto",
                mode === "mobile" ? "w-[390px]" : "w-full",
              ].join(" ")}
            >
              <PreviewFrame
                rendered={preview.rendered}
                title={preview.title}
                width={frameWidth}
                height={420}
              />
            </div>
          </div>
        </div>
      ) : tab === "html" ? (
        htmlPanel
      ) : (
        cssPanel
      )}

      {enablePreviewModal && isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-900">
                Preview (tela cheia)
              </div>
              <div className="flex items-center gap-2">
                <ResponsiveToggle value={mode} onChange={setMode} />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              <div
                className={[
                  "mx-auto",
                  mode === "mobile" ? "w-[390px]" : "w-full",
                ].join(" ")}
              >
                <PreviewFrame
                  rendered={preview.rendered}
                  title={preview.title}
                  width={frameWidth}
                  height={900}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
