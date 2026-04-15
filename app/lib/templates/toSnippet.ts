import type { RenderedTemplate } from "./types";

export function toSnippet(rendered: RenderedTemplate): { html: string; css: string } {
  return {
    html: rendered.html.trim(),
    css: rendered.css?.trim() ?? "",
  };
}

