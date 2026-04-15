"use client";

import { useMemo, useState } from "react";

import { CodePanel } from "../../components/CodePanel";
import { BuilderTabs } from "./tabs";
import {
  getComparisonTableExample,
  renderComparisonTable,
  toSnippet,
  type ComparisonRow,
  type ComparisonTableData,
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

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-lg border border-border bg-white px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
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

// --- Main Builder ---

export function ComparisonTableBuilder({ templateName }: Props) {
  const [data, setData] = useState<ComparisonTableData>(() => getComparisonTableExample());
  const [rowIds, setRowIds] = useState<string[]>(() =>
    getComparisonTableExample().rows.map(() => crypto.randomUUID())
  );

  const logoInvalid = useMemo(() => isDisallowedImageUrl(data.logoUrl), [data.logoUrl]);
  const brandInvalid = useMemo(() => isDisallowedImageUrl(data.brandImageUrl), [data.brandImageUrl]);
  const compInvalid = useMemo(() => isDisallowedImageUrl(data.competitorImageUrl), [data.competitorImageUrl]);

  const safeData = useMemo(() => {
    return {
      ...data,
      logoUrl: logoInvalid ? "" : data.logoUrl,
      brandImageUrl: brandInvalid ? "" : data.brandImageUrl,
      competitorImageUrl: compInvalid ? "" : data.competitorImageUrl,
    };
  }, [data, logoInvalid, brandInvalid, compInvalid]);

  const renderedTemplate = useMemo(() => renderComparisonTable(safeData), [safeData]);
  const snippet = useMemo(() => toSnippet(renderedTemplate), [renderedTemplate]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Configuration Panel */}
      <section className="space-y-6">
        <Card>
          <SectionHeader
            title="Conteúdo Principal"
            description="Configure os dados exibidos no template"
          />

          <div className="space-y-5">
            <FormGroup>
              <InputLabel>Título</InputLabel>
              <TextInput
                value={data.title}
                onChange={(v) => setData((d) => ({ ...d, title: v }))}
                placeholder="Ex: Por que escolher nosso produto?"
              />
            </FormGroup>

            <FormGroup>
              <InputLabel>Subtítulo</InputLabel>
              <TextInput
                value={data.subtitle}
                onChange={(v) => setData((d) => ({ ...d, subtitle: v }))}
                placeholder="Ex: Veja a diferença em detalhes"
              />
            </FormGroup>

            <FormGroup>
              <InputLabel>Logo da marca</InputLabel>
              <div className="relative">
                <TextInput
                  type="url"
                  value={data.logoUrl}
                  onChange={(v) => setData((d) => ({ ...d, logoUrl: v }))}
                  placeholder="https://... (png/jpg/jpeg/webp/gif/avif)"
                />
              </div>
              {logoInvalid && (
                <p className="text-xs text-destructive">
                  Use uma URL de imagem válida (png/jpg/jpeg/webp/gif/avif).
                </p>
              )}
            </FormGroup>
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Configuração da Tabela"
            description="Defina os cabeçalhos e imagens da comparação"
          />

          <div className="space-y-5">
            <FormGroup>
              <InputLabel>Cabeçalho da coluna (Marca)</InputLabel>
              <div className="flex items-center gap-3">
                <Select
                  value={data.brandHeaderMode}
                  onChange={(v) => setData((d) => ({ ...d, brandHeaderMode: v as "text" | "logo" }))}
                  options={[
                    { value: "text", label: "Nome da marca" },
                    { value: "logo", label: "Logo" },
                  ]}
                />
                {data.brandHeaderMode === "text" ? (
                  <TextInput
                    value={data.brandName}
                    onChange={(v) => setData((d) => ({ ...d, brandName: v }))}
                    placeholder="Nome da sua marca"
                    className="flex-1"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Usará a URL informada acima
                  </span>
                )}
              </div>
            </FormGroup>

            <FormGroup>
              <InputLabel>Cabeçalho da coluna (Concorrente)</InputLabel>
              <TextInput
                value={data.competitorName}
                onChange={(v) => setData((d) => ({ ...d, competitorName: v }))}
                placeholder="Nome do concorrente"
              />
            </FormGroup>

            <FormGroup>
              <InputLabel>Imagem do produto (Marca)</InputLabel>
              <TextInput
                type="url"
                value={data.brandImageUrl}
                onChange={(v) => setData((d) => ({ ...d, brandImageUrl: v }))}
                placeholder="https://..."
              />
              {brandInvalid && (
                <p className="text-xs text-destructive">Imagem inválida.</p>
              )}
            </FormGroup>

            <FormGroup>
              <InputLabel>Imagem do produto (Concorrente)</InputLabel>
              <TextInput
                type="url"
                value={data.competitorImageUrl}
                onChange={(v) => setData((d) => ({ ...d, competitorImageUrl: v }))}
                placeholder="https://..."
              />
              {compInvalid && (
                <p className="text-xs text-destructive">Imagem inválida.</p>
              )}
            </FormGroup>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Linhas de Comparação</h2>
              <p className="text-sm text-muted-foreground">{data.rows.length} atributos configurados</p>
            </div>
            <Button
              onClick={() => {
                setData((d) => ({
                  ...d,
                  rows: [
                    ...d.rows,
                    { attribute: "Novo atributo", brand: { kind: "text", value: "-" }, competitor: { kind: "text", value: "-" } },
                  ],
                }));
                setRowIds((ids) => [...ids, crypto.randomUUID()]);
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {data.rows.map((row, idx) => (
              <ComparisonRowCard
                key={rowIds[idx] ?? `${idx}`}
                row={row}
                idx={idx}
                totalRows={data.rows.length}
                onMoveUp={() => {
                  setData((d) => ({ ...d, rows: move(d.rows, idx, idx - 1) }));
                  setRowIds((ids) => move(ids, idx, idx - 1));
                }}
                onMoveDown={() => {
                  setData((d) => ({ ...d, rows: move(d.rows, idx, idx + 1) }));
                  setRowIds((ids) => move(ids, idx, idx + 1));
                }}
                onDelete={() => {
                  setData((d) => ({ ...d, rows: d.rows.filter((_, i) => i !== idx) }));
                  setRowIds((ids) => ids.filter((_, i) => i !== idx));
                }}
                onUpdate={(patch) => updateRow(setData, idx, patch)}
              />
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

function ComparisonRowCard({
  row,
  idx,
  totalRows,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: {
  row: ComparisonRow;
  idx: number;
  totalRows: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<ComparisonRow>) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            {idx + 1}
          </span>
          <span className="text-sm font-medium text-foreground">Linha {idx + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onMoveUp} disabled={idx === 0} className="px-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </Button>
          <Button variant="ghost" onClick={onMoveDown} disabled={idx === totalRows - 1} className="px-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button variant="danger" onClick={onDelete} className="px-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Attribute Input */}
      <FormGroup>
        <InputLabel>Atributo</InputLabel>
        <TextInput
          value={row.attribute}
          onChange={(v) => onUpdate({ attribute: v })}
          placeholder="Ex: Proteína, Calorias, etc."
        />
      </FormGroup>

      {/* Values Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ValueEditor
          label="Sua Marca"
          value={row.brand}
          onChange={(v) => onUpdate({ brand: v })}
        />
        <ValueEditor
          label={row.competitorName || "Concorrente"}
          value={row.competitor}
          onChange={(v) => onUpdate({ competitor: v })}
        />
      </div>
    </div>
  );
}

function ValueEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ComparisonRow["brand"];
  onChange: (v: ComparisonRow["brand"]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <select
          value={value.kind}
          onChange={(e) => {
            const kind = e.target.value as "text" | "boolean";
            onChange(kind === "text" ? { kind: "text", value: "" } : { kind: "boolean", value: true });
          }}
          className="h-8 rounded-lg border-border bg-secondary px-2 text-xs font-medium text-secondary-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="text">Texto</option>
          <option value="boolean">Sim/Não</option>
        </select>
      </div>

      {value.kind === "text" ? (
        <TextInput
          value={value.value}
          onChange={(v) => onChange({ kind: "text", value: v })}
          placeholder="Valor"
        />
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant={value.value ? "primary" : "secondary"}
            onClick={() => onChange({ kind: "boolean", value: true })}
            className="flex-1 py-1.5"
          >
            <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sim
          </Button>
          <Button
            variant={!value.value ? "primary" : "secondary"}
            onClick={() => onChange({ kind: "boolean", value: false })}
            className="flex-1 py-1.5"
          >
            <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Não
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Utilities ---

function updateRow(
  setData: React.Dispatch<React.SetStateAction<ComparisonTableData>>,
  idx: number,
  patch: Partial<ComparisonRow>
) {
  setData((d) => ({
    ...d,
    rows: d.rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
  }));
}

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
