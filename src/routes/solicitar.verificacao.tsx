import { createFileRoute, Link, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Check, ChevronLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelfieCapture } from "@/components/SelfieCapture";

export const Route = createFileRoute("/solicitar/verificacao")({
  head: () => ({ meta: [
    { title: "Apple Card — Verificação facial" },
    { name: "description", content: "Prepare sua selfie para a etapa de verificação de identidade do Apple Card." },
    { property: "og:title", content: "Apple Card — Verificação facial" },
    { property: "og:description", content: "Prepare sua selfie para a etapa de verificação de identidade do Apple Card." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Verificacao,
});

function Verificacao() {
  const navigate = useNavigate();
  const consulta = useLocation({ select: (l) => l.state.consulta });
  const answers = useLocation({ select: (l) => l.state.quizAnswers }) ?? [];
  const [stage, setStage] = useState<"intro" | "camera" | "later">("intro");
  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  return (
    <div className="min-h-svh bg-ink font-sans text-ink-foreground">
      <div className="mx-auto flex min-h-svh max-w-xl flex-col">
        <header className="grid shrink-0 grid-cols-[64px_1fr_64px] items-center px-2 py-3">
          {stage === "intro" ? <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/20"><Link to="/solicitar/chat" state={{ consulta, quizAnswers: answers }} aria-label="Voltar à conversa"><ChevronLeft className="h-4 w-4" /></Link></Button> : <Button variant="ghost" size="icon" onClick={() => setStage("intro")} aria-label="Voltar à introdução" className="h-8 w-8 rounded-full bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/20"><ChevronLeft className="h-4 w-4" /></Button>}
          <p className="text-center text-[13px] font-medium">{stage === "camera" ? "Posicione seu rosto" : "Verificação de Identidade"}</p>
          <span className="flex items-center justify-end gap-1 text-[11px] text-success"><LockKeyhole className="h-3 w-3" /> Seguro</span>
        </header>
        {stage === "camera" ? <SelfieCapture onContinue={() => navigate({ to: "/solicitar/preparando-selfie", state: { consulta, quizAnswers: answers } })} /> : <>
          <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-foreground/10"><Camera className="h-8 w-8 text-ink-foreground/60" aria-hidden="true" /></div>
            <h1 className="mt-4 text-xl font-bold">{stage === "later" ? "Verificação pendente" : "Verificação Facial"}</h1>
            <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-ink-foreground/70">{stage === "later" ? "Você pode voltar para tirar sua selfie. Sua identidade ainda não foi verificada." : "Para garantir sua segurança, precisamos confirmar sua identidade com uma selfie rápida."}</p>
            {stage === "intro" && <ul className="mt-6 w-full max-w-[300px] space-y-3 text-left">{["Procure boa iluminação", "Centralize seu rosto no oval", "Mantenha-se imóvel por 3 segundos"].map(tip => <li key={tip} className="flex min-h-11 items-center gap-3 rounded-xl bg-ink-card px-4 py-3 text-[13px]"><Check className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{tip}</li>)}</ul>}
          </main>
          <footer className="shrink-0 px-2 pb-6 text-center">
            <Button onClick={() => setStage("camera")} className="h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90">Iniciar verificação</Button>
            {stage === "intro" && <Button variant="link" onClick={() => setStage("later")} className="mt-1 h-8 text-xs text-ink-foreground/45 underline">Verificar depois</Button>}
          </footer>
        </>}
      </div>
    </div>
  );
}
