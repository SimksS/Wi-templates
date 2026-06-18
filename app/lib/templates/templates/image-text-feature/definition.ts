import type { RenderedTemplate, TemplateMeta } from "../../types";
import type { ImageTextFeatureData } from "./types";

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

function sanitizeHexColor(color: string, fallback = "#5489DC"): string {
  const trimmed = color.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) return trimmed;
  return fallback;
}

export const meta: TemplateMeta = {
  id: "image-text-feature",
  name: "Imagem + Texto (destaque)",
  description:
    "Bloco com imagem e painel colorido com titulo e descricao. Layout lado a lado no desktop e empilhado no mobile.",
  category: "Conteudo",
};

export function getExample(): ImageTextFeatureData {
  return {
    imageUrl: "",
    imageAlt: "Produto em uso",
    title: "ENERGIA, RESISTÊNCIA E PREPARO PARA O MOVIMENTO",
    description: `O BTNIT400 combina 400mg de nitrato natural da beterraba, carboidratos e eletrólitos em uma fórmula desenvolvida para preparar o corpo e sustentar a energia durante treinos, corridas e exercícios prolongados.

Após o consumo, o nitrato é convertido em óxido nítrico, composto que auxilia na vasodilatação e melhora o fluxo sanguíneo. Isso favorece a entrega de oxigênio e nutrientes para os músculos, contribuindo para mais eficiência energética, resistência e menor percepção de fadiga ao longo do esforço.

Já os carboidratos e eletrólitos ajudam na manutenção da energia e do desempenho durante a atividade, oferecendo suporte para manter ritmo, constância e rendimento por mais tempo.

Na prática?
Mais disposição, eficiência e preparo para acompanhar seu ritmo do começo ao fim.

Referência científica:
González-Soltero, R. et al. (2020) – DOI: 10.3390/nu12123611
Macuh, M.; Bojan, K. (2021) – DOI: 10.3390/nut13093183`,
    backgroundColor: "#5489DC",
  };
}

export function render(data: ImageTextFeatureData): RenderedTemplate {
  const bgColor = sanitizeHexColor(data.backgroundColor);
  const title = escapeHtml(data.title.trim() || "Titulo");
  const description = escapeHtml(data.description);
  const imageAlt = escapeAttr(data.imageAlt.trim() || data.title.trim() || "Imagem");

  const css = `/* =====================================================
  WiTemplates — Template: image-text-feature
  Classe generica : .wi-feature
  Classe especifica: .wi-image-text-feature
  ===================================================== */

.wi-feature {
  width: 100%;
}

.wi-image-text-feature {
  --wi-feature-bg: #5489DC;
  --wi-feature-fg: #FFFFFF;
  font-family: inherit;
}

.wi-image-text-feature .wi-feature__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

.wi-image-text-feature .wi-feature__media {
  grid-column: 1;
  margin: 0;
}

.wi-image-text-feature .wi-feature__media img,
.wi-image-text-feature .wi-feature__placeholder {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}

.wi-image-text-feature .wi-feature__placeholder {
  min-height: 320px;
  background: rgba(0, 0, 0, 0.06);
}

.wi-image-text-feature .wi-feature__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--wi-feature-bg);
  color: var(--wi-feature-fg);
  border-radius: 16px;
  padding: 40px;
  box-sizing: border-box;
}

.wi-image-text-feature .wi-feature__title {
  margin: 0 0 24px;
  font-size: clamp(22px, 2.2vw, 32px);
  font-weight: 700;
  line-height: 1.15;
  text-transform: uppercase;
}

.wi-image-text-feature .wi-feature__description {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.55;
  white-space: pre-line;
}

@media (max-width: 760px) {
  .wi-image-text-feature {
    padding: 0 16px 16px;
  }

  .wi-image-text-feature .wi-feature__grid {
    grid-template-columns: 1fr;
    position: static;
    gap: 12px;
  }

  .wi-image-text-feature .wi-feature__media {
    grid-column: auto;
  }

  .wi-image-text-feature .wi-feature__placeholder {
    min-height: 200px;
  }

  .wi-image-text-feature .wi-feature__content {
    position: static;
    width: auto;
    overflow-y: visible;
    border-radius: 14px;
    padding: 28px 24px;
  }

  .wi-image-text-feature .wi-feature__title {
    margin-bottom: 18px;
    font-size: 22px;
  }

  .wi-image-text-feature .wi-feature__description {
    font-size: 14px;
    line-height: 1.5;
  }
}`;

  const mediaHtml = data.imageUrl.trim()
    ? `<img src="${escapeAttr(data.imageUrl)}" alt="${imageAlt}" />`
    : `<div class="wi-feature__placeholder" role="img" aria-label="${imageAlt}"></div>`;

  return {
    css,
    html: `<section class="wi-feature wi-image-text-feature">
  <div class="wi-feature__grid">
    <figure class="wi-feature__media">
      ${mediaHtml}
    </figure>
    <div class="wi-feature__content" style="--wi-feature-bg: ${bgColor};">
      <h2 class="wi-feature__title">${title}</h2>
      <div class="wi-feature__description">${description}</div>
    </div>
  </div>
</section>`,
  };
}
