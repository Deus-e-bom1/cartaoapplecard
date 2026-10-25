import { useEffect, useRef, useState } from "react";
import { Camera, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSelfiePhoto } from "@/lib/selfie-photo";

export function SelfieCapture({ onContinue }: { onContinue?: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    setReady(false);
    setError("");
    const openCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("A câmera não está disponível neste navegador. Abra esta página em um navegador com acesso à câmera.");
          return;
        }
        const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } }, audio: false });
        if (disposed) { media.getTracks().forEach(track => track.stop()); return; }
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          await video.current.play();
        }
      } catch (cause) {
        if (disposed) return;
        const denied = cause instanceof DOMException && (cause.name === "NotAllowedError" || cause.name === "SecurityError");
        setError(denied ? "Permita o acesso à câmera para tirar sua selfie. Você pode alterar essa permissão nas configurações do navegador." : "Não foi possível abrir a câmera. Confira se ela está disponível e tente novamente.");
      }
    };
    void openCamera();
    return () => { disposed = true; stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; };
  }, [attempt]);

  function capture() {
    const element = video.current;
    if (!ready || !element || !element.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) { setError("Não foi possível capturar a foto. Tente novamente."); return; }
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(element, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSelfiePhoto(dataUrl);
    setPhoto(dataUrl);
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    onContinue?.();
  }

  return <>
    <main className="flex min-h-0 flex-1 items-center justify-center px-6 py-8">
      <div className="relative h-[300px] w-[240px] shrink-0 overflow-hidden rounded-[46%] border-[3px] border-brand bg-camera-surface">
        {photo ? <img src={photo} alt="Selfie capturada" className="h-full w-full object-cover" /> : <video ref={video} muted autoPlay playsInline onLoadedData={() => setReady(true)} aria-label="Imagem ao vivo da câmera frontal" className="h-full w-full -scale-x-100 object-cover" />}
        {!photo && <div className="pointer-events-none absolute inset-x-7 inset-y-8 rounded-[50%] border-2 border-dashed border-ink-foreground/25" />}
        {!ready && !photo && <div className="absolute inset-0 flex items-center justify-center text-ink-foreground/50">{error ? <Camera className="h-8 w-8" /> : <LoaderCircle className="h-8 w-8 animate-spin motion-reduce:animate-none" aria-label="Abrindo câmera" />}</div>}
      </div>
    </main>
    <footer className="shrink-0 px-2 pb-6 text-center">
      <h1 className="text-lg font-bold">{photo ? "Foto capturada" : error ? "Câmera indisponível" : ready ? "Câmera pronta" : "Posicione seu rosto"}</h1>
      <p className="mx-auto mt-2 max-w-sm px-4 text-sm leading-relaxed text-ink-foreground/70" role={error ? "alert" : undefined}>{photo ? "Sua foto não foi enviada. A verificação de identidade ainda não foi realizada." : error || "Clique em capturar quando estiver pronto"}</p>
      <Button onClick={photo || error ? () => { setPhoto(null); setAttempt(value => value + 1); } : capture} disabled={!photo && !error && !ready} className="mt-8 h-[52px] w-full rounded-xl bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90">{photo ? <><Camera /> Tirar outra foto</> : error ? "Tentar novamente" : "Capturar foto"}</Button>
      {photo && <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-foreground/50"><Check className="h-3 w-3" /> Foto mantida somente nesta tela</p>}
    </footer>
  </>;
}