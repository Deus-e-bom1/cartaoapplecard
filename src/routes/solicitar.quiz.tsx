import { createFileRoute, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Apple, BookOpen, Briefcase, Building2, Check, CircleCheck, Coffee, DollarSign, EllipsisVertical, Heart, Plane, ShoppingCart, Star, Store, TrendingUp, UserRound } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";
import { Button } from "@/components/ui/button";
import { useAnimationReducedMotion } from "@/hooks/use-animation-reduced-motion";
import "@/lib/offer";

export const Route = createFileRoute("/solicitar/quiz")({
  head: () => ({ meta: [
    { title: "Apple Card — Seu objetivo" },
    { name: "description", content: "Selecione seu objetivo com o Apple Card no questionário de solicitação." },
    { property: "og:title", content: "Apple Card — Seu objetivo" },
    { property: "og:description", content: "Selecione seu objetivo com o Apple Card no questionário de solicitação." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Quiz,
});

type Option = { label: string; icon: typeof Apple; color: string };
type Step = { title: string; subtitle: string; aria: string; layout: "grid" | "list" | "pair"; options: Option[] };

const steps: Step[] = [
  { title: "Qual seu objetivo com o Apple Card?", subtitle: "Selecione a opção que melhor representa seu interesse.", aria: "Objetivo com o Apple Card", layout: "grid", options: [
    { label: "Compras Online", icon: ShoppingCart, color: "bg-brand-soft text-brand" },
    { label: "Viagens", icon: Plane, color: "bg-chart-3/10 text-chart-3" },
    { label: "Dia a Dia", icon: Coffee, color: "bg-chart-4/10 text-chart-4" },
    { label: "Apple Products", icon: Apple, color: "bg-chart-2/10 text-chart-2" },
    { label: "Investir em Mim", icon: Star, color: "bg-success/10 text-success" },
    { label: "Outros", icon: EllipsisVertical, color: "bg-destructive/10 text-destructive" },
  ] },
  { title: "Qual sua profissão atual?", subtitle: "Isso nos ajuda a personalizar sua oferta.", aria: "Profissão atual", layout: "list", options: [
    { label: "CLT (Empregado)", icon: Briefcase, color: "bg-brand-soft text-brand" },
    { label: "Autônomo", icon: Store, color: "bg-chart-4/10 text-chart-4" },
    { label: "Servidor Público", icon: Building2, color: "bg-success/10 text-success" },
    { label: "Empresário / MEI", icon: TrendingUp, color: "bg-chart-3/10 text-chart-3" },
    { label: "Aposentado", icon: Heart, color: "bg-chart-2/10 text-chart-2" },
    { label: "Estudante", icon: BookOpen, color: "bg-destructive/10 text-destructive" },
  ] },
  { title: "Qual sua faixa de renda mensal?", subtitle: "Informação utilizada para calcular seu limite.", aria: "Faixa de renda mensal", layout: "list", options: [
    { label: "Até R$ 2.000", icon: DollarSign, color: "bg-success/10 text-success" },
    { label: "R$ 2.000 — R$ 5.000", icon: DollarSign, color: "bg-brand-soft text-brand" },
    { label: "R$ 5.000 — R$ 10.000", icon: DollarSign, color: "bg-chart-3/10 text-chart-3" },
    { label: "R$ 10.000 — R$ 20.000", icon: DollarSign, color: "bg-chart-4/10 text-chart-4" },
    { label: "Acima de R$ 20.000", icon: DollarSign, color: "bg-chart-2/10 text-chart-2" },
  ] },
  { title: "Possui restrições no CPF?", subtitle: "Não se preocupe, isso não impede a aprovação.", aria: "Restrições no CPF", layout: "pair", options: [
    { label: "Sim, possuo", icon: CircleCheck, color: "bg-destructive/10 text-destructive" },
    { label: "Não possuo", icon: CircleCheck, color: "bg-success/10 text-success" },
  ] },
];

function Quiz() {
  const consulta = useLocation({ select: (location) => location.state.consulta });
  const [answers, setAnswers] = useState<string[]>([]);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(true);
  const reducedMotion = useAnimationReducedMotion();
  const stepIndex = Math.min(answers.length, steps.length - 1);
  const step = steps[shown] ?? steps[0];
  const done = answers.length >= steps.length;
  const selected = done ? answers[steps.length - 1] : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (!done || !consulta) return;
    const t = setTimeout(() => navigate({ to: "/solicitar/analise", state: { consulta, quizAnswers: answers } }), 400);
    return () => clearTimeout(t);
  }, [done, navigate, consulta, answers]);
  // Crossfade: fade the current question out, swap it, then fade the new one in.
  useEffect(() => {
    if (shown === stepIndex) return;
    if (reducedMotion) { setShown(stepIndex); setFading(false); return; }
    setFading(true);
    const t = setTimeout(() => { setShown(stepIndex); setFading(false); }, 200);
    return () => clearTimeout(t);
  }, [stepIndex, shown, reducedMotion]);
  useEffect(() => {
    const t = setTimeout(() => setFading(false), reducedMotion ? 0 : 80);
    return () => clearTimeout(t);
  }, [reducedMotion]);
  const choose = (label: string) => { if (!done && shown === stepIndex && !fading) setAnswers((prev) => [...prev, label]); };
  if (!consulta?.nome || !step) return <Navigate to="/solicitar" />;
  const name = consulta.nome.trim().split(/\s+/)[0] ?? "";
  const firstName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="mx-auto min-h-svh max-w-xl bg-background font-sans">
      <header className="flex h-[66px] items-center justify-between gap-4 border-b px-6">
        <div className="flex shrink-0 items-center gap-1.5 text-lg font-semibold"><img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain" /> Card</div>
        <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"><UserRound aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{firstName}</span></div>
      </header>
      <main className="px-6 pb-10 pt-5">
        <p className="text-sm text-muted-foreground">Pergunta {stepIndex + 1} de {steps.length}</p>
        <div role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={4} aria-valuenow={stepIndex + 1} className="mt-2 h-1 overflow-hidden rounded-full bg-application-disabled/50"><div className="h-full bg-brand transition-all duration-300" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
        <div className={`transition-opacity duration-200 motion-reduce:transition-none ${fading ? "opacity-0" : "opacity-100"}`}>
          <h1 className="mt-8 text-[22px] font-bold leading-snug">{step.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.subtitle}</p>
          <div key={shown} aria-label={step.aria} className={`mt-6 grid gap-2.5 ${step.layout === "list" ? "grid-cols-1" : "grid-cols-2"}`}>
            {step.options.map(({ label, icon: Icon, color }) => (
              <Button key={label} type="button" variant="outline" aria-pressed={selected === label} onClick={() => choose(label)} className={`h-auto min-h-[74px] gap-3 ${step.layout === "pair" ? "min-h-[124px] flex-col justify-center text-center font-semibold" : "justify-start"} whitespace-normal rounded-xl px-4 py-3 text-left text-sm font-medium shadow-none ${selected === label ? "border-brand bg-brand-soft hover:bg-brand-soft" : "hover:border-brand"}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <span className={step.layout === "pair" ? "" : "min-w-0 flex-1"}>{label}</span>
                {selected === label && step.layout !== "pair" ? <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" /> : null}
              </Button>
            ))}
          </div>
        </div>
        
      </main>
    </div>
  );
}