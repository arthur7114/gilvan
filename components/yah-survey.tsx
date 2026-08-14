"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { Check, LoaderCircle, Send, Waves } from "lucide-react";
import { yahQuestions, yahSourceKeys, type YahSurveyPayload } from "@/lib/yah-survey";
import { MetaPixel } from "@/components/meta-pixel";

type Answers = Partial<Pick<YahSurveyPayload, "sescCard" | "knowsPark" | "blackCardInterest">>;

function campaignSource() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    yahSourceKeys.map((key) => [key, params.get(key) ?? ""]).filter(([, value]) => value),
  );
}

export function YahSurvey({ pixelId }: { pixelId: string }) {
  const [answers, setAnswers] = useState<Answers>({});
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      yahQuestions.filter((question) => !answers[question.id]).map((question) => [question.id, "Escolha uma resposta."]),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.querySelector(".yah-question-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/yah-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, source: campaignSource(), companyWebsite }),
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
          <h1>Três respostas.<br />Um verão inteiro pela frente.</h1>
          <p>Sua opinião ajuda o YAH a entender quem já conhece essa novidade do litoral do Piauí.</p>
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
            <p>Obrigado por compartilhar sua opinião sobre o YAH Aquapark.</p>
            {answers.blackCardInterest === "yes" ? (
              <strong>Seu interesse no Cartão Black foi registrado.</strong>
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

            {submitError && <div className="yah-submit-error" role="alert">{submitError}</div>}
            <button className="yah-submit" type="submit" disabled={submitting}>
              {submitting ? <><LoaderCircle className="spin" size={20} /> Enviando...</> : <>Enviar respostas <Send size={19} /></>}
            </button>
            <p className="yah-privacy">Nenhum dado pessoal é solicitado nesta pesquisa.</p>
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
