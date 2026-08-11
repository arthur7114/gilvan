import type { Metadata } from "next";
import { getSurveyConfig } from "@/lib/campaigns";
import { SurveyPage } from "@/components/survey-page";

const campaign = getSurveyConfig("tutoia");

export const revalidate = 300;

export const metadata: Metadata = {
  title: campaign.metadata.title,
  description: campaign.metadata.description,
  alternates: { canonical: campaign.route },
  openGraph: {
    title: campaign.heroLabel,
    description: campaign.metadata.description,
    images: [{ url: campaign.image.src, width: campaign.image.width, height: campaign.image.height }],
  },
};

export default function TutoiaPage() {
  return <SurveyPage campaign={campaign} />;
}
