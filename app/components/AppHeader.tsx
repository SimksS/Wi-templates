import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WiTemplates"
            width={140}
            height={32}
            priority
            className="h-7 w-auto"
          />
          <span className="sr-only">WiTemplates</span>
        </Link>

        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <span className="hidden sm:inline">Gerador de HTML por templates</span>
        </div>
      </div>
    </header>
  );
}

