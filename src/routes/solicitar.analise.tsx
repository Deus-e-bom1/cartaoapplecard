import { createFileRoute, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";
import "@/lib/offer";

export const Route = createFileRoute("/solicitar/analise")({
  head: () => ({ meta: [
    { title: "Apple Card — Analisando sua solicitação" },
    { name: "description", content: "Acompanhe a análise da sua solicitação do Apple Card." },
    { property: "og:title", content: "Apple Card — Analisando sua solicitação" },
    { property: "og:description", content: "Acompanhe a análise da sua solicitação do Apple Card." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Analise,
});

const etapas = [
  { label: "Consultando base de dados", titulo: "Consultando base de dados..." },
  { label: "Analisando perfil financeiro", titulo: "Analisando perfil financeiro..." },
  { label: "Verificando elegibilidade", titulo: "Verificando elegibilidade..." },
  { label: "Preparando sua oferta", titulo: "Preparando sua oferta personalizada..." },
];
const STEP_MS = 2200;

function Analise() {
  const consulta = useLocation({ select: (l) => l.state.consulta });
  const quizAnswers = useLocation({ select: (l) => l.state.quizAnswers });
  const navigate = useNavigate();
  const [atual, setAtual] = useState(0);
  useEffect(() => {
    if (atual >= etapas.length) return;
    const t = setTimeout(() => setAtual((a) => a + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [atual]);
  useEffect(() => {
    if (atual < etapas.length || !consulta || !quizAnswers) return;
    const timer = setTimeout(() => navigate({ to: "/solicitar/chat", state: { consulta, quizAnswers } }), 600);
    return () => clearTimeout(timer);
  }, [atual, consulta, quizAnswers, navigate]);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;
  if (!quizAnswers || quizAnswers.length !== 4) return <Navigate to="/solicitar/quiz" state={{ consulta }} />;
  const concluido = atual >= etapas.length;

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink font-sans text-ink-foreground">
      <main className="relative mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink-foreground/20 bg-ink-card">
          <img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain invert" />
        </div>
        <div aria-hidden="true" className="mt-8 h-11 w-11 animate-spin rounded-full border-2 border-ink-foreground/15 border-r-brand motion-reduce:animate-none" />
        <h1 role="status" className="mt-6 text-center text-lg font-semibold">{concluido ? "Análise concluída!" : etapas[atual]?.titulo}</h1>
        <p className="mt-2 text-center text-xs text-ink-foreground/60">{concluido ? "Encaminhando para seu especialista..." : "Aguarde enquanto processamos sua solicitação"}</p>
        <ul className="mt-8 space-y-3">
          {etapas.map((e, i) => {
            const feito = i < atual;
            const ativo = i === atual;
            return (
              <li key={e.label} className={`flex items-center gap-3 text-sm ${feito ? "text-success" : ativo ? "font-medium text-ink-foreground" : "text-ink-foreground/35"}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${feito ? "bg-success text-ink-foreground" : ativo ? "border-2 border-brand" : "border border-ink-foreground/20"}`}>
                  {feito ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : ativo ? <span className="h-1.5 w-1.5 rounded-full bg-brand" /> : null}
                </span>
                {e.label}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
