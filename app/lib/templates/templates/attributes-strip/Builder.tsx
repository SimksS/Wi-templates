"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../../../components/CodePanel";
import { BuilderTabs } from "../../../../builder/[templateId]/tabs";
import { toSnippet } from "../../toSnippet";
import { getExample, render } from "./definition";
import type { AttributesStripData } from "./types";

type Props = {
  templateName: string;
};

export function AttributesStripBuilder({ templateName }: Props) {
  const [data, setData] = useState<AttributesStripData>(() => getExample());

  const [attributeIds, setAttributeIds] = useState<string[]>(() =>
    getExample().attributes.map(() => crypto.randomUUID())
  );

  const invalidIconIndexes = useMemo(() => {
    return new Set(
      data.attributes
        .map((a, idx) => ({ a, idx }))
        .filter(({ a }) => isDisallowedIconUrl(a.iconUrl))
        .map(({ idx }) => idx)
    );
  }, [data.attributes]);

  const rendered = useMemo(
    () => ({
      ...data,
      attributes: data.attributes.map((a, idx) => {
        if (!invalidIconIndexes.has(idx)) return a;
        return { ...a, iconUrl: getExample().attributes[0]?.iconUrl ?? "" };
      }),
    }),
    [data, invalidIconIndexes]
  );

  const renderedTemplate = useMemo(() => render(rendered), [rendered]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">Atributos</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Adicione, remova ou reordene. Informe a URL do ícone e o texto.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-zinc-700">
            Itens ({data.attributes.length})
          </div>
          <button
            type="button"
            onClick={() =>
              (setData((d) => ({
                ...d,
                attributes: [...d.attributes, { iconUrl: "", label: "Novo atributo" }],
              })),
              setAttributeIds((ids) => [...ids, crypto.randomUUID()]))
            }
            className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            + Adicionar
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {data.attributes.map((attr, idx) => (
            <div
              key={attributeIds[idx] ?? `${idx}`}
              className="rounded-2xl border border-black/10 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-zinc-700">
                  Atributo {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      (setData((d) => ({
                        ...d,
                        attributes: move(d.attributes, idx, idx - 1),
                      })),
                      setAttributeIds((ids) => move(ids, idx, idx - 1)))
                    }
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
                    onClick={() =>
                      (setData((d) => ({
                        ...d,
                        attributes: move(d.attributes, idx, idx + 1),
                      })),
                      setAttributeIds((ids) => move(ids, idx, idx + 1)))
                    }
                    disabled={idx === data.attributes.length - 1}
                    className={[
                      "rounded-lg px-2 py-1 text-xs font-semibold",
                      idx === data.attributes.length - 1
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                    ].join(" ")}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      (setData((d) => ({
                        ...d,
                        attributes: d.attributes.filter((_, i) => i !== idx),
                      })),
                      setAttributeIds((ids) => ids.filter((_, i) => i !== idx)))
                    }
                    className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-700">
                    URL do ícone
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
                    placeholder="https://..."
                    className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                  />
                  {invalidIconIndexes.has(idx) ? (
                    <span className="text-[11px] font-medium text-red-700">
                      Use uma URL de imagem (png/jpg/jpeg/webp/gif/avif). SVG não é
                      aceito.
                    </span>
                  ) : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-700">
                    Texto
                  </span>
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

function isDisallowedIconUrl(url: string) {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.startsWith("data:image/svg+xml")) return true;
  if (u.endsWith(".svg")) return true;

  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
  const hasAllowedExt = allowed.some((ext) => u.includes(ext));

  return !hasAllowedExt;
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

