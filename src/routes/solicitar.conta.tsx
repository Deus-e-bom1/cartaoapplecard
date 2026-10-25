import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Lock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletFlow } from "@/components/WalletFlowProvider";

export const Route = createFileRoute("/solicitar/conta")({
  head: () => ({ meta: [
    { title: "Apple Card — Dados da Conta" },
    { name: "description", content: "Configure sua conta: escolha o dia de vencimento e como receber suas notificações." },
    { property: "og:title", content: "Apple Card — Dados da Conta" },
    { property: "og:description", content: "Configure sua conta: escolha o dia de vencimento e como receber suas notificações." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Conta,
});

const days = ["05", "10", "15", "20", "25", "01", "07", "30"];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors motion-reduce:transition-none ${checked ? "justify-end bg-success" : "justify-start bg-input"}`}
  >
    <span className="h-6 w-6 rounded-full bg-background shadow" />
  </button>;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function Conta() {
  const { setAccount } = useWalletFlow();
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers }) ?? [];
  const [day, setDay] = useState("15");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [digitalBill, setDigitalBill] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  const phoneDigits = phone.replace(/\D/g, "");
  const valid = phoneDigits.length >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return <div className="min-h-svh bg-background font-sans text-foreground">
    <div className="mx-auto flex min-h-svh max-w-md flex-col">
      <header className="flex items-center gap-3 px-4 pt-4">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
          <Link to="/solicitar/aprovado" state={{ consulta, quizAnswers: answers }} aria-label="Voltar"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="flex-1 text-center text-sm font-semibold">Dados da Conta</h1>
        <span className="text-xs text-muted-foreground">8/13</span>
      </header>
      <div className="mt-3 h-1 w-full bg-muted" role="progressbar" aria-valuenow={8} aria-valuemin={0} aria-valuemax={13} aria-label="Etapa 8 de 13">
        <div className="h-full bg-brand" style={{ width: `${(8 / 13) * 100}%` }} />
      </div>
      <main className="flex flex-1 flex-col px-5 pb-6 pt-6">
        <h2 className="text-xl font-bold">Configure sua conta</h2>
        <p className="mt-1 text-sm text-muted-foreground">Escolha o melhor dia de vencimento e como receber suas notificações.</p>

        <section className="mt-6" aria-labelledby="vencimento-label">
          <h3 id="vencimento-label" className="flex items-center gap-2 text-sm font-semibold"><Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />Dia de vencimento da fatura</h3>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {days.map(d => <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              className={`rounded-xl border px-2 py-3 text-center transition-colors ${day === d ? "border-brand ring-1 ring-brand" : "border-border bg-background"}`}
            >
              <span className="block text-lg font-bold">{d}</span>
              <span className="block text-[10px] text-muted-foreground">Todo mês</span>
            </button>)}
          </div>
        </section>

        <section className="mt-6" aria-labelledby="celular-label">
          <h3 id="celular-label" className="flex items-center gap-2 text-sm font-semibold"><Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />Celular / WhatsApp</h3>
          <Input
            value={phone}
            onChange={e => setPhone(maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            inputMode="numeric"
            autoComplete="tel"
            className="mt-3 h-12 rounded-xl"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Para notificações do cartão e suporte</p>
        </section>

        <section className="mt-5" aria-labelledby="email-label">
          <h3 id="email-label" className="flex items-center gap-2 text-sm font-semibold"><Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />E-mail</h3>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            type="email"
            autoComplete="email"
            className="mt-3 h-12 rounded-xl"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Para fatura digital e confirmações</p>
        </section>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Fatura digital</p>
              <p className="text-xs text-muted-foreground">Receber fatura por e-mail</p>
            </div>
            <Toggle checked={digitalBill} onChange={setDigitalBill} label="Fatura digital" />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Notificações por WhatsApp</p>
              <p className="text-xs text-muted-foreground">Alertas de compras e segurança</p>
            </div>
            <Toggle checked={whatsappAlerts} onChange={setWhatsappAlerts} label="Notificações por WhatsApp" />
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button asChild={valid} disabled={!valid} className="h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90">
            {valid ? <Link to="/solicitar/endereco" onClick={() => setAccount({ day, phone, email, digitalBill, whatsappAlerts })} state={{ consulta, quizAnswers: answers }}>Continuar</Link> : "Continuar"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" aria-hidden="true" />Seus dados são protegidos por criptografia</p>
        </div>
      </main>
    </div>
  </div>;
}
