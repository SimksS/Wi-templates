import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "WiTemplates — Gerador Profissional de Templates HTML",
  description:
    "Templates HTML de alta qualidade para e-commerce e marketing. Escolha, personalize e copie em segundos.",
  keywords: ["templates HTML", "e-commerce", "marketing", "templates para email"],
  authors: [{ name: "WiTemplates" }],
  openGraph: {
    title: "WiTemplates",
    description: "Templates HTML profissionais para e-commerce",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        {children}
      </body>
    </html>
  );
}
