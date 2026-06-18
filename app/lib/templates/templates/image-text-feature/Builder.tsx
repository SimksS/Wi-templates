"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../../../components/CodePanel";
import { BuilderTabs } from "../../../../builder/[templateId]/tabs";
import { toSnippet } from "../../toSnippet";
import { getExample, render } from "./definition";
import type { ImageTextFeatureData } from "./types";

type Props = {
  templateName: string;
};

export function ImageTextFeatureBuilder({ templateName }: Props) {
  const [data, setData] = useState<ImageTextFeatureData>(() => getExample());

  const imageInvalid = useMemo(
    () => isDisallowedImageUrl(data.imageUrl),
    [data.imageUrl]
  );

  const safeData = useMemo(() => {
    if (!imageInvalid) return data;
    return { ...data, imageUrl: "" };
  }, [data, imageInvalid]);

  const renderedTemplate = useMemo(() => render(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-900">Configuracao</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Imagem, titulo, descricao com quebras de linha e cor de fundo do painel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">URL da imagem</div>
            <input
              type="url"
              value={data.imageUrl}
              onChange={(e) => setData((d) => ({ ...d, imageUrl: e.target.value }))}
              placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
            {imageInvalid ? (
              <div className="mt-2 text-[11px] font-medium text-red-700">
                Use uma URL de imagem (png/jpg/jpeg/webp/gif/avif). SVG nao e aceito.
              </div>
            ) : null}
          </label>

          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Texto alternativo da imagem</div>
            <input
              type="text"
              value={data.imageAlt}
              onChange={(e) => setData((d) => ({ ...d, imageAlt: e.target.value }))}
              placeholder="Descricao da imagem para acessibilidade"
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>

          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Cor de fundo do painel</div>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={normalizeColorInput(data.backgroundColor)}
                onChange={(e) =>
                  setData((d) => ({ ...d, backgroundColor: e.target.value }))
                }
                className="h-10 w-14 cursor-pointer rounded-lg border border-black/10 bg-white p-1"
              />
              <input
                type="text"
                value={data.backgroundColor}
                onChange={(e) =>
                  setData((d) => ({ ...d, backgroundColor: e.target.value }))
                }
                placeholder="#5489DC"
                className="h-9 flex-1 rounded-lg border border-black/10 bg-white px-3 text-sm font-mono"
              />
            </div>
          </label>

          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Titulo</div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              placeholder="Ex: ENERGIA, RESISTENCIA E PREPARO PARA O MOVIMENTO"
              className="mt-2 h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm"
            />
          </label>

          <label className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="text-xs font-semibold text-zinc-700">Descricao</div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Use Enter para quebras de linha entre paragrafos ou secoes.
            </p>
            <textarea
              value={data.description}
              onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
              rows={14}
              className="mt-2 w-full resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm leading-relaxed"
            />
          </label>
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

function normalizeColorInput(color: string) {
  const trimmed = color.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#5489DC";
}

function isDisallowedImageUrl(url: string) {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.startsWith("data:image/svg+xml")) return true;
  if (u.endsWith(".svg")) return true;
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
  return !allowed.some((ext) => u.includes(ext));
}
