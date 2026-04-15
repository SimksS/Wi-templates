import type { RenderedTemplate } from "../lib/templates/types";

type Props = {
  rendered: RenderedTemplate;
  title: string;
  className?: string;
  width?: number | "full";
  height?: number | "100%" | string;
};

export function PreviewFrame({
  rendered,
  title,
  className,
  width = "full",
  height = 320,
}: Props) {
  const baseStyle = `
  <style>
  :root { color-scheme: light; }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
  margin: 0;
  padding: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  }
  </style>
  `;

  const srcDoc = `<!doctype html>
  <html lang="pt-BR">
  <head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${baseStyle}
  ${rendered.css ? `<style>${rendered.css}</style>` : ""}
  </head>
  <body>
  ${rendered.html}
  ${rendered.js ? `<script>${rendered.js}</script>` : ""}
  </body>
  </html>`;

  const heightStyle = height === "100%" ? "100%" : typeof height === "string" ? height : `${height}px`;

  return (
    <iframe
      title={title}
      className={[
        "block border border-border/50 bg-white",
        className ?? "",
      ].join(" ")}
      style={{
        width: width === "full" ? "100%" : width,
        height: heightStyle,
      }}
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
    />
  );
}
