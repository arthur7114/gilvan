import Image from "next/image";
import { Clock3, Gift, MapPin, ShieldCheck } from "lucide-react";
import { getPixelId } from "@/lib/db";
import { MetaPixel } from "@/components/meta-pixel";
import { SurveyForm } from "@/components/survey-form";

// A página é cacheada e revalidada periodicamente; alterar o Pixel no painel
// revalida "/" na hora, então nenhuma visita paga consulta ao banco.
export const revalidate = 300;

export default async function Home() {
  const pixelId = await getPixelId();

  return (
    <main>
      <MetaPixel pixelId={pixelId} />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Conecta Cidades — início">
          <Image src="/logo-conecta-cidades.png" alt="Conecta Cidades" width={1178} height={511} priority />
        </a>
        <span className="edition">Edição histórica · 130 anos</span>
      </header>

      <section className="campaign-hero" id="inicio">
        <div className="hero-copy">
          <p className="hero-city">Cruz das Almas está escolhendo</p>
          <h1>Quais empresas são a cara de Cruz das Almas?</h1>
          <p className="hero-lead">
            Quem vive a cidade conhece quem faz a diferença. Participe da escolha das empresas que mais representam
            Cruz das Almas na opinião da população.
          </p>
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
              src="/criativo-conecta-cidades.png"
              alt="Criativo da campanha Cruz das Almas está escolhendo"
              width={1024}
              height={1536}
              priority
              sizes="(max-width: 900px) 82vw, 36vw"
            />
          </div>
          <figcaption><MapPin size={16} /> Uma homenagem à história que construímos juntos.</figcaption>
        </figure>
      </section>

      <section className="institutional-line" aria-label="Manifesto da campanha">
        <p>A identidade de uma cidade também é construída pelas empresas que fazem parte da sua história.</p>
      </section>

      <section className="survey-section" id="pesquisa">
        <div className="survey-intro">
          <h2>Faça parte desta escolha</h2>
          <p>Não existem respostas certas. Queremos saber quais nomes vêm primeiro à sua memória.</p>
        </div>
        <SurveyForm pixelId={pixelId} />
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
