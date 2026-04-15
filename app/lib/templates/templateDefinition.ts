import type { ComponentType } from "react";

import type { RenderedTemplate, TemplateMeta } from "./types";

export type TemplateDefinition<TData> = {
  meta: TemplateMeta;
  getExample: () => TData;
  render: (data: TData) => RenderedTemplate;
  Builder: ComponentType<{ templateName: string }>;
};

