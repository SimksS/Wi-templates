import type { RenderedTemplate, TemplateMeta } from "../../types";
import type { FaqData, FaqItem } from "./types";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const meta: TemplateMeta = {
  id: "faq",
  name: "FAQ",
  description: "Perguntas frequentes em acordeao, com titulo editavel e duas colunas.",
  category: "Conteudo",
};

export function getExample(): FaqData {
  return {
    title: "FAQ",
    openFirstItems: true,
    items: [
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
      {
        question: "Lorem Ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus enim dui, feugiat in enim sit amet, suscipit dictum massa.",
      },
    ],
  };
}

export function render(data: FaqData): RenderedTemplate {
  const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  <path d="M6 15L12 9L18 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const css = `/* =====================================================
  WiTemplates - Template: faq
  Classe generica : .wi-faq
  Classe especifica: .wi-faq-section
  ===================================================== */

.wi-faq {
  width: 100%;
}

.wi-faq-section {
  --wi-faq-title: #263f86;
  --wi-faq-text: #263f86;
  --wi-faq-card: #f6f6f7;
  --wi-faq-gap: 22px;
  color: var(--wi-faq-text);
  padding: 34px 36px 28px;
  font-family: inherit;
}

.wi-faq-section .wi-faq__title {
  margin: 0 0 22px;
  color: var(--wi-faq-title);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
  text-transform: uppercase;
}

.wi-faq-section .wi-faq__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--wi-faq-gap);
}

.wi-faq-section .wi-faq__column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.wi-faq-section .wi-faq__item {
  border: 0;
  border-radius: 12px;
  background: var(--wi-faq-card);
  overflow: hidden;
}

.wi-faq-section .wi-faq__summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 38px;
  padding: 10px 16px;
  color: var(--wi-faq-text);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}

.wi-faq-section .wi-faq__summary::-webkit-details-marker {
  display: none;
}

.wi-faq-section .wi-faq__question {
  min-width: 0;
  overflow-wrap: anywhere;
}

.wi-faq-section .wi-faq__chevron {
  display: inline-flex;
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  color: var(--wi-faq-text);
  transition: transform 160ms ease;
}

.wi-faq-section details:not([open]) .wi-faq__chevron {
  transform: rotate(180deg);
}

.wi-faq-section .wi-faq__answer {
  margin: 0;
  padding: 4px 16px 12px;
  color: var(--wi-faq-text);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .wi-faq-section {
    padding: 28px 16px 24px;
  }

  .wi-faq-section .wi-faq__title {
    margin-bottom: 18px;
    font-size: 24px;
  }

  .wi-faq-section .wi-faq__grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}`;

  const midpoint = Math.ceil(data.items.length / 2);
  const columns = [data.items.slice(0, midpoint), data.items.slice(midpoint)];

  const renderItem = (item: FaqItem, itemIndex: number) => {
    const shouldOpen = data.openFirstItems && itemIndex === 0;

    return `    <details class="wi-faq__item"${shouldOpen ? " open" : ""}>
      <summary class="wi-faq__summary">
        <span class="wi-faq__question">${escapeHtml(item.question)}</span>
        <span class="wi-faq__chevron">${chevronSvg}</span>
      </summary>
      <p class="wi-faq__answer">${escapeHtml(item.answer)}</p>
    </details>`;
  };

  const columnsHtml = columns
    .map((column) => {
      const itemsHtml = column
        .map((item, itemIndex) => renderItem(item, itemIndex))
        .join("\n");

      return `  <div class="wi-faq__column">
${itemsHtml}
  </div>`;
    })
    .join("\n");

  return {
    css,
    html: `<section class="wi-faq wi-faq-section">
  <h2 class="wi-faq__title">${escapeHtml(data.title)}</h2>
  <div class="wi-faq__grid">
${columnsHtml}
  </div>
</section>`,
  };
}
