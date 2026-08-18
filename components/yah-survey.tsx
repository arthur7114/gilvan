"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { Check, CreditCard, LoaderCircle, Plane, Send, Smartphone, Waves } from "lucide-react";
import { yahContactSchema, yahPrizeOffer, yahQuestions, yahSourceKeys, type YahSurveyPayload } from "@/lib/yah-survey";
import { MetaPixel } from "@/components/meta-pixel";

type Answers = Partial<Pick<YahSurveyPayload, "sescCard" | "knowsPark" | "blackCardInterest">>;
type Contact = { name: string; whatsapp: string; consent: boolean };
const prizeIcons = {
  "black-card": CreditCard,
  "iphone-17": Smartphone,
  "international-flight": Plane,
} as const;

function campaignSource() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    yahSourceKeys.map((key) => [key, params.get(key) ?? ""]).filter(([, value]) => value),
  );
}

export function YahSurvey({ pixelId }: { pixelId: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>({ name: "", whatsapp: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const started = useRef(false);

  function choose(questionId: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setErrors((current) => ({ ...current, [questionId]: "" }));

    if (!started.current && pixelId && window.fbq) {
      started.current = true;
      window.fbq("trackCustom", "PesquisaIniciada", { survey_slug: "yah-aquapark" });
    }
  }

  function updateContact<K extends keyof Contact>(field: K, value: Contact[K]) {
    setContact((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      yahQuestions.filter((question) => !answers[question.id]).map((question) => [question.id, "Escolha uma resposta."]),
    );
    const parsedContact = yahContactSchema.safeParse(contact);
    if (!parsedContact.success) {
      parsedContact.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        nextErrors[field] ??= issue.message;
      });
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.querySelector(".yah-question-error, .yah-contact-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/yah-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, ...contact, source: campaignSource(), companyWebsite }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível registrar suas respostas.");

      if (pixelId && window.fbq) {
        window.fbq("trackCustom", "PesquisaConcluida", { survey_slug: "yah-aquapark" });
        if (answers.blackCardInterest === "yes") {
          window.fbq(
            "track",
            "Lead",
            { content_name: "Cartão Black — YAH Aquapark", survey_slug: "yah-aquapark" },
            { eventID: result.id },
          );
        }
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="yah-page">
      <span
        className="yah-design-contract"
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: "<!-- THESIS: uma pulseira de acesso vira pesquisa em três toques; recusa o formulário corporativo genérico. OWN-WORLD: azul de piscina em escala, coral e amarelo de sinalização, fotografia solar e controles inspirados em pulseiras. STORY: reconhecer o parque, responder e manifestar interesse no Cartão Black. FIRST VIEWPORT: paisagem do litoral à esquerda e a pesquisa completa à direita, com envio visível. FORM: pulseira de acesso, quarta direção fundamentada, seed 2f008023. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->",
        }}
      />
      <MetaPixel pixelId={pixelId} surveySlug="yah-aquapark" campaignName="Pesquisa Rápida — YAH Aquapark" />

      <section className="yah-visual" aria-label="YAH Aquapark no litoral do Piauí">
        <Image
          className="yah-visual-photo"
          src="/yah-aquapark-view.jpeg"
          alt="Toboáguas do YAH Aquapark com vista para o litoral"
          fill
          sizes="(max-width: 860px) 100vw, 48vw"
          priority
        />
        <div className="yah-visual-shade" />
        <header className="yah-brand-lockup">
          <span className="yah-official-logo" role="img" aria-label="YAH Aquapark" />
        </header>
        <div className="yah-visual-copy">
          <h1>Três respostas.<br />Três prêmios.<br />Um verão pela frente.</h1>
          <p>Compartilhe sua opinião e concorra ao pacote de prêmios do YAH Aquapark.</p>
        </div>
        <figure className="yah-black-card-creative" role="img" aria-label="Cartão Black do YAH Aquapark">
          <span>YAH Aquapark</span>
          <strong>Cartão<br />Black</strong>
        </figure>
        <span className="yah-wave-mark" aria-hidden="true"><Waves size={28} /></span>
      </section>

      <section className="yah-survey-panel" aria-labelledby="yah-survey-title">
        {submitted ? (
          <div className="yah-success" role="status">
            <span><Check size={35} strokeWidth={3} /></span>
            <h2>Pesquisa concluída!</h2>
            <p>Obrigado por compartilhar sua opinião. Sua resposta e seu contato foram registrados.</p>
            {answers.blackCardInterest === "yes" ? (
              <strong>Seu interesse foi registrado. O YAH poderá falar com você pelo WhatsApp.</strong>
            ) : (
              <strong>Resposta registrada com sucesso.</strong>
            )}
          </div>
        ) : (
          <form className="yah-form" onSubmit={submit} noValidate>
            <div className="yah-form-heading">
              <div><Waves size={22} /><h2 id="yah-survey-title">Pesquisa Rápida <span>YAH Aquapark</span></h2></div>
              <p>Três perguntas. Leva menos de 1 minuto.</p>
            </div>

            <section className="yah-prize-offer" aria-labelledby="yah-prize-title">
              <header>
                <h3 id="yah-prize-title">{yahPrizeOffer.title}</h3>
                <p>{yahPrizeOffer.description}</p>
              </header>
              <ul>
                {yahPrizeOffer.prizes.map((prize) => {
                  const PrizeIcon = prizeIcons[prize.id];
                  return (
                    <li key={prize.id}>
                      <span aria-hidden="true"><PrizeIcon size={19} strokeWidth={2.2} /></span>
                      <strong>{prize.name}</strong>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="yah-questions">
              {yahQuestions.map((question, index) => (
                <fieldset className={errors[question.id] ? "yah-question has-error" : "yah-question"} key={question.id}>
                  <legend><b>{index + 1}</b><span>{question.question}</span></legend>
                  <div className="yah-options">
                    {question.options.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => choose(question.id, option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors[question.id] && <small className="yah-question-error">{errors[question.id]}</small>}
                </fieldset>
              ))}
            </div>

            <fieldset className="yah-contact">
              <legend>Seu contato para participar</legend>
              <p>Precisamos do seu nome e WhatsApp para identificar sua participação e falar com você sobre a campanha.</p>
              <div className="yah-contact-fields">
                <label>
                  <span>Nome completo</span>
                  <input
                    name="name"
                    value={contact.name}
                    onChange={(event) => updateContact("name", event.target.value)}
                    placeholder="Como podemos chamar você?"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "yah-name-error" : undefined}
                  />
                  {errors.name && <small className="yah-contact-error" id="yah-name-error">{errors.name}</small>}
                </label>
                <label>
                  <span>WhatsApp</span>
                  <input
                    name="whatsapp"
                    value={contact.whatsapp}
                    onChange={(event) => updateContact("whatsapp", event.target.value)}
                    placeholder="(86) 99999-9999"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.whatsapp)}
                    aria-describedby={errors.whatsapp ? "yah-whatsapp-error" : undefined}
                  />
                  {errors.whatsapp && <small className="yah-contact-error" id="yah-whatsapp-error">{errors.whatsapp}</small>}
                </label>
              </div>
              <label className={errors.consent ? "yah-consent has-error" : "yah-consent"}>
                <input
                  type="checkbox"
                  checked={contact.consent}
                  onChange={(event) => updateContact("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "yah-consent-error" : undefined}
                />
                <span>Concordo com o uso dos meus dados pelo YAH Aquapark para identificar minha participação, contato sobre os prêmios, o Cartão Black e comunicações relacionadas ao parque.</span>
              </label>
              {errors.consent && <small className="yah-contact-error" id="yah-consent-error">{errors.consent}</small>}
            </fieldset>

            {submitError && <div className="yah-submit-error" role="alert">{submitError}</div>}
            <button className="yah-submit" type="submit" disabled={submitting}>
              {submitting ? <><LoaderCircle className="spin" size={20} /> Registrando...</> : <>Enviar e concorrer <Send size={19} /></>}
            </button>
            <p className="yah-privacy">Seus dados serão usados somente para as finalidades autorizadas acima.</p>
            <input
              className="honeypot"
              name="companyWebsite"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </form>
        )}
      </section>
    </main>
  );
}
