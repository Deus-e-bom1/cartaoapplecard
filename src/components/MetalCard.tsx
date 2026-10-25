
import { motion } from "framer-motion";
import { useId } from "react";
import { useAnimationReducedMotion } from "@/hooks/use-animation-reduced-motion";

export type CardColor = "Titanium" | "Midnight" | "Starlight";

export function TitanCard({ name = "SEU NOME AQUI", color = "Titanium", fill = false, className = "", ariaLabel }: { name?: string; color?: CardColor; fill?: boolean; className?: string; ariaLabel?: string }) {

  const reducedMotion = useAnimationReducedMotion();
  const logoId = useId();
  return (
    <motion.div
      className={`relative mx-auto [perspective:800px] ${fill ? `aspect-[1.586] w-full ${className}` : "mb-8 mt-6 h-[165px] w-[260px] min-[381px]:h-[190px] min-[381px]:w-[300px]"}`}
      aria-label={ariaLabel}

      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.8,
        delay: reducedMotion ? 0 : 0.1,
        ease: "easeOut",
      }}
    >
      <motion.div
        className={`titan-card titan-card-${color.toLowerCase()} relative h-full w-full overflow-hidden rounded-2xl`}
        style={{ rotateX: reducedMotion ? 0 : 5, rotateY: reducedMotion ? 0 : -5 }}
        animate={{ y: reducedMotion ? 0 : [0, -8, 0] }}
        whileHover={{ rotateX: 0, rotateY: 0 }}
        transition={{
          y: {
            duration: reducedMotion ? 0 : 6,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          },
          default: { duration: 0.4 },
        }}
      >
        {/* Textura metálica */}
        <div
          className="titan-texture pointer-events-none absolute inset-0"
        />

        {/* Logotipo Apple */}
        <div className="absolute left-6 top-6 z-10">
          <svg
            width="38"
            height="42"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Apple"
          >
            <defs>
              <linearGradient
                id={logoId}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--titan-logo-mid)" />
                <stop offset="40%" stopColor="var(--titan-logo-light)" />
                <stop offset="75%" stopColor="var(--titan-logo-dark)" />
                <stop offset="100%" stopColor="var(--titan-logo-end)" />
              </linearGradient>
            </defs>

            <path
              d="M31.5 20.2C25.4 20.2 23.6 16.5 16.1 17.3C6.7 18.2 2.1 27.4 3.8 39.5C5.6 52 12.7 61 19.2 61C24.7 61 26.2 58.5 31.9 58.5C37.2 58.5 39 61 44 61C49.8 61 55.6 53 57.6 45.1C49.9 43.1 46.9 34.1 51.1 27.2C52.5 24.9 54.3 23.5 56.2 22.2C51.4 16.1 45.1 16.6 42.3 17.1C36.6 18 35.5 20.2 31.5 20.2Z"
              fill={`url(#${logoId})`}
              stroke="var(--titan-logo-stroke)"
              strokeWidth="1.2"
            />

            <path
              d="M32 17.4C32 8 39.4 2.8 46.8 2.4C47 10.1 40.3 17.3 32 17.4Z"
              fill={`url(#${logoId})`}
              stroke="var(--titan-logo-stroke)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Chip metálico */}
        <div
          className="titan-chip absolute bottom-[54px] right-[28px] z-10 grid h-[24px] w-[32px] grid-cols-2 grid-rows-3 gap-[2px] rounded-[5px] p-[3px]"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="titan-chip-cell rounded-[3px]"
            />
          ))}
        </div>

        {/* Nome do titular */}
        <span
          className="titan-name absolute bottom-[45px] left-6 right-[70px] z-10 break-words text-[12px] font-semibold uppercase leading-tight tracking-normal"
        >
          {name}
        </span>


        {/* Descrição do cartão */}
        <span
          className="titan-description absolute bottom-[26px] left-6 z-10 text-[10px] font-medium uppercase tracking-normal"
        >
          APPLE CARD • {color.toUpperCase()}
        </span>


        {/* Logotipo VISA */}
        <span
          className="titan-visa absolute bottom-[25px] right-[25px] z-10 text-[15px] font-black italic tracking-normal"
        >
          VISA
        </span>

        {/* Efeito de brilho animado */}
        <div
          aria-hidden="true"
          className="titan-shine pointer-events-none absolute inset-y-0 z-20 w-[60%]"
        />
      </motion.div>
    </motion.div>
  );
}

export { TitanCard as MetalCard };
