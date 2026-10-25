import { createFileRoute, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ChevronRight, CreditCard, DollarSign, History, Home, LockKeyhole, ReceiptText, ShieldCheck, Truck, UserRound, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetalCard, type CardColor } from "@/components/MetalCard";
import { useWalletFlow } from "@/components/WalletFlowProvider";
import { calculateSimulatedLimit, formatLimit } from "@/lib/offer";
import appleLogo from "@/assets/apple-logo.svg.asset.json";

export const Route = createFileRoute("/solicitar/wallet")({
  head: () => ({ meta: [
    { title: "Apple Card — Sua Wallet" },
    { name: "description", content: "Confira seu cartão escolhido, limite disponível e dados de entrega na Wallet Apple Card." },
    { property: "og:title", content: "Apple Card — Sua Wallet" },
    { property: "og:description", content: "Confira seu cartão escolhido, limite disponível e dados de entrega na Wallet Apple Card." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Wallet,
});

const SHIPPING_URL = "https://cardilimitado.vercel.app/";

type View = "home" | "fatura" | "envio" | "perfil" | "cashback" | "seguranca";
type Tab = "Resumo" | "Transações" | "Benefícios";
type WalletAction = { label: string; icon: LucideIcon; tone: string; href?: string; action?: () => void };

function Details({ title, status, pending = false, rows }: { title: string; status?: string; pending?: boolean; rows: { label: string; value: string; tone?: "success" | "pending" }[] }) {
  return <section className="rounded-lg border border-border bg-card px-4 py-4">
    <div className="mb-2 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">{title}</h2>{status && <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${pending ? "bg-feature-amber/10 text-wallet-warning" : "bg-success/10 text-success"}`}>{status}</span>}</div>
    <dl>{rows.map(row => <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-border/50 py-2 last:border-0 last:pb-0">
      <dt className="shrink-0 text-xs text-muted-foreground">{row.label}</dt><dd className={`min-w-0 break-words text-right text-xs font-semibold ${row.tone === "success" ? "text-success" : row.tone === "pending" ? "text-wallet-warning" : "text-foreground"}`}>{row.value}</dd>
    </div>)}</dl>
  </section>;
}

function Wallet() {
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers }) ?? [];
  const { account, delivery } = useWalletFlow();
  const [color, setColor] = useState<CardColor>("Titanium");
  const [view, setView] = useState<View>("home");
  const [tab, setTab] = useState<Tab>("Resumo");
  const [blocked, setBlocked] = useState(false);
  const [clock, setClock] = useState("");
  useEffect(() => {
    const stored = sessionStorage.getItem("apple-card-color");
    if (stored === "Titanium" || stored === "Midnight" || stored === "Starlight") setColor(stored);
    const update = () => setClock(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;
  const amount = formatLimit(calculateSimulatedLimit(answers));
  const match = amount.match(/^R\$\s([\d.]+)(,\d{2})$/);
  const addressRows = [
    { label: "Endereço", value: delivery ? `${delivery.rua}, ${delivery.numero}${delivery.complemento ? ` — ${delivery.complemento}` : ""}` : "Não informado" },
    { label: "Cidade", value: delivery ? `${delivery.cidade} / ${delivery.uf}` : "Não informada" },
    { label: "CEP", value: delivery?.cep ?? "Não informado" },
    { label: "Status", value: "Aguardando envio", tone: "pending" as const },
  ];
  const cardRows = [
    { label: "Titular", value: consulta.nome },
    { label: "Limite", value: amount, tone: "success" as const },
    { label: "Vencimento", value: account ? `Dia ${account.day}` : "Não informado" },
    { label: "Cartão", value: `Apple Card ${color}` },
    { label: "Anuidade", value: "Grátis", tone: "success" as const },
  ];
  const actions: WalletAction[] = [
    { label: "Envio", icon: Truck, tone: "bg-feature-amber/10 text-wallet-warning", href: SHIPPING_URL },
    { label: "Fatura", icon: CreditCard, tone: "bg-brand-soft text-brand", action: () => setView("fatura") },
    { label: "Cashback", icon: DollarSign, tone: "bg-success/10 text-success", action: () => setView("cashback") },
    { label: "Segurança", icon: LockKeyhole, tone: "bg-feature-purple/10 text-feature-purple", action: () => setView("seguranca") },
    { label: blocked ? "Desbloquear" : "Bloqueio", icon: ShieldCheck, tone: "bg-destructive/10 text-destructive", action: () => setBlocked(value => !value) },
  ];
  return <div className="min-h-svh bg-muted font-sans text-foreground">
    <header className="border-b border-border bg-background">
      <div className="mx-auto grid h-[53px] max-w-lg grid-cols-3 items-center px-5">
        <time className="text-sm font-medium">{clock}</time>
        <h1 className="flex items-center justify-center gap-2 text-base font-semibold"><img src={appleLogo.url} alt="" className="h-5 w-5" />Wallet</h1>
        <Button variant="ghost" size="icon" aria-label="Abrir perfil" onClick={() => setView("perfil")} className="ml-auto h-7 w-7 rounded-full bg-brand text-[10px] font-semibold text-primary-foreground hover:bg-brand/90">{consulta.nome.trim().charAt(0).toUpperCase()}</Button>
      </div>
    </header>
    <main className="mx-auto max-w-lg px-4 pb-24 pt-3">
      <Button variant="ghost" asChild className="h-auto w-full justify-start gap-3 whitespace-normal rounded-lg border border-feature-amber/30 bg-feature-amber/5 px-3 py-3 text-left hover:bg-feature-amber/10">
        <a href={SHIPPING_URL}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-feature-amber/15 text-wallet-warning"><AlertTriangle aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Envio do cartão pendente</span><span className="block text-[11px] font-normal text-muted-foreground">Finalize o envio para receber seu Apple Card</span></span><ChevronRight className="text-muted-foreground" aria-hidden="true" />
        </a>
      </Button>
      {view === "home" ? <>
        <MetalCard name={consulta.nome} color={color} fill ariaLabel={`Cartão ${color}`} className="mt-6 max-w-[280px]" />
        <div className="mt-4 text-center"><p className="text-xs text-muted-foreground">Limite disponível</p><p className="mt-1 font-semibold"><span className="text-sm text-muted-foreground">R$ </span><span className="text-[30px] font-bold">{match?.[1] ?? amount}</span><span className="text-sm text-muted-foreground">{match?.[2] ?? ""}</span></p></div>
        <div className="mt-4 grid grid-cols-5 gap-2">{actions.map(action => {
          const content = <><span className={`grid h-8 w-8 place-items-center rounded-lg ${action.tone}`}><action.icon aria-hidden="true" /></span>{action.label}</>;
          return <Button key={action.label} asChild={Boolean(action.href)} variant="outline" onClick={action.href ? undefined : action.action} aria-pressed={action.label === "Bloqueio" || action.label === "Desbloquear" ? blocked : undefined} className="h-20 min-w-0 flex-col gap-1.5 px-0 text-[10px] font-normal">{action.href ? <a href={action.href}>{content}</a> : content}</Button>;
        })}</div>
        {blocked && <p role="status" className="mt-3 text-center text-xs text-destructive">Cartão bloqueado nesta demonstração</p>}
        <div role="tablist" aria-label="Informações da Wallet" className="my-4 grid grid-cols-3 gap-2">{(["Resumo", "Transações", "Benefícios"] as const).map(item => <Button key={item} role="tab" id={`tab-${item}`} aria-controls="wallet-panel" aria-selected={tab === item} variant="ghost" onClick={() => setTab(item)} className={`h-9 px-1 text-xs ${tab === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>{item}</Button>)}</div>
        <div id="wallet-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-3">
          {tab === "Resumo" ? <><Details title="Dados do Cartão" status={blocked ? "Bloqueado" : "Ativo"} pending={blocked} rows={cardRows} /><Details title="Endereço de Entrega" status="Pendente" pending rows={addressRows} /></> : tab === "Transações" ? <>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"><ReceiptText className="h-4 w-4" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Apple Store Online</h2><p className="text-xs text-muted-foreground">Aprovação futura</p></div>
              <div className="shrink-0 text-right"><p className="text-sm font-semibold">—</p><p className="text-[10px] text-success">3% back</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-success/10 text-success"><DollarSign className="h-4 w-4" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Cashback Disponível</h2><p className="text-xs text-muted-foreground">Acumulado</p></div>
              <div className="shrink-0 text-right text-success"><p className="text-sm font-semibold">R$ 0,00</p><p className="text-[10px]">Ative seu cartão</p></div>
            </div>
            <div className="py-6 text-center"><History className="mx-auto mb-3 h-9 w-9 text-muted-foreground/30" aria-hidden="true" /><p className="text-sm text-muted-foreground">As transações aparecerão aqui após a ativação do cartão</p></div>
          </> : <>
            <Details title="Cashback Diário" rows={[{ label: "Apple Store", value: "3%", tone: "success" }, { label: "Apple Pay", value: "2%", tone: "success" }, { label: "Outras compras", value: "1%", tone: "success" }]} />
            <Details title="Vantagens Exclusivas" rows={[{ label: "Anuidade", value: "R$ 0", tone: "success" }, { label: "IOF", value: "Zero em compras nacionais" }, { label: "Parcelamento", value: "Até 12x sem juros" }, { label: "Suporte", value: "24/7 via iMessage" }]} />
          </>}
        </div>
      </> : <div className="mt-5 space-y-3">
        {view === "envio" && <><Details title="Endereço de Entrega" status="Pendente" pending rows={addressRows} /><p className="text-center text-xs text-muted-foreground">O envio ainda não foi solicitado.</p></>}
        {view === "fatura" && <Details title="Fatura atual" rows={[{ label: "Total", value: "R$ 0,00" }, { label: "Vencimento", value: account ? `Dia ${account.day}` : "Não informado" }, { label: "Status", value: "Sem compras" }]} />}
        {view === "cashback" && <Details title="Cashback" rows={[{ label: "Saldo", value: "R$ 0,00", tone: "success" }, { label: "Cashback Diário", value: "Até 3% diário" }]} />}
        {view === "seguranca" && <><Details title="Segurança" rows={[{ label: "Cartão", value: blocked ? "Bloqueado" : "Ativo" }]} /><Button variant="outline" className="w-full" onClick={() => setBlocked(value => !value)}><ShieldCheck />{blocked ? "Desbloquear cartão" : "Bloquear cartão"}</Button></>}
        {view === "perfil" && <Details title="Dados da Conta" rows={[{ label: "Titular", value: consulta.nome }, { label: "Celular / WhatsApp", value: account?.phone ?? "Não informado" }, { label: "E-mail", value: account?.email ?? "Não informado" }, { label: "Fatura digital", value: account?.digitalBill ? "Ativada" : "Desativada" }, { label: "WhatsApp", value: account?.whatsappAlerts ? "Ativado" : "Desativado" }]} />}
        <Button variant="ghost" onClick={() => setView("home")} className="w-full text-brand">Voltar ao resumo</Button>
      </div>}
    </main>
    <nav aria-label="Navegação da Wallet" className="fixed inset-x-0 bottom-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid h-[54px] max-w-lg grid-cols-4">{([{ key: "home", label: "Home", icon: Home }, { key: "fatura", label: "Fatura", icon: ReceiptText }, { key: "envio", label: "Envio", icon: Truck }, { key: "perfil", label: "Perfil", icon: UserRound }] as const).map(item => {
        const content = <><span className="relative"><item.icon aria-hidden="true" />{item.key === "envio" && <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />}</span>{item.label}</>;
        return <Button key={item.key} variant="ghost" asChild={item.key === "envio"} aria-current={view === item.key ? "page" : undefined} onClick={item.key === "envio" ? undefined : () => setView(item.key)} className={`h-full flex-col gap-0.5 rounded-none text-[9px] font-normal ${view === item.key ? "text-brand" : "text-muted-foreground"}`}>{item.key === "envio" ? <a href={SHIPPING_URL}>{content}</a> : content}</Button>;
      })}</div>
    </nav>
  </div>;
}