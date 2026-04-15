import type { RenderedTemplate, TemplateMeta } from "../../types";
import type { ComparisonTableData, ComparisonValue } from "./types";

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
  id: "comparison-table",
  name: "Tabela comparativa",
  description: "Tabela com atributos comparando marca vs concorrente.",
  category: "Produto",
};

export function getExample(): ComparisonTableData {
  return {
    title: "POR QUE ESCOLHER O HIDRA ISOTÔNICO?",
    subtitle:
      "Mais eletrólitos, zero açúcares, aromas 100% naturais e sem corantes artificiais",
    logoUrl: "",
    brandHeaderMode: "text",
    brandName: "dobro",
    competitorName: "Bebidas Tradicionais",
    brandImageUrl: "",
    competitorImageUrl: "",
    rows: [
      {
        attribute: "Açúcares",
        brand: { kind: "text", value: "0g" },
        competitor: { kind: "text", value: "0g" },
      },
      {
        attribute: "Sódio",
        brand: { kind: "text", value: "0g" },
        competitor: { kind: "text", value: "0g" },
      },
      {
        attribute: "Aromas 100% Naturais",
        brand: { kind: "boolean", value: true },
        competitor: { kind: "boolean", value: false },
      },
      {
        attribute: "Sem Corantes Artificiais",
        brand: { kind: "boolean", value: true },
        competitor: { kind: "boolean", value: false },
      },
    ],
  };
}

export function render(data: ComparisonTableData): RenderedTemplate {
  const okSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
  <path d="M14.0026 25.6693C20.4459 25.6693 25.6693 20.4459 25.6693 14.0026C25.6693 7.55928 20.4459 2.33594 14.0026 2.33594C7.55928 2.33594 2.33594 7.55928 2.33594 14.0026C2.33594 20.4459 7.55928 25.6693 14.0026 25.6693Z" stroke="#2D881F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.33594 14L12.8359 17.5L19.8359 10.5" stroke="#2D881F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const noSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
  <path d="M14.0026 25.6693C20.4459 25.6693 25.6693 20.4459 25.6693 14.0026C25.6693 7.55928 20.4459 2.33594 14.0026 2.33594C7.55928 2.33594 2.33594 7.55928 2.33594 14.0026C2.33594 20.4459 7.55928 25.6693 14.0026 25.6693Z" stroke="#D63230" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.5 10.5L10.5 17.5" stroke="#D63230" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5 10.5L17.5 17.5" stroke="#D63230" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const css = `/* =====================================================
  WiTemplates — Template: comparison-table
  Classe genérica : .wi-table
  Classe específica: .wi-comparison-table
  ===================================================== */

.wi-table { width: 100%; }

.wi-comparison-table {
  position: relative;
  padding: 24px 20px 28px;
  color: #1f2a44;
}

.wi-comparison-table .wi-table__title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: .02em;
}

.wi-comparison-table .wi-table__subtitle {
  text-align: center;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 400;
  opacity: .9;
}

.wi-comparison-table .wi-table__logo {
  position: absolute;
  left: 24px;
  top: 86px;
  height: 26px;
  width: auto;
}

.wi-comparison-table .wi-table__wrap {
  position: relative;
  margin-top: 20px;
  padding: 18px 0;
  max-width: 915px;
  margin-left: auto;
  margin-right: auto;
}

.wi-comparison-table .wi-table__grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.wi-comparison-table .wi-table__grid th,
.wi-comparison-table .wi-table__grid td {
  border: 1px solid rgba(0,0,0,.18);
  padding: 14px 10px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #1f2a44;
}

.wi-comparison-table .wi-table__grid th {
  font-size: 14px;
  font-weight: 700;
  background: none;
  border: none;
}

.wi-comparison-table .wi-table__attr {
  font-weight: 700;
}

.wi-comparison-table .wi-table__imgLeft,
.wi-comparison-table .wi-table__imgRight {
  position: absolute;
  top: 50%;
  height: 485px;
  width: auto;
  z-index: 2;
  pointer-events: none;
}

.wi-comparison-table .wi-table__imgLeft { left: 0; transform: translate(-50%, -50%); }
.wi-comparison-table .wi-table__imgRight { right: 0; transform: translate(50%, -50%); }

.wi-comparison-table .wi-table__spacerRow td {
  padding: 10px;
  background: rgba(0,0,0,.01);
}

/* Mobile mantém estrutura do desktop (sem empilhar) */
@media (max-width: 860px) {
  .wi-comparison-table .wi-table__wrap {
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
  }

  .wi-comparison-table .wi-table__imgLeft,
  .wi-comparison-table .wi-table__imgRight {
    height: 188px;
  }

  /* No mobile, exibimos ~30% da largura da imagem */
  .wi-comparison-table .wi-table__imgLeft { transform: translate(-70%, -50%); }
  .wi-comparison-table .wi-table__imgRight { transform: translate(70%, -50%); }
}`; 

  const headerBrand = "Marca";
  const headerAttr = "";
  const headerComp = data.competitorName || "Concorrente";

  const brandHeader =
    data.brandHeaderMode === "logo" && data.logoUrl?.trim()
      ? `<img src="${escapeAttr(data.logoUrl)}" alt="" style="height: 22px; width: auto; display: inline-block;" />`
      : escapeHtml(data.brandName || headerBrand);

  const formatValue = (v: ComparisonValue) => {
    if (v.kind === "text") return escapeHtml(v.value);
    return v.value ? okSvg : noSvg;
  };

  const rowsHtml = data.rows
    .map((r) => {
      return `<tr>
  <td>${formatValue(r.brand)}</td>
  <td class="wi-table__attr">${escapeHtml(r.attribute)}</td>
  <td>${formatValue(r.competitor)}</td>
</tr>`;
    })
    .join("\n");

  const brandImg = data.brandImageUrl?.trim()
    ? `<img class="wi-table__imgLeft" src="${escapeAttr(data.brandImageUrl)}" alt="" />`
    : "";

  const compImg = data.competitorImageUrl?.trim()
    ? `<img class="wi-table__imgRight" src="${escapeAttr(data.competitorImageUrl)}" alt="" />`
    : "";

  return {
    css,
    html: `<section class="wi-table wi-comparison-table">
  <div class="wi-table__title">${escapeHtml(data.title)}</div>
  <div class="wi-table__subtitle">${escapeHtml(data.subtitle)}</div>
  <div class="wi-table__wrap">
    ${brandImg}
    ${compImg}
    <table class="wi-table__grid" role="table" aria-label="Tabela comparativa">
      <thead>
        <tr>
          <th>${brandHeader}</th>
          <th>${escapeHtml(headerAttr)}</th>
          <th>${escapeHtml(headerComp)}</th>
        </tr>
      </thead>
      <tbody>
${rowsHtml}
      </tbody>
    </table>
  </div>
</section>`,
  };
}

