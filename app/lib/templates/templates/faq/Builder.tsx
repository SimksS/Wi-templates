"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../../../components/CodePanel";
import { BuilderTabs } from "../../../../builder/[templateId]/tabs";
import { toSnippet } from "../../toSnippet";
import { getExample, render } from "./definition";
import type { FaqData, FaqItem } from "./types";

type Props = {
  templateName: string;
};

export function FaqBuilder({ templateName }: Props) {
  const [data, setData] = useState<FaqData>(() => getExample());
  const [itemIds, setItemIds] = useState<string[]>(() =>
    getExample().items.map(() => crypto.randomUUID())
  );

  const safeData = useMemo(
    () => ({
      ...data,
      title: data.title.trim() || "FAQ",
      items: data.items.length
        ? data.items
        : [{ question: "Nova pergunta", answer: "Nova resposta" }],
    }),
    [data]
  );

  const renderedTemplate = useMemo(() => render(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">FAQ</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Altere o titulo e cadastre quantas perguntas e respostas quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Titulo</div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-zinc-50 p-3">
            <span className="text-xs font-semibold text-zinc-700">
              Abrir primeiro item de cada coluna
            </span>
            <input
              type="checkbox"
              checked={data.openFirstItems}
              onChange={(e) =>
                setData((d) => ({ ...d, openFirstItems: e.target.checked }))
              }
              className="h-4 w-4"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-zinc-700">
            Perguntas ({data.items.length})
          </div>
          <button
            type="button"
            onClick={() => {
              setData((d) => ({
                ...d,
                items: [
                  ...d.items,
                  { question: "Nova pergunta", answer: "Nova resposta" },
                ],
              }));
              setItemIds((ids) => [...ids, crypto.randomUUID()]);
            }}
            className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            + Adicionar
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {data.items.map((item, idx) => (
            <div
              key={itemIds[idx] ?? `${idx}`}
              className="rounded-2xl border border-black/10 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-zinc-700">
                  Pergunta {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setData((d) => ({ ...d, items: move(d.items, idx, idx - 1) }));
                      setItemIds((ids) => move(ids, idx, idx - 1));
                    }}
                    disabled={idx === 0}
                    className={[
                      "rounded-lg px-2 py-1 text-xs font-semibold",
                      idx === 0
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                    ].join(" ")}
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((d) => ({ ...d, items: move(d.items, idx, idx + 1) }));
                      setItemIds((ids) => move(ids, idx, idx + 1));
                    }}
                    disabled={idx === data.items.length - 1}
                    className={[
                      "rounded-lg px-2 py-1 text-xs font-semibold",
                      idx === data.items.length - 1
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                    ].join(" ")}
                  >
                    Descer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((d) => ({
                        ...d,
                        items: d.items.filter((_, i) => i !== idx),
                      }));
                      setItemIds((ids) => ids.filter((_, i) => i !== idx));
                    }}
                    className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-700">
                    Pergunta
                  </span>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      updateItem(setData, idx, { question: e.target.value })
                    }
                    className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-700">
                    Resposta
                  </span>
                  <textarea
                    value={item.answer}
                    onChange={(e) =>
                      updateItem(setData, idx, { answer: e.target.value })
                    }
                    rows={3}
                    className="resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-[520px] flex-col gap-3">
        <BuilderTabs
          preview={{ rendered: renderedTemplate, title: `Preview: ${templateName}` }}
          enablePreviewModal
          htmlPanel={
            <CodePanel
              title="HTML - cole no seu site"
              code={snippet.html}
              copyLabel="Copiar HTML"
            />
          }
          cssPanel={
            <CodePanel
              title="CSS - adicione ao seu <style> ou stylesheet"
              code={snippet.css}
              copyLabel="Copiar CSS"
            />
          }
        />
      </section>
    </div>
  );
}

function updateItem(
  setData: React.Dispatch<React.SetStateAction<FaqData>>,
  idx: number,
  patch: Partial<FaqItem>
) {
  setData((d) => ({
    ...d,
    items: d.items.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
  }));
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}
