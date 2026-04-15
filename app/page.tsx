import { AppHeader } from "./components/AppHeader";
import { TemplateCard } from "./components/TemplateCard";
import { previewTemplate, templates } from "./lib/templates/registry2";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 font-sans text-zinc-950">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Escolha um template
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            Selecione um modelo e visualize uma prévia com valores de exemplo.
            Depois, no builder, você preenche o formulário e copia o HTML pronto.
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-700">
            Nenhum template disponível no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((t) => {
              return (
                <TemplateCard key={t.id} meta={t} preview={previewTemplate(t)} />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
