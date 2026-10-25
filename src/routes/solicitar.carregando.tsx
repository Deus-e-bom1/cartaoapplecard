import { createFileRoute, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, Shield } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";

export const Route = createFileRoute("/solicitar/carregando")({
  head: () => ({ meta: [
    { title: "Apple Card — Identidade confirmada" },
    { name: "description", content: "Confirmação dos dados e preparação para o questionário do Apple Card." },
    { property: "og:title", content: "Apple Card — Identidade confirmada" },
    { property: "og:description", content: "Confirmação dos dados e preparação para o questionário do Apple Card." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Carregando,
});

function Carregando() {
  const consulta = useLocation({ select: (location) => location.state.consulta });
  const navigate = useNavigate();

  useEffect(() => {
    if (!consulta?.nome) return;
    const timer = window.setTimeout(() => {
      void navigate({ to: "/solicitar/quiz", replace: true, state: { consulta } });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [consulta, navigate]);

  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col bg-background font-sans">
      <header className="flex h-[66px] shrink-0 items-center justify-center gap-1.5 border-b text-lg font-semibold">
        <img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain" /> Card
      </header>
      <main className="flex-1 px-6">
        <ol aria-label="Etapas da solicitação" className="mt-5 flex items-center justify-center gap-2">
          <li aria-label="Etapa 1: concluída" className="h-2 w-2 rounded-full bg-success" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-success" />
          <li aria-label="Etapa 2: concluída" className="h-2 w-2 rounded-full bg-success" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-success" />
          <li aria-current="step" aria-label="Etapa 3: questionário" className="h-2 w-6 rounded-full bg-success" />
        </ol>
        <div role="status" aria-live="polite" className="loading-entrance mt-8 text-center">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success text-primary-foreground">
            <Check aria-hidden="true" className="h-9 w-9" strokeWidth={3} />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Identidade Verificada</h1>
          <p className="mx-auto mt-2 max-w-[400px] text-[15px] leading-relaxed text-muted-foreground">Seus dados foram confirmados com sucesso. Estamos preparando sua análise.</p>
          <p className="mt-8 text-sm text-muted-foreground">Redirecionando...</p>
          <div aria-hidden="true" className="mt-2 flex justify-center gap-1.5 text-brand">
            {[0, 1, 2].map((dot) => <span key={dot} className={`loading-dot loading-dot-${dot} h-1.5 w-1.5 rounded-full bg-current`} />)}
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-center gap-1.5 px-6 pb-12 pt-8 text-center text-xs text-muted-foreground">
        <Shield aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> Seus dados são protegidos com criptografia de ponta a ponta
      </footer>
    </div>
  );
}