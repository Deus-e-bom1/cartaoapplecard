import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { DollarSign, Globe, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetalCard, type CardColor } from "@/components/MetalCard";
import { useAnimationReducedMotion } from "@/hooks/use-animation-reduced-motion";
import { calculateSimulatedLimit, formatLimit } from "@/lib/offer";

export const Route = createFileRoute("/solicitar/aprovado")({
  head: () => ({ meta: [
    { title: "Apple Card — Aprovado" },
    { name: "description", content: "Seu Apple Card foi aprovado com sucesso. Confira seu limite e ative seu cartão." },
    { property: "og:title", content: "Apple Card — Aprovado" },
    { property: "og:description", content: "Seu Apple Card foi aprovado com sucesso. Confira seu limite e ative seu cartão." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Aprovado,
});

const features = [
  { icon: DollarSign, tone: "bg-feature-green/15 text-feature-green", title: "Cashback Diário de até 3%", desc: "Receba de volta em todas as compras" },
  { icon: Globe, tone: "bg-feature-blue/15 text-feature-blue", title: "Aceito no Mundo Todo", desc: "Compras internacionais sem anuidade" },
  { icon: Lock, tone: "bg-feature-amber/15 text-feature-amber", title: "Segurança Apple ID", desc: "Protegido por Face ID e criptografia" },
  { icon: Smartphone, tone: "bg-feature-purple/15 text-feature-purple", title: "Apple Pay Integrado", desc: "Use direto no iPhone e Apple Watch" },
] as const;

function Reveal({ delay, className = "", children }: { delay: number; className?: string; children: ReactNode }) {
  const reducedMotion = useAnimationReducedMotion();
  const [shown, setShown] = useState(reducedMotion);
  useEffect(() => {
    if (reducedMotion) { setShown(true); return; }
    const timer = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);
  return <div className={`transition-opacity duration-500 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"} ${className}`}>{children}</div>;
}

function Aprovado() {
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers }) ?? [];
  const [color, setColor] = useState<CardColor>("Titanium");
  useEffect(() => {
    const stored = sessionStorage.getItem("apple-card-color");
    if (stored === "Titanium" || stored === "Midnight" || stored === "Starlight") setColor(stored);
  }, []);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  const firstName = consulta.nome.trim().split(/\s+/)[0] ?? "";
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const amount = formatLimit(calculateSimulatedLimit(answers));
  const match = amount.match(/^R\$\s([\d.]+)(,\d{2})$/);
  const [prefix, integer, decimals] = match ? ["R$", match[1], match[2]] : ["", amount, ""];

  return <div className="approval-glow min-h-svh bg-ink font-sans text-ink-foreground">
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-6 pb-6 pt-10 text-center">
      <Reveal delay={0}>
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />Pré-aprovado
        </span>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="mt-4 text-[26px] font-bold">Parabéns, {name}!</h1>
        <p className="mt-1 text-sm text-ink-foreground/60">Seu Apple Card foi aprovado com sucesso</p>
      </Reveal>
      <Reveal delay={250}>
        <MetalCard name={consulta.nome} color={color} fill ariaLabel={`Cartão ${color}`} className="mt-6 max-w-[280px]" />
      </Reveal>
      <Reveal delay={500}>
        <p className="mt-4 text-sm text-ink-foreground/60">Limite disponível</p>
        <p className="mt-1 text-success">
          <span className="text-base font-semibold">{prefix}</span>
          {" "}
          <span className="text-[34px] font-bold tracking-tight">{integer}</span>
          <span className="text-base font-semibold">{decimals}</span>
        </p>
      </Reveal>
      <div className="mt-5 flex flex-col gap-2.5 text-left">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Reveal key={feature.title} delay={700 + index * 150}>
            <div className="flex items-center gap-3 rounded-2xl border border-ink-foreground/10 bg-ink-card/50 px-4 py-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${feature.tone}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{feature.title}</span>
                <span className="block text-xs text-ink-foreground/55">{feature.desc}</span>
              </span>
            </div>
          </Reveal>;
        })}
      </div>
      <div className="mt-auto pt-5">
        <Reveal delay={1350}>
          <Button asChild className="h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90"><Link to="/solicitar/conta" state={{ consulta, quizAnswers: answers }}>Ativar meu Apple Card</Link></Button>
          <p className="mt-3 text-[11px] text-ink-foreground/40">Faltam apenas alguns passos para ativar</p>
        </Reveal>
      </div>
    </div>
  </div>;
}
