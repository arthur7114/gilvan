"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, Plus, Sparkles } from "lucide-react";
import { identityQuestions, segments, type SurveyPayload } from "@/lib/types";

const stepLabels = ["Identidade", "Segmentos", "Grande escolha", "Contato"];
const segmentHints: Record<string, string> = {
  Gastronomia: "Bares, restaurantes, cafeterias, padarias, pizzarias e similares",
  Saúde: "Clínicas, hospitais, laboratórios, consultórios e similares",
  Moda: "Lojas de roupas, calçados, acessórios e similares",
};

const initialForm: SurveyPayload = {
  name: "",
  whatsapp: "",
  email: "",
  neighborhood: "",
  identityAnswers: identityQuestions.map((question) => ({ question, answer: "" })),
  segmentAnswers: segments.map((segment) => ({ segment, companies: ["", "", ""] })),
  postcardCompany: "",
  postcardReason: "",
  consent: false,
  source: {},
};

function Field({ label, name, value, onChange, placeholder, type = "text", autoComplete, error }: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <small className="field-error" id={`${name}-error`}>{error}</small>}
    </label>
  );
}

export function SurveyForm({ pixelId }: { pixelId: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SurveyPayload>(initialForm);
  const [visibleCompanies, setVisibleCompanies] = useState<number[]>(() => segments.map(() => 1));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const started = useRef(false);

  const progress = useMemo(() => ((step + 1) / stepLabels.length) * 100, [step]);

  function track(event: string, params: Record<string, string | number> = {}) {
    if (!pixelId || !window.fbq) return;
    window.fbq("trackCustom", event, params);
  }

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("PesquisaIniciada");
  }

  function update<K extends keyof SurveyPayload>(key: K, value: SurveyPayload[K]) {
    markStarted();
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [String(key)]: "" }));
  }

  function revealCompany(segmentIndex: number) {
    setVisibleCompanies((current) =>
      current.map((count, index) => (index === segmentIndex ? Math.min(count + 1, 3) : count)),
    );
  }

  function validateStep(currentStep: number) {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 0 && form.identityAnswers[0].answer.trim().length < 2) {
      nextErrors.identity0 = "Esta é a principal pergunta da pesquisa.";
    }
    if (currentStep === 2 && form.postcardCompany.trim().length < 2) {
      nextErrors.postcardCompany = "Informe a empresa escolhida.";
    }
    if (currentStep === 3) {
      if (form.name.trim().length < 2) nextErrors.name = "Informe seu nome.";
      if (form.whatsapp.replace(/\D/g, "").length < 8) nextErrors.whatsapp = "Informe um WhatsApp válido.";
      if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        nextErrors.email = "Informe um e-mail válido ou deixe em branco.";
      }
      if (!form.consent) nextErrors.consent = "Confirme o uso dos dados para enviar sua participação.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    track("PesquisaEtapa", { step: step + 1, step_name: stepLabels[step] });
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
    document.querySelector(".survey-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function previousStep() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
    document.querySelector(".survey-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(3)) return;
    setSubmitting(true);
    setSubmitError("");

    const params = new URLSearchParams(window.location.search);
    const source = Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]
        .map((key) => [key, params.get(key) ?? ""])
        .filter(([, value]) => value),
    );

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source, companyWebsite }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar sua resposta.");

      track("PesquisaEtapa", { step: 4, step_name: stepLabels[3] });
      if (pixelId && window.fbq) {
        window.fbq("track", "Lead", { content_name: "Pesquisa Conecta Cidades — Cruz das Almas" }, { eventID: result.id });
      }
      setSubmitted(true);
      document.querySelector(".survey-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      track("PesquisaFalhaEnvio");
      setSubmitError(error instanceof Error ? error.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="survey-card success-state" role="status">
        <div className="success-seal"><CheckCircle2 size={42} /></div>
        <p className="success-overline">Participação registrada</p>
        <h2>Obrigado por ser a voz de Cruz das Almas.</h2>
        <p>Sua opinião ajuda a valorizar as empresas que constroem a identidade da nossa cidade.</p>
        <div className="success-note">
          <Sparkles size={20} />
          <span>Acompanhe os próximos conteúdos e o desenvolvimento deste projeto pelo Instagram do Conecta Cidades.</span>
        </div>
      </div>
    );
  }

  return (
    <form className="survey-card" onSubmit={submit} noValidate>
      <div className="form-progress">
        <div className="progress-copy"><span>Etapa {step + 1} de {stepLabels.length}</span><strong>{stepLabels[step]}</strong></div>
        <div className="progress-track" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
        <ol aria-label="Etapas da pesquisa">
          {stepLabels.map((label, index) => (
            <li key={label} className={index === step ? "active" : index < step ? "done" : ""} aria-current={index === step ? "step" : undefined}>
              <span>{index < step ? <Check size={14} /> : index + 1}</span>{label}
            </li>
          ))}
        </ol>
      </div>

      <div className="form-body">
        {step === 0 && (
          <fieldset>
            <legend>A identidade da cidade</legend>
            <p className="fieldset-help">Responda de forma espontânea. Uma empresa por pergunta. Só a primeira é obrigatória.</p>
            <div className="question-stack">
              {form.identityAnswers.map((item, index) => (
                <label className="question-field" key={item.question}>
                  <span><b>{index + 1}</b>{item.question}</span>
                  <input
                    value={item.answer}
                    onChange={(event) => {
                      const identityAnswers = [...form.identityAnswers];
                      identityAnswers[index] = { ...item, answer: event.target.value };
                      update("identityAnswers", identityAnswers);
                      if (index === 0) setErrors((current) => ({ ...current, identity0: "" }));
                    }}
                    placeholder="Digite o nome da empresa"
                    autoCapitalize="words"
                    aria-invalid={index === 0 && Boolean(errors.identity0)}
                  />
                  {index === 0 && errors.identity0 && <small className="field-error">{errors.identity0}</small>}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend>Os segmentos</legend>
            <p className="fieldset-help">Em cada segmento abaixo, cite até três empresas que primeiro vêm à sua mente. Se não conhecer algum, pode deixar em branco.</p>
            <div className="segments-list">
              {form.segmentAnswers.map((item, segmentIndex) => (
                <details key={item.segment} open={segmentIndex === 0}>
                  <summary><span>{item.segment}</span><small>{segmentHints[item.segment] ?? "Até três empresas"}</small></summary>
                  <div className="company-inputs">
                    {item.companies.slice(0, visibleCompanies[segmentIndex]).map((company, companyIndex) => (
                      <label key={companyIndex}>
                        <span>Empresa {companyIndex + 1}</span>
                        <input
                          value={company}
                          onChange={(event) => {
                            const segmentAnswers = [...form.segmentAnswers];
                            const companies = [...item.companies];
                            companies[companyIndex] = event.target.value;
                            segmentAnswers[segmentIndex] = { ...item, companies };
                            update("segmentAnswers", segmentAnswers);
                          }}
                          placeholder="Nome da empresa"
                          autoCapitalize="words"
                        />
                      </label>
                    ))}
                  </div>
                  {visibleCompanies[segmentIndex] < 3 && (
                    <button type="button" className="add-company" onClick={() => revealCompany(segmentIndex)}>
                      <Plus size={15} /> Citar outra empresa
                    </button>
                  )}
                </details>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend>A grande escolha</legend>
            <p className="fieldset-help">A última escolha da pesquisa.</p>
            <label className="field featured-field">
              <span>Se hoje fosse criado um Cartão-Postal Empresarial de Cruz das Almas, qual empresa você escolheria para representar a cidade?</span>
              <input
                value={form.postcardCompany}
                onChange={(event) => update("postcardCompany", event.target.value)}
                placeholder="Nome da empresa"
                autoCapitalize="words"
                aria-invalid={Boolean(errors.postcardCompany)}
              />
              {errors.postcardCompany && <small className="field-error">{errors.postcardCompany}</small>}
            </label>
            <label className="field">
              <span>Quer contar o motivo da escolha? (opcional)</span>
              <textarea value={form.postcardReason} onChange={(event) => update("postcardReason", event.target.value)} placeholder="Conte o que torna essa empresa especial para a cidade..." rows={5} />
              <small className="character-count">{form.postcardReason.length}/1200</small>
            </label>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend>Só falta seu contato</legend>
            <p className="fieldset-help">Suas respostas estão prontas. O contato identifica sua participação e permite avisar você caso seja contemplado.</p>
            <div className="field-grid">
              <Field label="Nome completo" name="name" value={form.name} onChange={(value) => update("name", value)} placeholder="Como podemos chamar você?" autoComplete="name" error={errors.name} />
              <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={(value) => update("whatsapp", value)} placeholder="(75) 99999-9999" type="tel" autoComplete="tel" error={errors.whatsapp} />
              <Field label="E-mail (opcional)" name="email" value={form.email} onChange={(value) => update("email", value)} placeholder="voce@email.com" type="email" autoComplete="email" error={errors.email} />
              <Field label="Bairro (opcional)" name="neighborhood" value={form.neighborhood} onChange={(value) => update("neighborhood", value)} placeholder="Em qual bairro você mora?" autoComplete="address-level3" error={errors.neighborhood} />
            </div>
            <label className={`consent ${errors.consent ? "has-error" : ""}`}>
              <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} />
              <span>Concordo com o uso dos meus dados exclusivamente para esta pesquisa, contato sobre a premiação e comunicações do projeto Conecta Cidades.</span>
            </label>
            {errors.consent && <small className="field-error consent-error">{errors.consent}</small>}
            {submitError && <div className="submit-error" role="alert">{submitError}</div>}
          </fieldset>
        )}
      </div>

      <div className="form-actions">
        {step > 0 ? <button type="button" className="secondary-button" onClick={previousStep}><ArrowLeft size={18} /> Voltar</button> : <span />}
        {step < stepLabels.length - 1 ? (
          <button type="button" className="next-button" onClick={nextStep}>Continuar <ArrowRight size={18} /></button>
        ) : (
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? <><LoaderCircle className="spin" size={19} /> Salvando...</> : <>Registrar minha escolha <Check size={19} /></>}
          </button>
        )}
      </div>
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
  );
}
