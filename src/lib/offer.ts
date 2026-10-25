/** Illustrative offer, not a lender's underwriting decision. */
export function calculateSimulatedLimit(answers: readonly string[]): number {
  const income: Record<string, number> = { "Até R$ 2.000": 3000, "R$ 2.000 — R$ 5.000": 5000, "R$ 5.000 — R$ 10.000": 8000, "R$ 10.000 — R$ 20.000": 12000, "Acima de R$ 20.000": 18000 };
  const occupation: Record<string, number> = { "CLT (Empregado)": 1, "Autônomo": 0.9, "Servidor Público": 1.1, "Empresário / MEI": 1, "Aposentado": 1, "Estudante": 0.8 };
  const base = income[answers[2] ?? ""] ?? 3000;
  const factor = occupation[answers[1] ?? ""] ?? 1;
  return Math.max(3000, Math.round(base * factor * (answers[3] === "Sim, possuo" ? 0.75 : 1) / 100) * 100);
}
export const formatLimit = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
declare module "@tanstack/react-router" { interface HistoryState { quizAnswers?: string[]; } }
