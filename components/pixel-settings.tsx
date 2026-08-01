"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

export function PixelSettings({ initialPixelId }: { initialPixelId: string }) {
  const [pixelId, setPixelId] = useState(initialPixelId);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixelId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar.");
      setMessage("Pixel atualizado. As próximas visitas já usarão este ID.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="pixel-form" onSubmit={save}>
      <label className="field">
        <span>ID do Meta Pixel</span>
        <input value={pixelId} onChange={(event) => setPixelId(event.target.value.replace(/\D/g, ""))} placeholder="Ex.: 123456789012345" inputMode="numeric" />
      </label>
      <button disabled={loading || !pixelId}>
        {loading ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />} Salvar Pixel
      </button>
      <small>O evento <b>Lead</b> é enviado somente depois que a participação é salva.</small>
      {message && <p className="settings-success">{message}</p>}
      {error && <p className="settings-error">{error}</p>}
    </form>
  );
}
