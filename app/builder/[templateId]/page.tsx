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
    <div className="min-h-full">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-10 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Templates
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-foreground">{meta.name}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {meta.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {meta.description}
              </p>
            </div>

            {meta.category && (
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
                {meta.category}
              </span>
            )}
          </div>
        </div>

        {/* Builder Content */}
        <def.Builder templateName={meta.name} />
      </main>
    </div>
  );
}
