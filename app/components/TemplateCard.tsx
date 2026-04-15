import Link from "next/link";

import type { RenderedTemplate, TemplateMeta } from "../lib/templates/types";
import { PreviewFrame } from "./PreviewFrame";

type Props = {
  meta: TemplateMeta;
  preview: RenderedTemplate;
};

export function TemplateCard({ meta, preview }: Props) {
  return (
    <Link
      href={`/builder/${meta.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-900">
            {meta.name}
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-zinc-600">
            {meta.description}
          </div>
        </div>
        {meta.category ? (
          <div className="shrink-0 rounded-full border border-black/10 px-2 py-1 text-[11px] font-semibold text-zinc-700">
            {meta.category}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl">
        <PreviewFrame
          rendered={preview}
          title={`Prévia: ${meta.name}`}
          height={180}
          className="transition-transform group-hover:scale-[1.01]"
        />
      </div>
    </Link>
  );
}

