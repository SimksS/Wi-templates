"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../components/CodePanel";
import { BuilderTabs } from "./tabs";
import {
  getAttributesDetailsBarExample,
  renderAttributesDetailsBar,
  toSnippet,
  type AttributesDetailsBarData,
} from "../../lib/templates/registry2";

// --- Types & UI Components ---

type Props = { templateName: string };

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-2">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "url";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

function FormGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Button({
  onClick,
  children,
  variant = "primary",
  disabled,
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "btn-press inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function AttributesDetailsBarBuilder({ templateName }: Props) {
  const [data, setData] = useState<AttributesDetailsBarData>(() =>
    getAttributesDetailsBarExample()
  );
  const [attributeIds, setAttributeIds] = useState<string[]>(() =>
    getAttributesDetailsBarExample().attributes.map(() => crypto.randomUUID())
  );
  const [detailIds, setDetailIds] = useState<string[]>(() =>
    getAttributesDetailsBarExample().detailsItems.map(() => crypto.randomUUID())
  );

  const invalidIconIndexes = useMemo(() => {
    return new Set(
      data.attributes
        .map((a, idx) => ({ a, idx }))
        .filter(({ a }) => isDisallowedImageUrl(a.iconUrl))
        .map(({ idx }) => idx)
    );
  }, [data.attributes]);

  const safeData = useMemo(() => {
    const placeholder = getAttributesDetailsBarExample().attributes[0]?.iconUrl ?? "";
    return {
      ...data,
      attributes: data.attributes.map((a, idx) =>
        invalidIconIndexes.has(idx) ? { ...a, iconUrl: placeholder } : a
      ),
    };
  }, [data, invalidIconIndexes]);

  const renderedTemplate = useMemo(
    () => renderAttributesDetailsBar(safeData),
    [safeData]
  );
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Configuration Panel */}
      <section className="space-y-6">
        {/* Attributes Section */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Atributos
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.attributes.length} {data.attributes.length === 1 ? "item" : "itens"}
              </p>
            </div>
            <Button
              onClick={() => {
                setData((d) => ({
                  ...d,
                  attributes: [...d.attributes, { iconUrl: "", label: "Novo atributo" }],
                }));
                setAttributeIds((ids) => [...ids, crypto.randomUUID()]);
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {data.attributes.map((attr, idx) => (
              <div
                key={attributeIds[idx] ?? `${idx}`}
                className="rounded-xl border border-border bg-card/50 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      Atributo {idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          attributes: move(d.attributes, idx, idx - 1),
                        }));
                        setAttributeIds((ids) => move(ids, idx, idx - 1));
                      }}
                      disabled={idx === 0}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          attributes: move(d.attributes, idx, idx + 1),
                        }));
                        setAttributeIds((ids) => move(ids, idx, idx + 1));
                      }}
                      disabled={idx === data.attributes.length - 1}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          attributes: d.attributes.filter((_, i) => i !== idx),
                        }));
                        setAttributeIds((ids) => ids.filter((_, i) => i !== idx));
                      }}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormGroup className="mb-0">
                    <InputLabel>URL do ícone</InputLabel>
                    <TextInput
                      type="url"
                      value={attr.iconUrl}
                      onChange={(v) =>
                        setData((d) => ({
                          ...d,
                          attributes: d.attributes.map((a, i) =>
                            i === idx ? { ...a, iconUrl: v } : a
                          ),
                        }))
                      }
                      placeholder="https://..."
                    />
                    {invalidIconIndexes.has(idx) && (
                      <p className="text-xs text-destructive">
                        Formato de imagem inválido.
                      </p>
                    )}
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <InputLabel>Texto</InputLabel>
                    <TextInput
                      value={attr.label}
                      onChange={(v) =>
                        setData((d) => ({
                          ...d,
                          attributes: d.attributes.map((a, i) =>
                            i === idx ? { ...a, label: v } : a
                          ),
                        }))
                      }
                      placeholder="Ex: 100% Natural"
                    />
                  </FormGroup>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Details Section */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Detalhes
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.detailsItems.length} {data.detailsItems.length === 1 ? "item" : "itens"}
              </p>
            </div>
            <Button
              onClick={() => {
                setData((d) => ({
                  ...d,
                  detailsItems: [
                    ...d.detailsItems,
                    { title: "Novo título", description: "Nova descrição" },
                  ],
                }));
                setDetailIds((ids) => [...ids, crypto.randomUUID()]);
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {data.detailsItems.map((it, idx) => (
              <div
                key={detailIds[idx] ?? `${idx}`}
                className="rounded-xl border border-border bg-card/50 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      Item {idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          detailsItems: move(d.detailsItems, idx, idx - 1),
                        }));
                        setDetailIds((ids) => move(ids, idx, idx - 1));
                      }}
                      disabled={idx === 0}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          detailsItems: move(d.detailsItems, idx, idx + 1),
                        }));
                        setDetailIds((ids) => move(ids, idx, idx + 1));
                      }}
                      disabled={idx === data.detailsItems.length - 1}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setData((d) => ({
                          ...d,
                          detailsItems: d.detailsItems.filter((_, i) => i !== idx),
                        }));
                        setDetailIds((ids) => ids.filter((_, i) => i !== idx));
                      }}
                      className="px-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  <FormGroup className="mb-0">
                    <InputLabel>Título</InputLabel>
                    <TextInput
                      value={it.title}
                      onChange={(v) =>
                        setData((d) => ({
                          ...d,
                          detailsItems: d.detailsItems.map((x, i) =>
                            i === idx ? { ...x, title: v } : x
                          ),
                        }))
                      }
                      placeholder="Ex: Qualidade Superior"
                    />
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <InputLabel>Descrição</InputLabel>
                    <TextArea
                      value={it.description}
                      onChange={(v) =>
                        setData((d) => ({
                          ...d,
                          detailsItems: d.detailsItems.map((x, i) =>
                            i === idx ? { ...x, description: v } : x
                          ),
                        }))
                      }
                      placeholder="Descreva o detalhe..."
                      rows={3}
                    />
                  </FormGroup>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Preview Panel */}
      <section className="lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
        <BuilderTabs
          preview={{ rendered: renderedTemplate, title: `Preview: ${templateName}` }}
          enablePreviewModal
          htmlPanel={
            <CodePanel title="HTML" code={snippet.html} copyLabel="Copiar" />
          }
          cssPanel={
            <CodePanel title="CSS" code={snippet.css} copyLabel="Copiar" />
          }
        />
      </section>
    </div>
  );
}

// --- Utilities ---

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function isDisallowedImageUrl(url: string) {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.startsWith("data:image/svg+xml")) return true;
  if (u.endsWith(".svg")) return true;
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
  return !allowed.some((ext) => u.includes(ext));
}
