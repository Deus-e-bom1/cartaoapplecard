import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";

const steps = [
  ["Ativando Apple Pay Wallet...", "Ativando Apple Pay..."],
  ["Configurando limite de crédito...", "Configurando limite..."],
  ["Personalizando seu cartão...", "Personalizando cartão..."],
  ["Preparando Dashboard...", "Preparando Dashboard..."],
  ["Finalizando ativação...", "Quase pronto!"],
];

// This is a transient visual sequence, not a request to Apple or a bank.
export function ActivationProgress({ onComplete }: { onComplete?: () => void }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= steps.length) return;
    const timer = window.setTimeout(() => {
      setCompleted(value => value + 1);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [completed]);

  useEffect(() => {
    if (completed < steps.length || !onComplete) return;
    const timer = window.setTimeout(onComplete, 900);
    return () => window.clearTimeout(timer);
  }, [completed, onComplete]);

  return <div className="w-full max-w-md px-5">
    <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-ink-foreground/5">
      <div className="absolute -inset-2 rounded-full border border-ink-foreground/5" />
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ink-foreground/5">
        <img src={appleLogo.url} alt="Apple" className="h-8 w-8 brightness-0 invert opacity-80" />
      </div>
    </div>
    <ol aria-label="Ativação do Apple Card" className="mx-auto flex w-fit max-w-full flex-col gap-3.5">
      {steps.map(([label], index) => {
        const done = index < completed;
        const active = index === completed;
        return <li key={label} aria-current={active ? "step" : undefined} className={`flex items-center gap-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${done ? "text-success" : active ? "text-ink-foreground" : "text-ink-foreground/30"}`}>
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? "border-success bg-success/10" : active ? "border-brand bg-brand/10 text-brand" : "border-ink-foreground/10"}`}>
            {done ? <Check className="h-4 w-4" aria-hidden="true" /> : active ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <span className="text-xs">{index + 1}</span>}
          </span>
          <span>{label}</span>
        </li>;
      })}
    </ol>
    <div className="mt-7 h-1 overflow-hidden rounded-full bg-ink-foreground/10" role="progressbar" aria-label="Progresso da ativação" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completed * 20}>
      <div className="activation-progress h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${completed * 20}%` }} />
    </div>
    <p role="status" aria-live="polite" className="mt-3 text-center text-xs font-medium text-ink-foreground/45">{steps[completed]?.[1] ?? "Conta ativada com sucesso!"}</p>
  </div>;
}