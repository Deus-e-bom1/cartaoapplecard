import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetalCard, type CardColor } from "@/components/MetalCard";
import { calculateSimulatedLimit, formatLimit } from "@/lib/offer";

import anaAvatar from "@/assets/ana-avatar.png.asset.json";

export const Route = createFileRoute("/solicitar/chat")({
  head: () => ({ meta: [
    { title: "Apple Card — Simulação com Ana" },
    { name: "description", content: "Personalize seu cartão e confira o limite simulado conforme suas respostas." },
    { property: "og:title", content: "Apple Card — Simulação com Ana" },
    { property: "og:description", content: "Personalize seu cartão e confira o limite simulado conforme suas respostas." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Chat,
});

type Message = { text: string; user?: boolean };
const questions = ["Me conta, o que mais te interessou no Apple Card?", "E como você costuma fazer suas compras no dia a dia?", "Sobre sua fatura, como prefere receber?"];
const choices = [["Crédito aprovado para mim", "Cashback diário", "Compras internacionais", "Sem anuidade"], ["Mais online", "Lojas físicas", "Pelo celular", "De tudo um pouco"], ["100% Digital (papel/email)", "Pelo aplicativo"]];
const colors = ["Titanium", "Midnight", "Starlight"];

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/g).filter(Boolean);
  return <>{parts.map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("{{")) return <strong key={i} className="font-bold text-success">{part.slice(2, -2)}</strong>;
    return part;
  })}</>;
}

function Chat() {
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers });
  const amount = formatLimit(calculateSimulatedLimit(answers ?? []));
  const firstName = consulta?.nome.trim().split(/\s+/)[0] ?? "";
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState(0);
  const [typing, setTyping] = useState(true);
  const [color, setColor] = useState("Titanium");
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [verifyStage, setVerifyStage] = useState<"none" | "waiting" | "thinking" | "sent">("none");
  const answered = useRef<Set<number>>(new Set());
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const intro = [
      { text: `Olá, ${name}! 👋`, think: 1700, gap: 1000 },
      { text: "Sou a **Ana**, sua especialista Apple Card. Vou te ajudar a personalizar tudo e finalizar sua aprovação.", think: 2600, gap: 1200 },
      { text: `Vi que seu limite pré-aprovado é de {{${amount}}}. Excelente! 🎉`, think: 3000, gap: 1400 },
      { text: questions[0] ?? "", think: 2200, gap: 0 },
    ];
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      const item = intro[index];
      if (!item) { setTyping(false); return; }
      setTyping(true);
      timer = setTimeout(() => {
        setMessages(prev => [...prev, { text: item.text }]);
        index += 1;
        timer = setTimeout(run, item.gap);
      }, item.think);
    };
    run();
    return () => clearTimeout(timer);
  }, [name, amount]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "instant", block: "end" }); }, [messages, typing, phase]);
  useEffect(() => {
    if (!typing || phase === 0) return;
    if (answered.current.has(phase)) return;
    answered.current.add(phase);
    const think = phase === 1 ? 2800 : phase === 2 ? 2600 : phase === 3 ? 3200 : 3400;
    let second: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      if (phase === 1) {
        setMessages(prev => [...prev, { text: "Ótima escolha! O Apple Card é perfeito para isso. ✨\u00a0" }]);
        second = setTimeout(() => {
          setMessages(prev => [...prev, { text: questions[1] ?? "" }]);
          setTyping(false);
        }, 2400);
        return;
      }
      if (phase === 2) {
        setMessages(prev => [...prev, { text: "Perfeito! Com o Apple Card você tem cashback em todas essas modalidades. 💰" }]);
        second = setTimeout(() => {
          setMessages(prev => [...prev, { text: questions[2] ?? "" }]);
          setTyping(false);
        }, 2400);
        return;
      }
      const response = phase === 3 ? "Agora vem a melhor parte! ✨\nEscolha a cor do seu Apple Card de titânio." : `Lindo! O ${color} ficou perfeito com seu nome, ${name}! 🤍\nAqui está o resumo da sua simulação:`;
      setMessages(prev => [...prev, { text: response }]); setTyping(false); setSummaryVisible(true);
      if (phase === 4) setVerifyStage("waiting");

    }, think);
    return () => { clearTimeout(timer); if (second) clearTimeout(second); };

  }, [typing, phase, color, name]);
  useEffect(() => {
    if (verifyStage !== "waiting") return;
    const t = setTimeout(() => setVerifyStage("thinking"), 1600);
    return () => clearTimeout(t);
  }, [verifyStage]);
  useEffect(() => {
    if (verifyStage !== "thinking") return;
    setTyping(true);
    const t = setTimeout(() => {
      setMessages(prev => [...prev, { text: "Tudo certo! Agora vamos para a verificação de segurança. Só mais alguns passos! 🚀" }]);
      setTyping(false);
      setVerifyStage("sent");
    }, 3000);
    return () => clearTimeout(t);
  }, [verifyStage]);
  if (!consulta?.nome) return <Navigate to="/solicitar" />;
  if (!answers || answers.length !== 4) return <Navigate to="/solicitar/quiz" state={{ consulta }} />;
  const choose = (text: string) => { if (typing) return; setMessages(prev => [...prev, { text, user: true }]); setPhase(p => p + 1); setTyping(true); };
  return <div className="mx-auto flex h-svh max-w-xl flex-col bg-muted font-sans">
    <header className="flex shrink-0 items-center gap-3 bg-ink px-4 py-3 text-ink-foreground">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-ink-foreground"><a href="/solicitar" aria-label="Voltar ao início"><ArrowLeft className="h-4 w-4" /></a></Button>
      <img src={anaAvatar.url} alt="Ana, especialista Apple Card" className="h-10 w-10 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 flex-1"><h1 className="text-sm font-semibold"><span className="font-bold">Ana</span> — Apple Card</h1><p className="flex items-center gap-1 text-[11px] text-ink-foreground/70"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Assistente online</p></div>
      <div aria-label={`Titular ${name} — CPF protegido`} className="shrink-0 rounded-lg border border-ink-foreground/15 bg-ink-foreground/10 px-3 py-1.5 text-right">
        <p className="text-[11px] font-bold leading-tight">{name}</p>
        <p className="text-[10px] leading-tight text-ink-foreground/70">{`${consulta.cpf.slice(0, 3)}.***.***-${consulta.cpf.slice(9)}`}</p>
      </div>
    </header>
    <main className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Conversa com Ana">
      <div className="space-y-3" role="log" aria-live="polite">
        {messages.map((message, i) => <div key={i} className={`flex items-end gap-2 ${message.user ? "justify-end" : "justify-start"}`}>
          {!message.user && <img src={anaAvatar.url} alt="" className="mb-1 h-6 w-6 shrink-0 rounded-full object-cover" />}
          <div className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${message.user ? "bg-brand text-primary-foreground" : "bg-background text-foreground"}`}><p className="whitespace-pre-line break-words"><RichText text={message.text} /></p><span className={`mt-1 flex justify-end text-[9px] ${message.user ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{message.user ? <Check className="h-3 w-3" /> : "Ana"}</span></div>
        </div>)}
        {typing && <div className="flex items-end gap-2">
          <img src={anaAvatar.url} alt="" className="mb-1 h-6 w-6 shrink-0 rounded-full object-cover" />
          <div role="status" aria-label="Ana está digitando" className="flex items-center gap-1.5 rounded-lg bg-background px-4 py-3 shadow-sm">
            <span className="loading-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            <span className="loading-dot loading-dot-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            <span className="loading-dot loading-dot-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
          </div>
        </div>}
      </div>
      {phase >= 3 && <div className="py-5">
        <MetalCard name={consulta.nome} color={color as CardColor} fill ariaLabel={`Cartão ${color}`} className="max-w-[280px]" />

        {phase === 3 && !typing && <fieldset className="mt-4 text-center"><legend className="mx-auto mb-3 text-xs font-semibold">Escolha a cor do seu Apple Card</legend><div className="flex justify-center gap-5">{colors.map(c => <label key={c} className="cursor-pointer text-[10px] text-muted-foreground"><input type="radio" name="card-color" value={c} checked={color === c} onChange={() => setColor(c)} className="sr-only peer" /><span className={`chat-card-${c.toLowerCase()} mx-auto mb-1 block h-9 w-9 rounded-full border-2 border-background ring-2 ring-transparent peer-checked:ring-brand peer-focus-visible:ring-brand`} />{c}</label>)}</div></fieldset>}
      </div>}
      {summaryVisible && <dl className="mx-auto max-w-sm divide-y bg-background px-4 text-xs">{([["Titular", consulta.nome, false], ["Limite", amount, true], ["Cartão", `Apple Card ${color}`, false], ["Anuidade", "Grátis", true], ["Cashback", "Até 3% diário", false]] as [string, string, boolean][]).map(([label, value, green]) => <div key={label} className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">{label}</dt><dd className={`max-w-[65%] text-right font-medium ${green ? "text-success" : ""}`}>{value}</dd></div>)}</dl>}
      <div ref={end} />
    </main>
    <footer className="shrink-0 border-t bg-background p-3">
      {!typing && phase < 3 && <div className="mb-3 grid grid-cols-2 gap-2">{choices[phase]?.map(choice => <Button key={choice} variant="outline" onClick={() => choose(choice)} className="h-auto min-h-10 whitespace-normal px-2 text-xs">{choice}</Button>)}</div>}
      {!typing && phase === 3 && <Button onClick={() => { sessionStorage.setItem("apple-card-color", color); choose(color); }} className="mb-3 w-full bg-brand text-primary-foreground hover:bg-brand/90">Confirmar escolha</Button>}
      {!typing && verifyStage === "sent" && <Button asChild className="mb-3 w-full bg-brand text-primary-foreground hover:bg-brand/90"><Link to="/solicitar/verificacao" state={{ consulta, quizAnswers: answers }}>Continuar para verificação <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" /></Link></Button>}
      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground"><span className="flex-1">{typing ? "Aguardando Ana..." : phase >= 4 ? "Conversa concluída" : "Selecione uma opção acima"}</span><Send className="h-4 w-4" aria-hidden="true" /></div>
    </footer>
  </div>;
}