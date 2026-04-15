"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const isBuilder = pathname?.startsWith("/builder/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="mx-auto max-w-6xl glass rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="relative flex h-8 w-32 items-center">
                <Image
                  src="/logo.png"
                  alt="WiTemplates"
                  width={128}
                  height={32}
                  priority
                  className="h-7 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Gerador de HTML profissional
              </span>
              {isBuilder && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 12H5m7-7l-7 7 7 7"
                    />
                  </svg>
                  Templates
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

