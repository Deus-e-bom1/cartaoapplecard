import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  cpf: z.string().regex(/^\d{11}$/),
});

// The upstream response shape is not documented, so look for the person's
// name and birthdate under the common keys, one level deep as well.
const NAME_KEYS = ["nome", "name", "nome_completo", "nomeCompleto"];
const BIRTH_KEYS = ["nascimento", "data_nascimento", "dataNascimento", "birthdate", "nasc"];
const NESTED_KEYS = ["dados", "data", "result", "resultado", "retorno"];

function pickString(source: unknown, keys: string[]): string | null {
  if (source == null || typeof source !== "object") return null;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return null;
}

function pickDeep(payload: unknown, keys: string[]): string | null {
  const direct = pickString(payload, keys);
  if (direct) return direct;
  if (payload == null || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  for (const nestedKey of NESTED_KEYS) {
    const found = pickString(record[nestedKey], keys);
    if (found) return found;
  }
  return null;
}

function normalizeBirthdate(value: string | null): string | null {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return value;
}

export const Route = createFileRoute("/api/consulta-cpf")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ erro: "CPF inválido." }, { status: 400 });
        }

        const token = process.env["CPF_API_TOKEN"];
        if (!token) {
          console.error("CPF_API_TOKEN is not configured");
          return Response.json({ erro: "Consulta indisponível no momento." }, { status: 503 });
        }

        let payload: unknown;
        try {
          const upstream = await fetch(
            `https://api-apela.online/?user=${encodeURIComponent(token)}&cpf=${parsed.data.cpf}`,
          );
          payload = await upstream.json();
        } catch (error) {
          console.error("CPF lookup upstream failed:", error);
          return Response.json({ erro: "Consulta indisponível no momento." }, { status: 502 });
        }

        const record = payload as { status?: unknown; erro?: unknown } | null;
        if (record?.status === 401 || record?.status === 403 || (typeof record?.status === "number" && record.status >= 500)) {
          console.error("CPF lookup rejected the token:", record?.erro);
          return Response.json({ erro: "Consulta indisponível no momento." }, { status: 502 });
        }
        if (record?.status === 404 || typeof record?.erro === "string") {
          return Response.json({ erro: "CPF não encontrado." }, { status: 404 });
        }

        const nome = pickDeep(payload, NAME_KEYS);
        if (!nome) {
          console.error("CPF lookup returned an unrecognized shape:", JSON.stringify(payload)?.slice(0, 500));
          return Response.json({ erro: "Consulta indisponível no momento." }, { status: 502 });
        }

        return Response.json({
          nome,
          nascimento: normalizeBirthdate(pickDeep(payload, BIRTH_KEYS)),
        });
      },
    },
  },
});
