import { createFileRoute, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Circle, CircleCheck, LoaderCircle, LockKeyhole } from "lucide-react";
import { clearSelfiePhoto, getSelfiePhoto } from "@/lib/selfie-photo";

export const Route = createFileRoute("/solicitar/preparando-selfie")({
  head: () => ({ meta: [
    { title: "Apple Card — Preparando captura" },
    { name: "description", content: "Acompanhe a conclusão da captura de selfie, sem análise biométrica." },
    { property: "og:title", content: "Apple Card — Preparando captura" },
    { property: "og:description", content: "Acompanhe a conclusão da captura de selfie, sem análise biométrica." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PreparandoSelfie,
});

const steps = ["Concluindo captura...", "Encerrando câmera...", "Preparando próxima etapa...", "Finalizando..."];

function PreparandoSelfie() {
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers });
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [photo] = useState(() => getSelfiePhoto());
  useEffect(() => {
    if (!consulta?.nome) return;
    const timer = setTimeout(() => {
      if (step < steps.length - 1) setStep(value => value + 1);
      else {
        clearSelfiePhoto();
        void navigate({ to: "/solicitar/selfie-concluida", replace: true, state: { consulta, quizAnswers: answers ?? [] } });
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, [step, consulta, answers, navigate]);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  return <div className="min-h-svh bg-ink font-sans text-ink-foreground">
    <div className="mx-auto flex min-h-svh max-w-xl flex-col">
      <header className="grid shrink-0 grid-cols-[64px_1fr_64px] items-center px-6 py-4">
        <span />
        <h1 className="text-center text-[13px] font-medium text-ink-foreground/70">Preparando...</h1>
        <span className="flex items-center justify-end gap-1 text-[11px] text-success"><LockKeyhole className="h-3 w-3" /> Seguro</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div aria-hidden="true" className="h-[240px] w-[192px] overflow-hidden rounded-[46%] border-[3px] border-success bg-camera-surface">
          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <ol className="mt-8 space-y-2" aria-label="Progresso da captura" aria-live="polite">
          {steps.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} className={`flex items-center gap-2 text-[13px] ${index < step ? "text-success" : index === step ? "text-brand" : "text-ink-foreground/45"}`}>
            {index < step ? <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> : index === step ? <LoaderCircle className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Circle className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />}
            {label}
          </li>)}
        </ol>
      </main>
    </div>
  </div>;
}