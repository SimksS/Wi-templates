"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../components/CodePanel";
import { BuilderTabs } from "./tabs";
import {
  getContainsCompareExample,
  renderContainsCompare,
  toSnippet,
  type ContainsCompareData,
} from "../../lib/templates/registry2";

// --- Types & UI Components ---

type Props = {
  templateName: string;
};

type Item = { title: string; description?: string };

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

export function ContainsCompareBuilder({ templateName }: Props) {
  const [data, setData] = useState<ContainsCompareData>(() => getContainsCompareExample());

  const [containsIds, setContainsIds] = useState<string[]>(() =>
    getContainsCompareExample().containsItems.map(() => crypto.randomUUID())
  );
  const [notContainsIds, setNotContainsIds] = useState<string[]>(() =>
    getContainsCompareExample().notContainsItems.map(() => crypto.randomUUID())
  );

  const centerImageInvalid = useMemo(
    () => isDisallowedImageUrl(data.centerImageUrl),
    [data.centerImageUrl]
  );

  const safeData = useMemo(() => {
    if (!centerImageInvalid) return data;
    return { ...data, centerImageUrl: "" };
  }, [data, centerImageInvalid]);

  const renderedTemplate = useMemo(() => renderContainsCompare(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Configuration Panel */}
      <section className="space-y-6">
        <Card>
          <SectionHeader
            title="Imagem Central"
            description="Adicione a imagem principal do produto"
          />

          <FormGroup>
            <InputLabel>URL da imagem</InputLabel>
            <TextInput
              type="url"
              value={data.centerImageUrl}
              onChange={(v) => setData((d) => ({ ...d, centerImageUrl: v }))}
              placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
            />
            {centerImageInvalid && (
              <p className="text-xs text-destructive mt-1">
                Use uma URL de imagem válida (png/jpg/jpeg/webp/gif/avif).
              </p>
            )}
          </FormGroup>
        </Card>

        <Card>
          <SectionHeader
            title="Contém"
            description="Itens que o produto possui"
          />

          <ListEditor
            items={data.containsItems}
            onChange={(items) => setData((d) => ({ ...d, containsItems: items }))}
            ids={containsIds}
            onIdsChange={setContainsIds}
            variant="success"
          />
        </Card>

        <Card>
          <SectionHeader
            title="Não Contém"
            description="Itens que o produto não possui (diferenciais)"
          />

          <ListEditor
            items={data.notContainsItems}
            onChange={(items) => setData((d) => ({ ...d, notContainsItems: items }))}
            ids={notContainsIds}
            onIdsChange={setNotContainsIds}
            variant="danger"
          />
        </Card>
      </section>

      {/* Preview Panel */}
      <section className="lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
        <BuilderTabs
          preview={{ rendered: renderedTemplate, title: `Preview: ${templateName}` }}
          enablePreviewModal
          htmlPanel={
            <CodePanel
              title="HTML"
              code={snippet.html}
              copyLabel="Copiar"
            />
          }
          cssPanel={
            <CodePanel
              title="CSS"
              code={snippet.css}
              copyLabel="Copiar"
            />
          }
        />
      </section>
    </div>
  );
}

// --- Sub-components ---

function ListEditor({
  items,
  onChange,
  ids,
  onIdsChange,
  variant = "success",
}: {
  items: Item[];
  onChange: (items: Item[]) => void;
  ids: string[];
  onIdsChange: (ids: string[]) => void;
  variant?: "success" | "danger";
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </div>
        <Button
          onClick={() => {
            onChange([...items, { title: "Novo item" }]);
            onIdsChange([...ids, crypto.randomUUID()]);
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <div
            key={ids[idx] ?? `${idx}`}
            className="rounded-xl border border-border bg-card/50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-lg",
                    variant === "success"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600",
                  ].join(" ")}
                >
                  {variant === "success" ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">Item {idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onChange(move(items, idx, idx - 1));
                    onIdsChange(move(ids, idx, idx - 1));
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
                    onChange(move(items, idx, idx + 1));
                    onIdsChange(move(ids, idx, idx + 1));
                  }}
                  disabled={idx === items.length - 1}
                  className="px-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onChange(items.filter((_, i) => i !== idx));
                    onIdsChange(ids.filter((_, i) => i !== idx));
                  }}
                  className="px-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormGroup className="mb-0">
                <InputLabel>Título</InputLabel>
                <TextInput
                  value={it.title}
                  onChange={(v) =>
                    onChange(items.map((x, i) => (i === idx ? { ...x, title: v } : x)))
                  }
                  placeholder="Ex: Sem conservantes"
                />
              </FormGroup>

              <FormGroup className="mb-0">
                <InputLabel>Descrição (opcional)</InputLabel>
                <TextInput
                  value={it.description ?? ""}
                  onChange={(v) =>
                    onChange(
                      items.map((x, i) => (i === idx ? { ...x, description: v || undefined } : x))
                    )
                  }
                  placeholder="Detalhes adicionais"
                />
              </FormGroup>
            </div>
          </div>
        ))}
      </div>
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
