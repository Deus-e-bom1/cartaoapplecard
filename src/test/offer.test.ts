import { describe, expect, it } from "vitest";
import { calculateSimulatedLimit } from "@/lib/offer";
describe("simulated chat offer", () => {
  it("never offers less than Carla's R$ 3,000 minimum", () => {
    for (const income of ["Até R$ 2.000", "R$ 2.000 — R$ 5.000", "R$ 5.000 — R$ 10.000", "R$ 10.000 — R$ 20.000", "Acima de R$ 20.000"])
      for (const job of ["CLT (Empregado)", "Autônomo", "Servidor Público", "Empresário / MEI", "Aposentado", "Estudante"])
        for (const restriction of ["Sim, possuo", "Não possuo"])
          expect(calculateSimulatedLimit(["Viagens", job, income, restriction])).toBeGreaterThanOrEqual(3000);
    expect(calculateSimulatedLimit([])).toBe(3000);
  });
  it("varies with quiz income rather than the video amount", () => {
    expect(calculateSimulatedLimit(["Viagens", "CLT (Empregado)", "Até R$ 2.000", "Não possuo"])).toBe(3000);
    expect(calculateSimulatedLimit(["Viagens", "CLT (Empregado)", "R$ 5.000 — R$ 10.000", "Não possuo"])).toBe(8000);
  });
  it("applies the proposed occupation and restriction factors", () => {
    expect(calculateSimulatedLimit(["Viagens", "Servidor Público", "R$ 5.000 — R$ 10.000", "Não possuo"])).toBe(8800);
    expect(calculateSimulatedLimit(["Viagens", "Estudante", "R$ 5.000 — R$ 10.000", "Sim, possuo"])).toBe(4800);
  });
});
