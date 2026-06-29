import type { Metadata } from "next";
import "@fontsource-variable/nunito-sans";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recetario",
  description: "Descubre, guarda y cocina tus recetas favoritas.",
  openGraph: {
    title: "Recetario",
    description: "Descubre, guarda y cocina tus recetas favoritas.",
    locale: "es",
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
      lang="es"
      data-theme="recipebook"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-base-200 text-base-content">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
