import appleLogo from "@/assets/apple-logo.svg.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, CircleAlert, ShieldCheck, Smartphone, DollarSign, Check, Lock, Shield } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { MetalCard } from "@/components/MetalCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apple Card — O cartão que simplifica sua vida financeira" },
      { name: "description", content: "Até 3% de cashback diário, sem anuidade e sem taxas internacionais." },
      { property: "og:title", content: "Apple Card no Brasil" },
      { property: "og:description", content: "Até 3% de cashback diário, sem anuidade e sem taxas internacionais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" }],
  }),
  component: Index,
});

function Cta() {
  return (
    <Button asChild className="cta-shimmer group relative flex h-auto w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand py-4 text-lg font-bold text-primary-foreground shadow-lg transition duration-300 hover:bg-brand hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 motion-reduce:transform-none"><Link to="/solicitar">
      Solicitar Apple Card <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
    </Link></Button>
  );
}

const benefits = [
  { icon: CircleAlert, t: "Até 3% Cashback", d: "Receba Daily Cash em todas as compras, creditado diariamente.", c: "text-brand bg-brand-soft" },
  { icon: ShieldCheck, t: "Segurança Total", d: "Sem números impressos. Dados protegidos pela Apple.", c: "text-success bg-success/10" },
  { icon: Smartphone, t: "Apple Wallet", d: "Integração nativa. Use com Apple Pay em qualquer lugar.", c: "text-chart-4 bg-chart-4/10" },
  { icon: DollarSign, t: "Zero Anuidade", d: "Sem anuidade, sem taxas de atraso ou internacionais.", c: "text-chart-5 bg-chart-5/10" },
];
const steps = [
  ["Solicite em minutos", "Informe seus dados básicos e passe pela análise expressa de crédito."],
  ["Receba aprovação instantânea", "Veja seu limite aprovado e personalize seu cartão na hora."],
  ["Cartão físico em casa", "Receba seu Apple Card de titânio diretamente no endereço escolhido."],
];
const feats = ["Cartão de titânio gravado a laser", "Sem número, sem CVV, sem data impressa", "Contactless com Apple Pay em qualquer loja", "Parcelamento de produtos Apple com 0% juros", "Suporte 24h via chat com especialistas Apple"];

function Label({ children }: { children: string }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-brand">{children}</p>;
}

function Index() {
  return (
    <div className="mx-auto min-h-screen max-w-xl bg-background font-sans">
      <header className="sticky top-0 z-10 flex items-center justify-center gap-1.5 border-b bg-background/90 py-4 text-lg font-semibold backdrop-blur">
        <img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain" /> Card
      </header>

      <section className="bg-gradient-to-b from-background to-muted px-6 pb-10 pt-6 text-center">
        <Reveal><span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
          <Star className="h-3.5 w-3.5" /> Novo no Brasil
        </span></Reveal>
        <MetalCard />
        <Reveal delay={0.08}><h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight">O cartão que simplifica sua vida financeira.</h1></Reveal>
        <Reveal delay={0.16}><p className="mt-3 text-lg text-muted-foreground">Até 3% de cashback diário. Sem anuidade. Sem taxas internacionais. Aprovação em minutos.</p></Reveal>
        <Reveal delay={0.24} className="mt-7"><Cta /></Reveal>
      </section>

      <section className="px-6 py-12">
        <Reveal><Label>Benefícios</Label>
        <h2 className="mt-3 text-2xl font-bold">Projetado para você.</h2>
        <p className="mt-3 text-muted-foreground">Cada detalhe pensado para oferecer a melhor experiência financeira.</p></Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <Reveal key={b.t} delay={i * 0.08} className="rounded-2xl border p-5 text-center transition hover:border-brand hover:shadow-lg">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${b.c}`}><b.icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-bold">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted px-6 py-12">
        <Reveal><Label>Como funciona</Label>
        <h2 className="mt-3 text-2xl font-bold">Simples como deve ser.</h2>
        <p className="mt-3 text-muted-foreground">Três passos rápidos e seu Apple Card estará pronto.</p></Reveal>
        <ol className="mt-6 space-y-5">
          {steps.map(([t, d], i) => (
            <li key={t}><Reveal delay={i * 0.08} x={-16} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-primary-foreground">{i + 1}</span>
              <div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
            </Reveal></li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-3 gap-3 px-6 py-10">
        {[{ to: 2, suffix: "M+", decimals: 0, l: "Cartões aprovados" }, { to: 4.8, suffix: "★", decimals: 1, l: "Avaliação dos usuários" }, { to: 98, suffix: "%", decimals: 0, l: "Aprovação em minutos" }].map(({ to, suffix, decimals, l }, i) => (
          <Reveal key={l} delay={i * 0.08} className="rounded-2xl border px-2 py-6 text-center">
            <p className="text-2xl font-extrabold"><Counter to={to} suffix={suffix} decimals={decimals} /></p>
            <p className="mt-2 text-xs text-muted-foreground">{l}</p>
          </Reveal>
        ))}
      </section>

      <section className="bg-ink px-6 py-12 text-center text-ink-foreground">
        <Reveal><Label>Apple Card Titanium</Label>
        <h2 className="mt-3 text-2xl font-bold leading-snug">Feito de titânio.<br />Feito para você.</h2>
        <p className="mt-3 text-sm text-ink-foreground/60">O cartão físico mais seguro e elegante do mercado.</p></Reveal>
        <ul className="mt-6 space-y-4 text-left">
          {feats.map((f, i) => (
            <li key={f}><Reveal delay={i * 0.08} x={-16} className="flex items-center gap-4 rounded-xl border border-ink-foreground/10 bg-ink-card px-5 py-4 text-sm font-semibold">
              <Check className="h-4 w-4 text-success" /> {f}
            </Reveal></li>
          ))}
        </ul>
      </section>

      <section className="px-6 py-12 text-center">
        <Reveal><h2 className="text-2xl font-bold">Pronto para começar?</h2></Reveal>
        <Reveal delay={0.08}><p className="mt-3 text-muted-foreground">Solicite agora e receba seu Apple Card em poucos dias.</p></Reveal>
        <Reveal delay={0.16} className="mt-7"><Cta /></Reveal>
        <Reveal delay={0.24} className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Criptografia</span>
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Dados protegidos</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Entrega garantida</span>
        </Reveal>
      </section>

      <footer className="border-t px-6 py-8 text-center text-xs leading-relaxed text-muted-foreground">
        <Reveal>Apple Card é emitido por Goldman Sachs Bank USA.<br />© 2026 Apple Inc. Todos os direitos reservados.<br />Sujeito à análise de crédito. Termos e condições se aplicam.</Reveal>
      </footer>
    </div>
  );
}
