import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { BadgeCheck, Shield } from "lucide-react";
import appleLogo from "@/assets/apple-logo.svg.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/solicitar/confirmar")({
  head: () => ({
    meta: [
      { title: "Solicitar Apple Card — Confirmar dados" },
      { name: "description", content: "Confirme seus dados para prosseguir com a solicitação do Apple Card." },
      { property: "og:title", content: "Solicitar Apple Card — Confirmar dados" },
      { property: "og:description", content: "Confirme seus dados para prosseguir com a solicitação do Apple Card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" }],
  }),
  component: Confirmar,
});

function maskCpf(cpf: string) {
  return `${cpf.slice(0, 3)}.***.***-${cpf.slice(9)}`;
}

function firstName(nome: string) {
  const first = nome.trim().split(/\s+/)[0] ?? nome;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function Confirmar() {
  const consulta = useLocation({ select: (location) => location.state.consulta });

  if (!consulta?.nome) {
    return <Navigate to="/solicitar" />;
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col bg-background font-sans">
      <header className="flex h-[66px] shrink-0 items-center justify-center gap-1.5 border-b text-lg font-semibold">
        <img src={appleLogo.url} alt="Apple" className="h-5 w-5 object-contain" /> Card
      </header>
      <main className="flex-1 px-6">
        <ol aria-label="Etapas da solicitação" className="mt-5 flex items-center justify-center gap-2">
          <li aria-label="Etapa 1: concluída" className="h-2 w-2 rounded-full bg-success" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-application-disabled" />
          <li aria-current="step" aria-label="Etapa 2: confirmação" className="h-2 w-6 rounded-full bg-brand" />
          <li aria-hidden="true" className="h-0.5 w-5 bg-application-disabled" />
          <li aria-label="Etapa 3: pendente" className="h-2 w-2 rounded-full bg-application-disabled" />
        </ol>
        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <BadgeCheck aria-hidden="true" className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-bold">Olá, {firstName(consulta.nome)}!</h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-muted-foreground">Confirme que estes dados estão corretos para prosseguir.</p>
        <dl className="mx-auto mt-8 max-w-[360px] rounded-2xl border p-5">
          <div className="flex items-start justify-between gap-4 py-1">
            <dt className="shrink-0 text-sm text-muted-foreground">Nome completo</dt>
            <dd className="text-right text-sm font-semibold">{consulta.nome}</dd>
          </div>
          {consulta.nascimento ? (
            <div className="flex items-center justify-between gap-4 border-t py-3">
              <dt className="shrink-0 text-sm text-muted-foreground">Data de nascimento</dt>
              <dd className="text-right text-sm font-semibold">{consulta.nascimento}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 border-t py-3">
            <dt className="shrink-0 text-sm text-muted-foreground">CPF</dt>
            <dd className="text-right text-sm font-semibold">{maskCpf(consulta.cpf)}</dd>
          </div>
        </dl>
        <div className="mx-auto mt-6 flex max-w-[360px] gap-3">
          <Button asChild variant="outline" className="h-[52px] flex-1 rounded-xl text-base font-bold shadow-none">
            <Link to="/solicitar">Não sou eu</Link>
          </Button>
          <Button asChild className="h-[52px] flex-1 rounded-xl bg-success text-base font-bold text-primary-foreground hover:bg-success/90">
            <Link to="/solicitar/carregando" state={{ consulta }}>Sou eu, continuar</Link>
          </Button>
        </div>
      </main>
      <footer className="flex items-center justify-center gap-1.5 px-6 pb-12 pt-8 text-center text-xs text-muted-foreground">
        <Shield aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> Seus dados são protegidos com criptografia de ponta a ponta
      </footer>
    </div>
  );
}
