import type { Metadata } from "next";
import { YahSurvey } from "@/components/yah-survey";
import { getPixelId } from "@/lib/db";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pesquisa Rápida | YAH Aquapark",
  description: "Responda três perguntas rápidas sobre o YAH Aquapark e o Cartão Black.",
  alternates: { canonical: "/yah" },
  openGraph: {
    title: "Pesquisa Rápida — YAH Aquapark",
    description: "Sua opinião em três perguntas rápidas.",
    images: [{ url: "/yah-aquapark-purpose.jpeg", width: 1112, height: 1280 }],
  },
};

export default async function YahPage() {
  const pixelId = await getPixelId();
  return <YahSurvey pixelId={pixelId} />;
}
