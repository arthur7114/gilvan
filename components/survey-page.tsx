import Image from "next/image";
import { Clock3, Gift, MapPin, ShieldCheck } from "lucide-react";
import type { SurveyConfig } from "@/lib/campaigns";
import { getPixelId } from "@/lib/db";
import { MetaPixel } from "@/components/meta-pixel";
import { SurveyForm } from "@/components/survey-form";

export async function SurveyPage({ campaign }: { campaign: SurveyConfig }) {
  const pixelId = await getPixelId();

  return (
    <main>
      <MetaPixel pixelId={pixelId} surveySlug={campaign.slug} campaignName={campaign.heroLabel} />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Conecta Cidades — início">
          <Image src="/logo-conecta-cidades.png" alt="Conecta Cidades" width={1178} height={511} priority />
        </a>
        <span className="edition">{campaign.edition}</span>
      </header>

      <section className="campaign-hero" id="inicio">
        <div className="hero-copy">
          <p className="hero-city">{campaign.heroLabel}</p>
          <h1>{campaign.headline}</h1>
          <p className="hero-lead">{campaign.heroLead}</p>
          <a className="primary-cta" href="#pesquisa">Responder à pesquisa <span aria-hidden="true">→</span></a>
          <div className="hero-facts" aria-label="Informações da pesquisa">
            <span><Clock3 size={18} /> Apenas alguns minutos</span>
            <span><Gift size={18} /> Concorra a prêmios</span>
            <span><ShieldCheck size={18} /> Dados protegidos</span>
          </div>
        </div>
        <figure className="campaign-art">
          <div className="poster-frame">
            <Image
              src={campaign.image.src}
              alt={campaign.image.alt}
              width={campaign.image.width}
              height={campaign.image.height}
              priority
              sizes="(max-width: 900px) 82vw, 36vw"
            />
          </div>
          <figcaption><MapPin size={16} /> {campaign.figcaption}</figcaption>
        </figure>
      </section>

      <section className="institutional-line" aria-label="Manifesto da campanha">
        <p>{campaign.institutionalLine}</p>
      </section>

      <section className="survey-section" id="pesquisa">
        <div className="survey-intro">
          <h2>{campaign.surveyTitle}</h2>
          <p>{campaign.surveyIntro}</p>
        </div>
        <SurveyForm campaign={campaign} pixelId={pixelId} />
      </section>

      <footer>
        <div className="brand brand-footer" aria-label="Conecta Cidades">
          <Image src="/logo-conecta-cidades.png" alt="Conecta Cidades" width={1178} height={511} />
        </div>
        <p>Conectando empresas. Fortalecendo cidades. Criando legados.</p>
      </footer>
    </main>
  );
}
