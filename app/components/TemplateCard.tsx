"use client";

import Link from "next/link";
import { useState } from "react";

import type { RenderedTemplate, TemplateMeta } from "../lib/templates/types";
import { PreviewFrame } from "./PreviewFrame";

type Props = {
  meta: TemplateMeta;
  preview: RenderedTemplate;
  index?: number;
};

export function TemplateCard({ meta, preview, index = 0 }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  // Stagger animation delay based on index
  const animationDelay = index * 50;

  return (
    <Link
      href={`/builder/${meta.id}`}
      className="group animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="card-premium flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:border-border group-hover:shadow-xl">
        {/* Preview Frame */}
        <div className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted/30">
          <div className="aspect-[16/10] overflow-hidden">
            <PreviewFrame
              rendered={preview}
              title={`Prévia: ${meta.name}`}
              height="100%"
              className="h-full w-full border-0 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="btn-press rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
              Personalizar
              <svg
                className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Category Badge */}
          {meta.category && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur-sm shadow-sm">
                {meta.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {meta.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {meta.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Visualizar preview</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
