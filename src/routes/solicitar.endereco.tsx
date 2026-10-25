import { createFileRoute, Link, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CircleCheck, LoaderCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletFlow } from "@/components/WalletFlowProvider";

export const Route = createFileRoute("/solicitar/endereco")({
  head: () => ({ meta: [
    { title: "Apple Card — Endereço de Entrega" },
    { name: "description", content: "Informe o endereço onde deseja receber seu cartão físico de titânio." },
    { property: "og:title", content: "Apple Card — Endereço de Entrega" },
    { property: "og:description", content: "Informe o endereço onde deseja receber seu cartão físico de titânio." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Endereco,
});

function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

type ViaCep = { logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean };

function Endereco() {
  const { setDelivery } = useWalletFlow();
  const consulta = useLocation({ select: l => l.state.consulta });
  const answers = useLocation({ select: l => l.state.quizAnswers }) ?? [];
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const abortRef = useRef<AbortController | null>(null);

  const cepDigits = cep.replace(/\D/g, "");

  useEffect(() => {
    if (cepDigits.length !== 8) {
      abortRef.current?.abort();
      setCepStatus("idle");
      setRua(""); setBairro(""); setUf(""); setCidade("");
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setCepStatus("loading");
    fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: ViaCep) => {
        if (controller.signal.aborted) return;
        if (data.erro || !data.logradouro) {
          setCepStatus("erro");
          setRua(""); setBairro(""); setUf(""); setCidade("");
          return;
        }
        setRua(data.logradouro);
        setBairro(data.bairro ?? "");
        setUf(data.uf ?? "");
        setCidade(data.localidade ?? "");
        setCepStatus("ok");
      })
      .catch(() => { if (!controller.signal.aborted) setCepStatus("erro"); });
    return () => controller.abort();
  }, [cepDigits]);

  if (!consulta?.nome) return <Navigate to="/solicitar" />;

  const valid = cepStatus === "ok" && rua.trim() !== "" && numero.trim() !== "" && bairro.trim() !== "" && uf.trim() !== "" && cidade.trim() !== "";

  return <div className="min-h-svh bg-background font-sans text-foreground">
    <div className="mx-auto flex min-h-svh max-w-md flex-col">
      <header className="flex items-center gap-3 px-4 pt-4">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
          <Link to="/solicitar/conta" state={{ consulta, quizAnswers: answers }} aria-label="Voltar"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="flex-1 text-center text-sm font-semibold">Endereço de Entrega</h1>
        <span className="text-xs text-muted-foreground">9/13</span>
      </header>
      <div className="mt-3 h-1 w-full bg-muted" role="progressbar" aria-valuenow={9} aria-valuemin={0} aria-valuemax={13} aria-label="Etapa 9 de 13">
        <div className="h-full bg-brand" style={{ width: `${(9 / 13) * 100}%` }} />
      </div>
      <main className="flex flex-1 flex-col px-5 pb-6 pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
            <MapPin className="h-7 w-7 text-brand" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Para onde enviar seu Apple Card?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Informe o endereço onde deseja receber seu cartão físico de titânio.</p>
        </div>

        <section className="mt-6" aria-labelledby="cep-label">
          <h3 id="cep-label" className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />CEP</h3>
          <div className="relative mt-3">
            <Input
              value={cep}
              onChange={e => setCep(maskCep(e.target.value))}
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="postal-code"
              aria-invalid={cepStatus === "erro"}
              className={`h-12 rounded-xl pr-11 ${cepStatus === "ok" ? "border-success bg-success/5 focus-visible:ring-success" : ""} ${cepStatus === "erro" ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {cepStatus === "loading" ? <LoaderCircle className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground motion-reduce:animate-none" aria-hidden="true" /> : null}
            {cepStatus === "ok" ? <CircleCheck className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 fill-success text-background" aria-hidden="true" /> : null}
          </div>
          <p className={`mt-1.5 text-xs ${cepStatus === "erro" ? "text-destructive" : "text-muted-foreground"}`}>
            {cepStatus === "erro" ? "CEP não encontrado. Confira e tente novamente." : "Digite o CEP para buscar o endereço automaticamente"}
          </p>
        </section>

        {cepStatus === "ok" ? <>
          <section className="mt-5" aria-labelledby="rua-label">
            <h3 id="rua-label" className="text-sm font-semibold">Rua / Logradouro</h3>
            <Input value={rua} onChange={e => setRua(e.target.value)} autoComplete="address-line1" className="mt-3 h-12 rounded-xl" />
          </section>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <section aria-labelledby="numero-label">
              <h3 id="numero-label" className="text-sm font-semibold">Número</h3>
              <Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="Nº" inputMode="numeric" className="mt-3 h-12 rounded-xl" />
            </section>
            <section aria-labelledby="complemento-label">
              <h3 id="complemento-label" className="text-sm font-semibold">Complemento</h3>
              <Input value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Apto, Bloco..." className="mt-3 h-12 rounded-xl" />
            </section>
          </div>

          <section className="mt-5" aria-labelledby="bairro-label">
            <h3 id="bairro-label" className="text-sm font-semibold">Bairro</h3>
            <Input value={bairro} onChange={e => setBairro(e.target.value)} className="mt-3 h-12 rounded-xl" />
          </section>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <section aria-labelledby="uf-label">
              <h3 id="uf-label" className="text-sm font-semibold">UF</h3>
              <Input value={uf} readOnly disabled className="mt-3 h-12 rounded-xl bg-muted text-muted-foreground" />
            </section>
            <section aria-labelledby="cidade-label">
              <h3 id="cidade-label" className="text-sm font-semibold">Cidade</h3>
              <Input value={cidade} readOnly disabled className="mt-3 h-12 rounded-xl bg-muted text-muted-foreground" />
            </section>
          </div>
        </> : null}

        {valid ? <dl className="mt-6 rounded-xl bg-muted/60 px-4 py-3">
          {[
            ["Endereço", `${rua}, ${numero}${complemento.trim() ? ` — ${complemento.trim()}` : ""}`],
            ["Bairro", bairro],
            ["Cidade / UF", `${cidade} / ${uf}`],
            ["CEP", cep],
          ].map(([label, value]) => <div key={label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-semibold">{value}</dd>
          </div>)}
        </dl> : null}

        <div className="mt-auto pt-6">
          <Button asChild={valid} disabled={!valid} className="h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90">
            {valid ? <Link to="/solicitar/ativando" onClick={() => setDelivery({ cep, rua, numero, complemento, bairro, cidade, uf })} state={{ consulta, quizAnswers: answers }}>Confirmar endereço</Link> : "Confirmar endereço"}
          </Button>
        </div>
      </main>
    </div>
  </div>;
}
