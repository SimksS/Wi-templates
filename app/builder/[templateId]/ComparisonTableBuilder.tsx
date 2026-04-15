"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../components/CodePanel";
import { BuilderTabs } from "./tabs";
import {
  getComparisonTableExample,
  renderComparisonTable,
  toSnippet,
  type ComparisonRow,
  type ComparisonTableData,
} from "../../lib/templates/registry2";

type Props = { templateName: string };

export function ComparisonTableBuilder({ templateName }: Props) {
  const [data, setData] = useState<ComparisonTableData>(() =>
    getComparisonTableExample()
  );

  const [rowIds, setRowIds] = useState<string[]>(() =>
    getComparisonTableExample().rows.map(() => crypto.randomUUID())
  );

  const logoInvalid = useMemo(() => isDisallowedImageUrl(data.logoUrl), [data.logoUrl]);
  const brandInvalid = useMemo(
    () => isDisallowedImageUrl(data.brandImageUrl),
    [data.brandImageUrl]
  );
  const compInvalid = useMemo(
    () => isDisallowedImageUrl(data.competitorImageUrl),
    [data.competitorImageUrl]
  );

  const safeData = useMemo(() => {
    return {
      ...data,
      logoUrl: logoInvalid ? "" : data.logoUrl,
      brandImageUrl: brandInvalid ? "" : data.brandImageUrl,
      competitorImageUrl: compInvalid ? "" : data.competitorImageUrl,
    };
  }, [data, logoInvalid, brandInvalid, compInvalid]);

  const renderedTemplate = useMemo(() => renderComparisonTable(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">Configuração</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Título/subtítulo, imagens e linhas comparativas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Título</div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>
          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Subtítulo</div>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => setData((d) => ({ ...d, subtitle: e.target.value }))}
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <ImageUrlField
            label="Logo (marca)"
            value={data.logoUrl}
            invalid={logoInvalid}
            onChange={(v) => setData((d) => ({ ...d, logoUrl: v }))}
          />

          <div className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="mb-2 text-xs font-semibold text-zinc-700">
              Cabeçalho da coluna (Marca)
            </div>
            <div className="flex items-center gap-3">
              <select
                value={data.brandHeaderMode}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    brandHeaderMode: e.target.value as "text" | "logo",
                  }))
                }
                className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
              >
                <option value="text">Nome da marca</option>
                <option value="logo">Logo</option>
              </select>

              {data.brandHeaderMode === "text" ? (
                <input
                  type="text"
                  value={data.brandName}
                  onChange={(e) =>
                    setData((d) => ({ ...d, brandName: e.target.value }))
                  }
                  placeholder="Nome da marca"
                  className="h-9 flex-1 rounded-lg border border-black/10 bg-white px-3 text-sm"
                />
              ) : (
                <div className="text-xs text-zinc-600">
                  Usará a URL informada em “Logo (marca)”.
                </div>
              )}
            </div>
          </div>

          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">
              Cabeçalho da coluna (Concorrente)
            </div>
            <input
              type="text"
              value={data.competitorName}
              onChange={(e) =>
                setData((d) => ({ ...d, competitorName: e.target.value }))
              }
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>

          <ImageUrlField
            label="Imagem produto (marca)"
            value={data.brandImageUrl}
            invalid={brandInvalid}
            onChange={(v) => setData((d) => ({ ...d, brandImageUrl: v }))}
          />
          <ImageUrlField
            label="Imagem produto (concorrente)"
            value={data.competitorImageUrl}
            invalid={compInvalid}
            onChange={(v) => setData((d) => ({ ...d, competitorImageUrl: v }))}
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-zinc-700">
              Comparações ({data.rows.length})
            </div>
            <button
              type="button"
              onClick={() => {
                setData((d) => ({
                  ...d,
                  rows: [
                    ...d.rows,
                    {
                      attribute: "Novo atributo",
                      brand: { kind: "text", value: "0g" },
                      competitor: { kind: "text", value: "0g" },
                    },
                  ],
                }));
                setRowIds((ids) => [...ids, crypto.randomUUID()]);
              }}
              className="rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              + Adicionar
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {data.rows.map((row, idx) => (
              <div key={rowIds[idx] ?? `${idx}`} className="rounded-2xl border border-black/10 bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-zinc-700">
                    Linha {idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setData((d) => ({ ...d, rows: move(d.rows, idx, idx - 1) }));
                        setRowIds((ids) => move(ids, idx, idx - 1));
                      }}
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
                      onClick={() => {
                        setData((d) => ({ ...d, rows: move(d.rows, idx, idx + 1) }));
                        setRowIds((ids) => move(ids, idx, idx + 1));
                      }}
                      disabled={idx === data.rows.length - 1}
                      className={[
                        "rounded-lg px-2 py-1 text-xs font-semibold",
                        idx === data.rows.length - 1
                          ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                      ].join(" ")}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setData((d) => ({ ...d, rows: d.rows.filter((_, i) => i !== idx) }));
                        setRowIds((ids) => ids.filter((_, i) => i !== idx));
                      }}
                      className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-700">Atributo</span>
                  <input
                    type="text"
                    value={row.attribute}
                    onChange={(e) => updateRow(setData, idx, { attribute: e.target.value })}
                    className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm"
                  />
                </label>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ValueEditor
                    label="Marca"
                    value={row.brand}
                    onChange={(v) => updateRow(setData, idx, { brand: v })}
                  />
                  <ValueEditor
                    label="Concorrente"
                    value={row.competitor}
                    onChange={(v) => updateRow(setData, idx, { competitor: v })}
                  />
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
          htmlPanel={<CodePanel title="HTML — cole no seu site" code={snippet.html} copyLabel="Copiar HTML" />}
          cssPanel={<CodePanel title="CSS — adicione ao seu <style> ou stylesheet" code={snippet.css} copyLabel="Copiar CSS" />}
        />
      </section>
    </div>
  );
}

function ImageUrlField({
  label,
  value,
  invalid,
  onChange,
}: {
  label: string;
  value: string;
  invalid: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
      <div className="text-xs font-semibold text-zinc-700">{label}</div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
        className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
      />
      {invalid ? (
        <div className="mt-2 text-[11px] font-medium text-red-700">
          Use uma URL de imagem (png/jpg/jpeg/webp/gif/avif). SVG não é aceito.
        </div>
      ) : null}
    </label>
  );
}

function ValueEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ComparisonRow["brand"];
  onChange: (v: ComparisonRow["brand"]) => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-zinc-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-zinc-700">{label}</div>
        <select
          value={value.kind}
          onChange={(e) => {
            const kind = e.target.value as "text" | "boolean";
            onChange(kind === "text" ? { kind: "text", value: "" } : { kind: "boolean", value: true });
          }}
          className="h-8 rounded-lg border border-black/10 bg-white px-2 text-xs"
        >
          <option value="text">Texto</option>
          <option value="boolean">Booleano</option>
        </select>
      </div>

      {value.kind === "text" ? (
        <input
          type="text"
          value={value.value}
          onChange={(e) => onChange({ kind: "text", value: e.target.value })}
          className="h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
        />
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ kind: "boolean", value: true })}
            className={[
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold",
              value.value ? "bg-black text-white" : "bg-white text-zinc-700 border border-black/10",
            ].join(" ")}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => onChange({ kind: "boolean", value: false })}
            className={[
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold",
              !value.value ? "bg-black text-white" : "bg-white text-zinc-700 border border-black/10",
            ].join(" ")}
          >
            Não
          </button>
        </div>
      )}
    </div>
  );
}

function updateRow(
  setData: React.Dispatch<React.SetStateAction<ComparisonTableData>>,
  idx: number,
  patch: Partial<ComparisonRow>
) {
  setData((d) => ({
    ...d,
    rows: d.rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
  }));
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

