import { createFileRoute, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ActivationProgress } from "@/components/ActivationProgress";

export const Route = createFileRoute("/solicitar/ativando")({
  head: () => ({ meta: [
    { title: "Apple Card — Ativando sua conta" },
    { name: "description", content: "Acompanhe as etapas de preparação do seu Apple Card nesta demonstração." },
    { property: "og:title", content: "Apple Card — Ativando sua conta" },
    { property: "og:description", content: "Acompanhe as etapas de preparação do seu Apple Card nesta demonstração." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Ativando,
});

function Ativando() {
  const consulta = useLocation({ select: location => location.state.consulta });
  const quizAnswers = useLocation({ select: location => location.state.quizAnswers }) ?? [];
  const navigate = useNavigate();
  const finish = useCallback(() => {
    if (!consulta?.nome) return;
    void navigate({ to: "/solicitar/wallet", replace: true, state: { consulta, quizAnswers } });
  }, [consulta, quizAnswers, navigate]);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;
  return <main className="flex min-h-svh items-center justify-center bg-ink font-sans text-ink-foreground" aria-label="Ativação do Apple Card">
    <ActivationProgress onComplete={finish} />
  </main>;
}