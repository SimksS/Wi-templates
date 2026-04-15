import { AppHeader } from "./components/AppHeader";
import { TemplateCard } from "./components/TemplateCard";
import { previewTemplate, templates } from "./lib/templates/registry2";

export default function Home() {
  return (
    <div className="min-h-full">
      <AppHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      
      </section>

      {/* Templates Grid */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-medium tracking-tight text-foreground">
                Escolha seu template
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique em um template para visualizar e personalizar
              </p>
            </div>
          </div>

          {templates.length === 0 ? (
            <div className="card-premium flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground">Nenhum template disponível</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adicione templates para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((t, index) => (
                <TemplateCard
                  key={t.id}
                  meta={t}
                  preview={previewTemplate(t)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 bg-secondary/30 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              WiTemplates — Gerador de HTML profissional
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground">Templates atualizados automaticamente</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
