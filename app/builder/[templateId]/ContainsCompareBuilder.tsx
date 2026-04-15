"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../components/CodePanel";
import { BuilderTabs } from "./tabs";
import {
  getContainsCompareExample,
  renderContainsCompare,
  toSnippet,
  type ContainsCompareData,
} from "../../lib/templates/registry2";

type Props = {
  templateName: string;
};

export function ContainsCompareBuilder({ templateName }: Props) {
  const [data, setData] = useState<ContainsCompareData>(() =>
    getContainsCompareExample()
  );

  const [containsIds, setContainsIds] = useState<string[]>(() =>
    getContainsCompareExample().containsItems.map(() => crypto.randomUUID())
  );
  const [notContainsIds, setNotContainsIds] = useState<string[]>(() =>
    getContainsCompareExample().notContainsItems.map(() => crypto.randomUUID())
  );

  const centerImageInvalid = useMemo(
    () => isDisallowedImageUrl(data.centerImageUrl),
    [data.centerImageUrl]
  );

  const safeData = useMemo(() => {
    if (!centerImageInvalid) return data;
    return { ...data, centerImageUrl: "" };
  }, [data, centerImageInvalid]);

  const renderedTemplate = useMemo(
    () => renderContainsCompare(safeData),
    [safeData]
  );

  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">Configuração</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Defina a imagem central e edite as listas “Contém” e “Não contém”.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">
              URL da imagem central
            </div>
            <input
              type="url"
              value={data.centerImageUrl}
              onChange={(e) =>
                setData((d) => ({ ...d, centerImageUrl: e.target.value }))
              }
              placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
            {centerImageInvalid ? (
              <div className="mt-2 text-[11px] font-medium text-red-700">
                Use uma URL de imagem (png/jpg/jpeg/webp/gif/avif). SVG não é aceito.
              </div>
            ) : null}
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6">
          <ListEditor
            title="Contém"
            items={data.containsItems}
            onChange={(items) => setData((d) => ({ ...d, containsItems: items }))}
            ids={containsIds}
            onIdsChange={setContainsIds}
          />
          <ListEditor
            title="Não contém"
            items={data.notContainsItems}
            onChange={(items) =>
              setData((d) => ({ ...d, notContainsItems: items }))
            }
            ids={notContainsIds}
            onIdsChange={setNotContainsIds}
          />
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

type Item = { title: string; description?: string };

function ListEditor({
  title,
  items,
  onChange,
  ids,
  onIdsChange,
}: {
  title: string;
  items: Item[];
  onChange: (items: Item[]) => void;
  ids: string[];
  onIdsChange: (ids: string[]) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <button
          type="button"
          onClick={() => (onChange([...items, { title: "Novo item" }]), onIdsChange([...ids, crypto.randomUUID()]))}
          className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
        >
          + Adicionar
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {items.map((it, idx) => (
          <div key={ids[idx] ?? `${idx}`} className="rounded-2xl border border-black/10 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-zinc-700">Item {idx + 1}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (onChange(move(items, idx, idx - 1)), onIdsChange(move(ids, idx, idx - 1)))}
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
                  onClick={() => (onChange(move(items, idx, idx + 1)), onIdsChange(move(ids, idx, idx + 1)))}
                  disabled={idx === items.length - 1}
                  className={[
                    "rounded-lg px-2 py-1 text-xs font-semibold",
                    idx === items.length - 1
                      ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                  ].join(" ")}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => (
                    onChange(items.filter((_, i) => i !== idx)),
                    onIdsChange(ids.filter((_, i) => i !== idx))
                  )}
                  className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-700">Título</span>
                <input
                  type="text"
                  value={it.title}
                  onChange={(e) =>
                    onChange(items.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))
                  }
                  className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-700">Descrição (opcional)</span>
                <input
                  type="text"
                  value={it.description ?? ""}
                  onChange={(e) =>
                    onChange(items.map((x, i) => (i === idx ? { ...x, description: e.target.value || undefined } : x)))
                  }
                  className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                />
              </label>
            </div>
          </div>
        ))}
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

