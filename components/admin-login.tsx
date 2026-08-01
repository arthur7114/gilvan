"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.");
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <Link className="admin-brand" href="/">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <span><strong>conecta</strong><small>CIDADES</small></span>
      </Link>
      <form className="login-panel" onSubmit={login}>
        <div className="login-icon"><LockKeyhole size={27} /></div>
        <h1>Painel da pesquisa</h1>
        <p>Acompanhe as respostas de Cruz das Almas e configure sua campanha.</p>
        <label className="field">
          <span>Senha administrativa</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus autoComplete="current-password" placeholder="Digite sua senha" />
        </label>
        {error && <div className="submit-error" role="alert">{error}</div>}
        <button className="admin-login-button" disabled={loading}>
          {loading ? <><LoaderCircle className="spin" size={18} /> Entrando...</> : <>Entrar no painel <ArrowRight size={18} /></>}
        </button>
        {process.env.NODE_ENV === "development" && <small className="local-hint">Ambiente local: senha padrão <b>admin123</b></small>}
      </form>
    </main>
  );
}
