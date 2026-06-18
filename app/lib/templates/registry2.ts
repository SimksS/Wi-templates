import type { ComponentType } from "react";

import type { RenderedTemplate, TemplateMeta } from "./types";

import type { AttributesStripData } from "./templates/attributes-strip/types";
import {
  meta as attributesStripMeta,
  getExample as getAttributesStripExample,
  render as renderAttributesStrip,
} from "./templates/attributes-strip/definition";
import { AttributesStripBuilder } from "./templates/attributes-strip/Builder";

import type {
  AttributesDetailsBarData,
  AttributesDetailsItem,
} from "./templates/attributes-details-bar/types";
import {
  meta as attributesDetailsBarMeta,
  getExample as getAttributesDetailsBarExample,
  render as renderAttributesDetailsBar,
} from "./templates/attributes-details-bar/definition";
import { AttributesDetailsBarBuilder } from "./templates/attributes-details-bar/Builder";

import type {
  ContainsCompareData,
  ContainsCompareItem,
} from "./templates/contains-compare/types";
import {
  meta as containsCompareMeta,
  getExample as getContainsCompareExample,
  render as renderContainsCompare,
} from "./templates/contains-compare/definition";
import { ContainsCompareBuilder } from "./templates/contains-compare/Builder";

import type {
  ComparisonRow,
  ComparisonTableData,
  ComparisonValue,
} from "./templates/comparison-table/types";
import {
  meta as comparisonTableMeta,
  getExample as getComparisonTableExample,
  render as renderComparisonTable,
} from "./templates/comparison-table/definition";
import { ComparisonTableBuilder } from "./templates/comparison-table/Builder";

import type { FaqData, FaqItem } from "./templates/faq/types";
import {
  meta as faqMeta,
  getExample as getFaqExample,
  render as renderFaq,
} from "./templates/faq/definition";
import { FaqBuilder } from "./templates/faq/Builder";

import type { ImageTextFeatureData } from "./templates/image-text-feature/types";
import {
  meta as imageTextFeatureMeta,
  getExample as getImageTextFeatureExample,
  render as renderImageTextFeature,
} from "./templates/image-text-feature/definition";
import { ImageTextFeatureBuilder } from "./templates/image-text-feature/Builder";

export { toSnippet } from "./toSnippet";

export type {
  AttributesStripData,
  ContainsCompareItem,
  ContainsCompareData,
  AttributesDetailsItem,
  AttributesDetailsBarData,
  ComparisonValue,
  ComparisonRow,
  ComparisonTableData,
  FaqItem,
  FaqData,
  ImageTextFeatureData,
};

export {
  getAttributesStripExample,
  renderAttributesStrip,
  getContainsCompareExample,
  renderContainsCompare,
  getAttributesDetailsBarExample,
  renderAttributesDetailsBar,
  getComparisonTableExample,
  renderComparisonTable,
  getFaqExample,
  renderFaq,
  getImageTextFeatureExample,
  renderImageTextFeature,
};

export type TemplateId =
  | "attributes-strip"
  | "contains-compare"
  | "attributes-details-bar"
  | "comparison-table"
  | "faq"
  | "image-text-feature";

type TemplateDefinitionAny = {
  meta: TemplateMeta;
  getExample: () => unknown;
  render: (data: never) => RenderedTemplate;
  Builder: ComponentType<{ templateName: string }>;
};

export const templateList = [
  {
    meta: attributesStripMeta,
    getExample: getAttributesStripExample,
    render: renderAttributesStrip,
    Builder: AttributesStripBuilder,
  },
  {
    meta: containsCompareMeta,
    getExample: getContainsCompareExample,
    render: renderContainsCompare,
    Builder: ContainsCompareBuilder,
  },
  {
    meta: attributesDetailsBarMeta,
    getExample: getAttributesDetailsBarExample,
    render: renderAttributesDetailsBar,
    Builder: AttributesDetailsBarBuilder,
  },
  {
    meta: comparisonTableMeta,
    getExample: getComparisonTableExample,
    render: renderComparisonTable,
    Builder: ComparisonTableBuilder,
  },
  {
    meta: faqMeta,
    getExample: getFaqExample,
    render: renderFaq,
    Builder: FaqBuilder,
  },
  {
    meta: imageTextFeatureMeta,
    getExample: getImageTextFeatureExample,
    render: renderImageTextFeature,
    Builder: ImageTextFeatureBuilder,
  },
] as const satisfies readonly TemplateDefinitionAny[];

export const templates: TemplateMeta[] = templateList.map((t) => t.meta);

export const templateById: Record<TemplateId, (typeof templateList)[number]> =
  Object.fromEntries(templateList.map((t) => [t.meta.id, t])) as Record<
    TemplateId,
    (typeof templateList)[number]
  >;

if (process.env.NODE_ENV !== "production") {
  const ids = new Set<string>();
  for (const t of templateList) {
    if (ids.has(t.meta.id)) {
      throw new Error(`Template id duplicado: ${t.meta.id}`);
    }
    ids.add(t.meta.id);
  }
}

export function previewTemplate(meta: TemplateMeta): RenderedTemplate {
  switch (meta.id) {
    case "attributes-strip":
      return renderAttributesStrip(getAttributesStripExample());
    case "contains-compare":
      return renderContainsCompare(getContainsCompareExample());
    case "attributes-details-bar":
      return renderAttributesDetailsBar(getAttributesDetailsBarExample());
    case "comparison-table":
      return renderComparisonTable(getComparisonTableExample());
    case "faq":
      return renderFaq(getFaqExample());
    case "image-text-feature":
      return renderImageTextFeature(getImageTextFeatureExample());
    default:
      return { html: `<div>Template não encontrado: ${meta.id}</div>`, css: "" };
  }
}

