import type { RenderedTemplate, TemplateMeta } from "../../types";
import type { ContainsCompareData, ContainsCompareItem } from "./types";

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
  id: "contains-compare",
  name: "Contém / Não contém (comparativo)",
  description: "Duas listas com ícones e uma imagem central.",
  category: "Produto",
};

export function getExample(): ContainsCompareData {
  return {
    centerImageUrl: "",
    containsHeading: "CONTÉM",
    notContainsHeading: "NÃO CONTÉM",
    containsItems: [{ title: "Lorem Ipsum" }, { title: "Lorem Ipsum" }, { title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus vel orci vel mollis." }],
    notContainsItems: [{ title: "Lorem Ipsum" }, { title: "Lorem Ipsum" }, { title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non pulvinar ipsum, in ultricies purus." }],
  };
}

export function render(data: ContainsCompareData): RenderedTemplate {
  const okSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
  <path d="M14.0026 25.6693C15.535 25.6712 17.0526 25.3703 18.4683 24.7838C19.884 24.1974 21.1699 23.337 22.2521 22.2521C23.337 21.1699 24.1974 19.884 24.7838 18.4683C25.3703 17.0526 25.6712 15.535 25.6693 14.0026C25.6712 12.4702 25.3703 10.9526 24.7839 9.53686C24.1975 8.12114 23.3371 6.83526 22.2521 5.75311C21.17 4.66816 19.8841 3.80774 18.4684 3.22131C17.0526 2.63488 15.535 2.33399 14.0026 2.33595C12.4702 2.33399 10.9526 2.63488 9.53686 3.22131C8.12114 3.80774 6.83526 4.66816 5.75311 5.75311C4.66816 6.83526 3.80774 8.12114 3.22131 9.53686C2.63488 10.9526 2.33399 12.4702 2.33595 14.0026C2.33399 15.535 2.63488 17.0526 3.22131 18.4684C3.80774 19.8841 4.66816 21.17 5.75311 22.2521C6.83526 23.3371 8.12114 24.1975 9.53686 24.7839C10.9526 25.3703 12.4702 25.6712 14.0026 25.6693Z\" stroke=\"#2D881F\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
  <path d=\"M9.33594 14L12.8359 17.5L19.8359 10.5\" stroke=\"#2D881F\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
</svg>`;

  const noSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
  <path d=\"M14.0026 25.6693C20.4459 25.6693 25.6693 20.4459 25.6693 14.0026C25.6693 7.55928 20.4459 2.33594 14.0026 2.33594C7.55928 2.33594 2.33594 7.55928 2.33594 14.0026C2.33594 20.4459 7.55928 25.6693 14.0026 25.6693Z\" stroke=\"#D63230\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
  <path d=\"M17.5 10.5L10.5 17.5\" stroke=\"#D63230\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
  <path d=\"M10.5 10.5L17.5 17.5\" stroke=\"#D63230\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>
</svg>`;

  const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const css = `/* =====================================================
  WiTemplates — Template: contains-compare
  Classe genérica : .wi-compare
  Classe específica: .wi-contains-compare
  ===================================================== */

.wi-compare {
  width: 100%;
}

.wi-contains-compare {
  --wi-heading: #2A3E7E;
  --wi-itemTitle: #000;
  --wi-itemDesc: #000;
}

.wi-contains-compare .wi-compare__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: 0;
}

.wi-contains-compare .wi-compare__col {
  min-width: 0;
}

.wi-contains-compare .wi-compare__heading {
  font-size: 32px;
  font-weight: 500;
  color: var(--wi-heading);
  letter-spacing: 0.02em;
  text-align: left;
}

.wi-contains-compare .wi-compare__col--right .wi-compare__heading {
  text-align: left;
}

.wi-contains-compare .wi-compare__list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.wi-contains-compare .wi-compare__row {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 8px;
  align-items: start;
  padding: 18px 0;
  border-bottom: 1px solid rgba(0,0,0,.25);
}

.wi-contains-compare .wi-compare__row--iconRight {
  grid-template-columns: 1fr 28px;
}

.wi-contains-compare .wi-compare__title {
  font-size: 18px;
  font-weight: 400;
  color: var(--wi-itemTitle);
}

.wi-contains-compare .wi-compare__titleOnly {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wi-contains-compare .wi-compare__titleOnly--right {
  justify-content: flex-end;
  text-align: right;
}

.wi-contains-compare .wi-compare__details {
  margin-top: 0;
}

.wi-contains-compare .wi-compare__summary {
  list-style: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
  font-size: 18px;
  font-weight: 400;
  color: var(--wi-itemTitle);
}

.wi-contains-compare .wi-compare__summary::-webkit-details-marker { display: none; }

.wi-contains-compare .wi-compare__chevron {
  display: inline-flex;
  width: 24px;
  height: 24px;
  transition: transform 160ms ease;
}

.wi-contains-compare .wi-compare__details[open] .wi-compare__chevron {
  transform: rotate(180deg);
}

.wi-contains-compare .wi-compare__desc {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 300;
  color: var(--wi-itemDesc);
  opacity: .9;
}

.wi-contains-compare .wi-compare__center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  align-self: center;
}

.wi-contains-compare .wi-compare__image {
  width: auto;
  max-width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 860px) {
  .wi-contains-compare .wi-compare__grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .wi-contains-compare .wi-compare__center {
    width: 100%;
  }

  .wi-contains-compare .wi-compare__image {
    margin: 0 auto;
  }
}

@media (min-width: 861px) {
  .wi-contains-compare .wi-compare__col--right .wi-compare__heading {
    text-align: right;
  }
}`;

  const renderItem = (
    iconSvg: string,
    item: ContainsCompareItem,
    iconSide: "left" | "right"
  ) => {
    const titleText = escapeHtml(item.title);
    const descriptionText = item.description?.trim() ? escapeHtml(item.description) : "";

    const summary =
      iconSide === "left"
        ? `<summary class="wi-compare__summary"><span class="wi-compare__title">${titleText}</span><span class="wi-compare__chevron">${chevronSvg}</span></summary>`
        : `<summary class="wi-compare__summary"><span class="wi-compare__chevron">${chevronSvg}</span><span class="wi-compare__title">${titleText}</span></summary>`;

    const content = descriptionText
      ? `<details class="wi-compare__details">
  ${summary}
  <div class="wi-compare__desc">${descriptionText}</div>
</details>`
      : `<div class="wi-compare__titleOnly"><div class="wi-compare__title">${titleText}</div></div>`;

    if (iconSide === "left") {
      return `<li class="wi-compare__row">
  <div>${iconSvg}</div>
  <div>${content}</div>
</li>`;
    }

    const rightContent = descriptionText
      ? content
      : `<div class="wi-compare__titleOnly wi-compare__titleOnly--right"><div class="wi-compare__title">${titleText}</div></div>`;

    return `<li class="wi-compare__row wi-compare__row--iconRight">
  <div>${rightContent}</div>
  <div>${iconSvg}</div>
</li>`;
  };

  const containsHtml = data.containsItems.map((i) => renderItem(okSvg, i, "left")).join("\n");
  const notContainsHtml = data.notContainsItems.map((i) => renderItem(noSvg, i, "right")).join("\n");

  const centerImg = data.centerImageUrl?.trim()
    ? `<img class="wi-compare__image" src="${escapeAttr(data.centerImageUrl)}" alt="" />`
    : `<div style="width: 240px; height: 420px; background: rgba(0,0,0,.06); border-radius: 14px;"></div>`;

  return {
    css,
    html: `<div class="wi-compare wi-contains-compare">
  <div class="wi-compare__grid">
    <div class="wi-compare__col">
      <div class="wi-compare__heading">${escapeHtml(data.containsHeading)}</div>
      <ul class="wi-compare__list">
${containsHtml}
      </ul>
    </div>
    <div class="wi-compare__center">
      ${centerImg}
    </div>
    <div class="wi-compare__col wi-compare__col--right">
      <div class="wi-compare__heading">${escapeHtml(data.notContainsHeading)}</div>
      <ul class="wi-compare__list">
${notContainsHtml}
      </ul>
    </div>
  </div>
</div>`,
  };
}

