import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "../../components/AppHeader";
import { templateById, templates } from "../../lib/templates/registry2";

type Props = {
  params: Promise<{ templateId: string }>;
};

export default async function TemplateBuilderPage({ params }: Props) {
  const { templateId } = await params;
  const meta = templates.find((t) => t.id === templateId);
  const def = (templateById as Record<string, (typeof templateById)[keyof typeof templateById] | undefined>)[templateId];

  if (!meta || !def) notFound();

  return (
    <div className="min-h-full bg-zinc-50 font-sans text-zinc-950">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="mb-2">
              <Link
                href="/"
                className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
              >
                ← Voltar para templates
              </Link>
            </div>
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              {meta.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              {meta.description} (estrutura do MVP: formulário real será adicionado
              depois)
            </p>
          </div>
        </div>

        <def.Builder templateName={meta.name} />
      </main>
    </div>
  );
}
