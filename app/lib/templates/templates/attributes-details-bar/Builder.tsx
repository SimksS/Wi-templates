"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../../../components/CodePanel";
import { BuilderTabs } from "../../../../builder/[templateId]/tabs";
import { toSnippet } from "../../toSnippet";
import { getExample, render } from "./definition";
import type { AttributesDetailsBarData } from "./types";

type Props = { templateName: string };

export function AttributesDetailsBarBuilder({ templateName }: Props) {
  const [data, setData] = useState<AttributesDetailsBarData>(() => getExample());

  const [attributeIds, setAttributeIds] = useState<string[]>(() =>
    getExample().attributes.map(() => crypto.randomUUID())
  );
  const [detailIds, setDetailIds] = useState<string[]>(() =>
    getExample().detailsItems.map(() => crypto.randomUUID())
  );

  const invalidIconIndexes = useMemo(() => {
    return new Set(
      data.attributes
        .map((a, idx) => ({ a, idx }))
        .filter(({ a }) => isDisallowedImageUrl(a.iconUrl))
        .map(({ idx }) => idx)
    );
  }, [data.attributes]);

  const safeData = useMemo(() => {
    const placeholder = getExample().attributes[0]?.iconUrl ?? "";
    return {
      ...data,
      attributes: data.attributes.map((a, idx) =>
        invalidIconIndexes.has(idx) ? { ...a, iconUrl: placeholder } : a
      ),
    };
  }, [data, invalidIconIndexes]);

  const renderedTemplate = useMemo(() => render(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">Configuração</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Atributos (esquerda) + lista de details (direita).
          </p>
        </div>

        <div className="mt-5">
          <SectionHeader
            title={`Atributos (${data.attributes.length})`}
            onAdd={() => {
              setData((d) => ({
                ...d,
                attributes: [...d.attributes, { iconUrl: "", label: "Novo atributo" }],
              }));
              setAttributeIds((ids) => [...ids, crypto.randomUUID()]);
            }}
          />

          <div className="mt-3 flex flex-col gap-3">
            {data.attributes.map((attr, idx) => (
              <div
                key={attributeIds[idx] ?? `${idx}`}
                className="rounded-2xl border border-black/10 bg-white p-3"
              >
                <ItemActions
                  label={`Atributo ${idx + 1}`}
                  idx={idx}
                  total={data.attributes.length}
                  onUp={() => {
                    setData((d) => ({
                      ...d,
                      attributes: move(d.attributes, idx, idx - 1),
                    }));
                    setAttributeIds((ids) => move(ids, idx, idx - 1));
                  }}
                  onDown={() => {
                    setData((d) => ({
                      ...d,
                      attributes: move(d.attributes, idx, idx + 1),
                    }));
                    setAttributeIds((ids) => move(ids, idx, idx + 1));
                  }}
                  onRemove={() => {
                    setData((d) => ({
                      ...d,
                      attributes: d.attributes.filter((_, i) => i !== idx),
                    }));
                    setAttributeIds((ids) => ids.filter((_, i) => i !== idx));
                  }}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-700">
                      URL do ícone (imagem)
                    </span>
                    <input
                      type="url"
                      value={attr.iconUrl}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          attributes: d.attributes.map((a, i) =>
                            i === idx ? { ...a, iconUrl: e.target.value } : a
                          ),
                        }))
                      }
                      placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
                      className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                    />
                    {invalidIconIndexes.has(idx) ? (
                      <span className="text-[11px] font-medium text-red-700">
                        Use uma URL de imagem (png/jpg/jpeg/webp/gif/avif). SVG não
                        é aceito.
                      </span>
                    ) : null}
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-700">Texto</span>
                    <input
                      type="text"
                      value={attr.label}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          attributes: d.attributes.map((a, i) =>
                            i === idx ? { ...a, label: e.target.value } : a
                          ),
                        }))
                      }
                      className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <SectionHeader
            title={`Details (${data.detailsItems.length})`}
            onAdd={() => {
              setData((d) => ({
                ...d,
                detailsItems: [
                  ...d.detailsItems,
                  { title: "Novo título", description: "Nova descrição" },
                ],
              }));
              setDetailIds((ids) => [...ids, crypto.randomUUID()]);
            }}
          />

          <div className="mt-3 flex flex-col gap-3">
            {data.detailsItems.map((it, idx) => (
              <div
                key={detailIds[idx] ?? `${idx}`}
                className="rounded-2xl border border-black/10 bg-white p-3"
              >
                <ItemActions
                  label={`Item ${idx + 1}`}
                  idx={idx}
                  total={data.detailsItems.length}
                  onUp={() => {
                    setData((d) => ({
                      ...d,
                      detailsItems: move(d.detailsItems, idx, idx - 1),
                    }));
                    setDetailIds((ids) => move(ids, idx, idx - 1));
                  }}
                  onDown={() => {
                    setData((d) => ({
                      ...d,
                      detailsItems: move(d.detailsItems, idx, idx + 1),
                    }));
                    setDetailIds((ids) => move(ids, idx, idx + 1));
                  }}
                  onRemove={() => {
                    setData((d) => ({
                      ...d,
                      detailsItems: d.detailsItems.filter((_, i) => i !== idx),
                    }));
                    setDetailIds((ids) => ids.filter((_, i) => i !== idx));
                  }}
                />

                <div className="grid grid-cols-1 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-700">Título</span>
                    <input
                      type="text"
                      value={it.title}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          detailsItems: d.detailsItems.map((x, i) =>
                            i === idx ? { ...x, title: e.target.value } : x
                          ),
                        }))
                      }
                      className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-700">Descrição</span>
                    <textarea
                      value={it.description}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          detailsItems: d.detailsItems.map((x, i) =>
                            i === idx ? { ...x, description: e.target.value } : x
                          ),
                        }))
                      }
                      className="min-h-24 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-[520px] flex-col gap-3">
        <BuilderTabs
          preview={{ rendered: renderedTemplate, title: `Preview: ${templateName}` }}
          enablePreviewModal
          htmlPanel={
            <CodePanel
              title="HTML — cole no seu site"
              code={snippet.html}
              copyLabel="Copiar HTML"
            />
          }
          cssPanel={
            <CodePanel
              title="CSS — adicione ao seu <style> ou stylesheet"
              code={snippet.css}
              copyLabel="Copiar CSS"
            />
          }
        />
      </section>
    </div>
  );
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-semibold text-zinc-700">{title}</div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
      >
        + Adicionar
      </button>
    </div>
  );
}

function ItemActions({
  label,
  idx,
  total,
  onUp,
  onDown,
  onRemove,
}: {
  label: string;
  idx: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <div className="text-xs font-semibold text-zinc-700">{label}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUp}
          disabled={idx === 0}
          className={[
            "rounded-lg px-2 py-1 text-xs font-semibold",
            idx === 0
              ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          ].join(" ")}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onDown}
          disabled={idx === total - 1}
          className={[
            "rounded-lg px-2 py-1 text-xs font-semibold",
            idx === total - 1
              ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          ].join(" ")}
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          Remover
        </button>
      </div>
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function isDisallowedImageUrl(url: string) {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.startsWith("data:image/svg+xml")) return true;
  if (u.endsWith(".svg")) return true;
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
  return !allowed.some((ext) => u.includes(ext));
}

