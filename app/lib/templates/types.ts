export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  category?: string;
};

export type RenderedTemplate = {
  html: string;
  css?: string;
  js?: string;
};

