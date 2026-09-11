import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (Devanagari script)",
  pa: "Punjabi (Gurmukhi script)",
  mr: "Marathi (Devanagari script)",
  gu: "Gujarati script",
  bn: "Bengali script",
  ta: "Tamil script",
  te: "Telugu script",
  kn: "Kannada script",
};

const inputSchema = z.object({
  lang: z.string().min(2).max(5),
  texts: z.array(z.string().min(1).max(400)).min(1).max(60),
});

export type TranslateBatchResult = { translations: Record<string, string> };

function gatewayError(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
    const message = parsed.error?.message ?? parsed.message;
    if (message) return message;
  } catch {
    // not JSON
  }
  if (status === 401) return "Translation is not configured.";
  if (status === 402) return "AI credits are unavailable. Please add credits and try again.";
  if (status === 403) return "AI translation is disabled for this workspace.";
  if (status === 429) return "Translation is busy. Please try again in a moment.";
  return `Translation failed (${status}).`;
}

/** Read the streamed Responses API body and return the final text. */
async function readStream(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Translation returned no data.");
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let completed = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "response.completed" && event.response?.output_text) {
          completed = event.response.output_text;
        }
      } catch {
        // ignore partial or non-JSON events
      }
    }
  }

  return text || completed;
}

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<TranslateBatchResult> => {
    const target = LANG_NAMES[data.lang];
    if (!target) return { translations: {} };

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Translation is not configured.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low" },
        instructions:
          `Translate short interface labels for a mobile app used by Indian artisans and small sellers into ${target}. ` +
          "Rules: return one translation per input, in the same order; keep the meaning natural and short enough for a button or label; " +
          "keep numbers, currency symbols, ₹ amounts, percentages and emoji as they are; do not translate brand names or the app name Kalaa Setu; " +
          "use everyday spoken words a village shopkeeper understands, not formal or literary words; never add explanations or quotes.",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({ texts: data.texts }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "translations",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                translations: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["translations"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(gatewayError(response.status, body));
    }

    const raw = await readStream(response);
    if (!raw) return { translations: {} };

    let list: string[] = [];
    try {
      const parsed = JSON.parse(raw) as { translations?: unknown };
      if (Array.isArray(parsed.translations)) {
        list = parsed.translations.map((value) => (typeof value === "string" ? value : ""));
      }
    } catch {
      return { translations: {} };
    }

    const translations: Record<string, string> = {};
    data.texts.forEach((source, index) => {
      const value = list[index]?.trim();
      if (value) translations[source] = value;
    });
    return { translations };
  });
