import type { RenderedTemplate } from "../lib/templates/types";

type Props = {
  rendered: RenderedTemplate;
  title: string;
  className?: string;
  width?: number | "full";
  height?: number;
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
      body {
        margin: 0;
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

  return (
    <iframe
      title={title}
      className={[
        "rounded-xl border border-black/10 bg-white",
        className ?? "",
      ].join(" ")}
      style={{
        width: width === "full" ? "100%" : width,
        height,
      }}
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
    />
  );
}

