import type { Metadata } from "next";
import { Barlow, Bebas_Neue } from "next/font/google";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const display = Bebas_Neue({ subsets: ["latin"], variable: "--font-display", weight: "400" });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Conecta Cidades",
  description: "Pesquisas públicas que valorizam as empresas que constroem a identidade das cidades.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${body.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
