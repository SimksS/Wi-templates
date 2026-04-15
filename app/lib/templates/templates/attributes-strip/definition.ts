import type { RenderedTemplate, TemplateMeta } from "../../types";
import type { AttributesStripData } from "./types";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(input: string) {
  return escapeHtml(input);
}

export const meta: TemplateMeta = {
  id: "attributes-strip",
  name: "Atributos (scroll)",
  description: "Lista horizontal de atributos com ícone e texto (com scroll).",
  category: "Produto",
};

export function getExample(): AttributesStripData {
  const svgIcon = (pathD: string) =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${pathD}"/></svg>`
    )}`;

  return {
    attributes: [
      {
        iconUrl: svgIcon(
          "M12 3c4.5 2 7 5.2 7 9.2C19 18 15.4 21 12 21S5 18 5 12.2C5 8.2 7.5 5 12 3Z"
        ),
        label: "Sem corantes",
      },
      {
        iconUrl: svgIcon("M7 14c3-6 7-6 10 0M9 10c.5-1.2 1.5-2 3-2s2.5.8 3 2"),
        label: "Com frutas de verdade",
      },
      {
        iconUrl: svgIcon("M8 3h8M9 3l1 8c.2 2 1.8 3 3 3s2.8-1 3-3l1-8M8 21h8"),
        label: "Sabor leve & refrescante",
      },
    ],
  };
}

export function render(data: AttributesStripData): RenderedTemplate {
  const css = `/* =====================================================
  WiTemplates — Template: attributes-strip
  Classe genérica : .wi-strip
  Classe específica: .wi-attributes-strip
  ===================================================== */

/* --- genérico: faixa de scroll horizontal --- */
.wi-strip {
  display: flex;
  gap: 8px;
  padding: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

/* --- específico: attributes-strip --- */
.wi-attributes-strip .wi-strip__item {
  flex: 0 0 auto;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
  background: var(--wi-bg, #5188DF);
  color: var(--wi-fg, #FFFFFF);
  font-size: 12px;
  font-weight: 300;
  font-family: inherit;
  text-align: center;
}

.wi-attributes-strip .wi-strip__icon {
  width: 28px;
  height: auto;
  display: block;
  flex: 0 0 auto;
}

.wi-attributes-strip .wi-strip__text {
  max-width: 91px;
  white-space: normal;
  word-break: break-word;
  text-align: center;
}`;

  const attrs = data.attributes
    .map(
      (a) => `  <div class="wi-strip__item">
    <img class="wi-strip__icon" src="${escapeAttr(a.iconUrl)}" alt="" />
    <span class="wi-strip__text">${escapeHtml(a.label)}</span>
  </div>`
    )
    .join("\n");

  return {
    css,
    html: `<div class="wi-strip wi-attributes-strip">
${attrs}
</div>`,
  };
}

