import type { RenderedTemplate, TemplateMeta } from "../../types";
import { getExample as getStripExample } from "../attributes-strip/definition";
import type { AttributesDetailsBarData } from "./types";

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
  id: "attributes-details-bar",
  name: "Atributos + Details (barra)",
  description: "Atributos à esquerda e acordeões à direita, com fundo.",
  category: "Produto",
};

export function getExample(): AttributesDetailsBarData {
  const ex = getStripExample();
  return {
    attributes: ex.attributes,
    detailsItems: [
      { title: "Ingredientes e Tabela Nutricional", description: "Conteúdo do detalhe 1" },
      { title: "Modo de Preparo", description: "Conteúdo do detalhe 2" },
      { title: "Laudos", description: "Conteúdo do detalhe 3" },
    ],
  };
}

export function render(data: AttributesDetailsBarData): RenderedTemplate {
  const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const css = `/* =====================================================
  WiTemplates — Template: attributes-details-bar
  Classe genérica : .wi-bar
  Classe específica: .wi-attributes-details-bar
  ===================================================== */

.wi-bar {
  width: 100%;
}

.wi-attributes-details-bar {
  --wi-bg: #5188DF;
  --wi-fg: #FFFFFF;
  --wi-detail: #2A3E7E;
  background: var(--wi-bg);
  color: var(--wi-fg);
  padding: 24px 20px;
}

.wi-attributes-details-bar .wi-bar__grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  align-items: start;
  gap: 20px;
}

.wi-attributes-details-bar .wi-bar__strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  overflow-x: hidden;
}

.wi-attributes-details-bar .wi-bar__attr {
  flex: 0 0 auto;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
  color: var(--wi-fg);
  font-size: 12px;
  font-weight: 300;
  font-family: inherit;
  text-align: center;
}

.wi-attributes-details-bar .wi-bar__attrIcon {
  width: 28px;
  height: auto;
  display: block;
}

.wi-attributes-details-bar .wi-bar__attrText {
  max-width: 91px;
  white-space: normal;
  word-break: break-word;
  text-align: center;
}

.wi-attributes-details-bar .wi-bar__details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wi-attributes-details-bar .wi-bar__item {
  border-radius: 10px;
  background: rgba(255,255,255,.92);
  overflow: hidden;
}

.wi-attributes-details-bar .wi-bar__summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 400;
  color: var(--wi-detail);
}

.wi-attributes-details-bar .wi-bar__summary::-webkit-details-marker { display: none; }

.wi-attributes-details-bar .wi-bar__chevron {
  width: 24px;
  height: 24px;
  display: inline-flex;
  color: var(--wi-detail);
  transition: transform 160ms ease;
}

.wi-attributes-details-bar details[open] .wi-bar__chevron {
  transform: rotate(180deg);
}

.wi-attributes-details-bar .wi-bar__content {
  padding: 0 12px 12px;
  font-size: 14px;
  font-weight: 400;
  color: var(--wi-detail);
}

@media (max-width: 860px) {
  .wi-attributes-details-bar .wi-bar__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .wi-attributes-details-bar .wi-bar__strip {
    justify-content: flex-start;
  }

  .wi-attributes-details-bar .wi-bar__attr {
    flex: 1 1 auto;
    min-width: 110px;
  }
}`;

  const attrs = data.attributes
    .map(
      (a) => `    <div class="wi-bar__attr">
      <img class="wi-bar__attrIcon" src="${escapeAttr(a.iconUrl)}" alt="" />
      <span class="wi-bar__attrText">${escapeHtml(a.label)}</span>
    </div>`
    )
    .join("\n");

  const details = data.detailsItems
    .map(
      (d) => `    <details class="wi-bar__item">
      <summary class="wi-bar__summary">
        <span>${escapeHtml(d.title)}</span>
        <span class="wi-bar__chevron">${chevronSvg}</span>
      </summary>
      <div class="wi-bar__content">${escapeHtml(d.description)}</div>
    </details>`
    )
    .join("\n");

  return {
    css,
    html: `<div class="wi-bar wi-attributes-details-bar">
  <div class="wi-bar__grid">
    <div class="wi-bar__strip">
${attrs}
    </div>
    <div class="wi-bar__details">
${details}
    </div>
  </div>
</div>`,
  };
}

