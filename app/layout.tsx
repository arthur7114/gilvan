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
  title: "Cruz das Almas está escolhendo | Conecta Cidades",
  description: "Ajude a escolher as empresas que mais representam Cruz das Almas.",
  openGraph: {
    title: "Cruz das Almas está escolhendo",
    description: "A resposta está nas suas mãos. Participe da pesquisa do Conecta Cidades.",
    images: [{ url: "/criativo-conecta-cidades.png", width: 1024, height: 1536 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${body.variable} ${display.variable}`}>
        <template
          data-design-contract="e0938813"
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Uma cédula cívica digital transforma opinião local em legado, recusando o formulário branco e anônimo.
OWN-WORLD: Azul profundo, ouro envelhecido, superfícies de papel oficial e controles firmes de votação.
STORY: O morador reconhece a cidade, entende o valor da escolha e registra sua participação em poucos minutos.
FIRST VIEWPORT: Manifesto e arte da campanha à esquerda; convite, duração e início da pesquisa à direita, com ação dourada visível.
FORM: Cédula cívica contemporânea, direção fixada pelo criativo do usuário; seed e0938813.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
