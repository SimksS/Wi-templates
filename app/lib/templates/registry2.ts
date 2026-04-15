import type { TemplateDefinition } from "./templateDefinition";
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
};

export type TemplateId =
  | "attributes-strip"
  | "contains-compare"
  | "attributes-details-bar"
  | "comparison-table";

type TemplateDefinitionAny = TemplateDefinition<any>;

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
] as const satisfies readonly TemplateDefinitionAny[];

export const templates: TemplateMeta[] = templateList.map((t) => t.meta);

export const templateById: Record<TemplateId, (typeof templateList)[number]> =
  Object.fromEntries(templateList.map((t) => [t.meta.id, t])) as any;

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
  const def =
    (templateById as Record<
      string,
      (typeof templateList)[number] | undefined
    >)[meta.id];

  if (!def) {
    return { html: `<div>Template não encontrado: ${meta.id}</div>`, css: "" };
  }

  return def.render(def.getExample());
}

