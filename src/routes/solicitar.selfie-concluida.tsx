import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { Check, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/solicitar/selfie-concluida")({
  head: () => ({ meta: [
    { title: "Apple Card — Verificação concluída" },
    { name: "description", content: "Sua identidade foi verificada. Confira seu Apple Card aprovado." },
    { property: "og:title", content: "Apple Card — Verificação concluída" },
    { property: "og:description", content: "Sua identidade foi verificada. Confira seu Apple Card aprovado." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SelfieConcluida,
});

function SelfieConcluida() {
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers }) ?? [];
  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  return <div className="min-h-svh bg-ink font-sans text-ink-foreground">
    <div className="mx-auto flex min-h-svh max-w-xl flex-col">
      <header className="grid shrink-0 grid-cols-[64px_1fr_64px] items-center px-6 py-4">
        <div />
        <p className="text-center text-[13px] font-medium text-ink-foreground/70">Verificação Concluída</p>
        <span className="flex items-center justify-end gap-1 text-[11px] text-success"><LockKeyhole className="h-3 w-3" /> Seguro</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success"><Check className="h-10 w-10 text-ink-foreground" aria-hidden="true" /></div>
        <h1 className="mt-4 text-[22px] font-bold">Identidade Verificada</h1>
        <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-ink-foreground/70">Sua verificação facial foi concluída com sucesso. Seu Apple Card está aprovado!</p>
        <div className="mt-6 w-[188px] rounded-lg border border-success/25 bg-success/10 px-4 py-4">
          <p className="text-xs text-success">Score de Verificação</p>
          <p className="mt-1 text-2xl font-bold text-success">98.7%</p>
          <p className="mt-1 text-[11px] text-ink-foreground/45">Aprovado • Face ID Match</p>
        </div>
      </main>
      <footer className="shrink-0 px-6 pb-7">
        <Button asChild className="h-[52px] w-full rounded-xl bg-success text-base font-bold text-ink-foreground hover:bg-success/90"><Link to="/solicitar/aprovado" state={{ consulta, quizAnswers: answers }}>Ver meu Apple Card aprovado</Link></Button>
      </footer>
    </div>
  </div>;
}
