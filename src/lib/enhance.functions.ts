import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function errorMessage(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
    const message = parsed.error?.message ?? parsed.message;
    if (message) return message;
  } catch {
    // not JSON
  }
  if (status === 401) return "AI is not configured.";
  if (status === 402) return "AI credits are unavailable. Please add credits and try again.";
  if (status === 403) return "AI is disabled for this workspace.";
  if (status === 429) return "AI is busy right now. Please wait a moment and try again.";
  return `AI request failed (${status}).`;
}

async function callGateway(apiKey: string, body: Record<string, unknown>) {
  const delays = [0, 1200, 3000];
  let last: Response | undefined;
  for (const delay of delays) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    const attempt = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify(body),
    });
    if (attempt.ok) return attempt;
    last = attempt;
    if (attempt.status !== 429 && attempt.status < 500) break;
  }
  const text = last ? await last.text().catch(() => "") : "";
  throw new Error(errorMessage(last?.status ?? 500, text));
}

/* ---------------- Photo enhancement ---------------- */

const photoInput = z.object({
  imageDataUrl: z.string().startsWith("data:image/").max(1_500_000),
  style: z.enum(["studio", "lifestyle", "clean"]).default("studio"),
});

const STYLE_PROMPT: Record<"studio" | "lifestyle" | "clean", string> = {
  studio:
    "Re-light it like a professional product studio shot: soft even lighting, gentle shadow under the product, plain light neutral background, centred composition.",
  lifestyle:
    "Keep it natural but make it look like a warm lifestyle catalogue photo: soft daylight, tasteful simple surroundings, pleasant depth.",
  clean:
    "Only clean it up: remove clutter and distractions in the background, straighten, brighten and sharpen. Keep the same setting.",
};

export const enhanceProductPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => photoInput.parse(data))
  .handler(async ({ data }): Promise<{ imageDataUrl: string }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured.");

    const response = await callGateway(apiKey, {
      model: "google/gemini-3.1-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "Enhance this handmade product photo so it can be used on an online marketplace listing.",
                STYLE_PROMPT[data.style],
                "Keep the product exactly the same: same shape, same weave/texture, same true colours, same patterns.",
                "Do not add text, logos, watermarks, people or extra objects. Do not invent product details.",
                "Return the enhanced image.",
              ].join(" "),
            },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
    });

    const json = (await response.json()) as {
      choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
    };
    const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!url?.startsWith("data:image/")) {
      throw new Error("AI could not enhance this photo. Please try another photo.");
    }
    return { imageDataUrl: url };
  });

/* ---------------- Description enhancement ---------------- */

const descInput = z.object({
  /** Raw words from the seller, in any language. */
  rawText: z.string().max(4000).optional(),
  /** Known product facts, already in English. */
  facts: z.record(z.string(), z.string()).optional(),
  imageDataUrl: z.string().startsWith("data:image/").max(1_500_000).optional(),
});

const descSchema = z.object({
  seoTitle: z.string().default(""),
  shortDescription: z.string().default(""),
  seoDescription: z.string().default(""),
  bullets: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  hashtags: z.array(z.string()).default([]),
  metaDescription: z.string().default(""),
});

export type EnhancedDescription = z.infer<typeof descSchema>;

const DESC_SYSTEM = [
  "You are an e-commerce copywriter for Indian handmade products (Amazon, Flipkart, Etsy, Instagram).",
  "Write in clear, natural English that a global buyer understands.",
  "Use only the facts given or clearly visible in the photo. Never invent certification, origin, awards, size, price or materials.",
  "Return one JSON object with keys: seoTitle, shortDescription, seoDescription, bullets, keywords, hashtags, metaDescription.",
  "seoTitle: under 70 characters, product type first, then material/craft/colour.",
  "shortDescription: 1 to 2 sentences for a product card.",
  "seoDescription: 90 to 140 words, easy to read, weaves in the search keywords naturally, mentions material, craft technique, use and care when known.",
  "bullets: 4 to 6 short benefit/feature lines.",
  "keywords: 6 to 10 lowercase search phrases buyers type.",
  "hashtags: 5 to 8 social tags starting with #.",
  "metaDescription: under 155 characters.",
].join(" ");

export const enhanceDescription = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => descInput.parse(data))
  .handler(async ({ data }): Promise<EnhancedDescription> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured.");
    if (!data.rawText?.trim() && !data.facts && !data.imageDataUrl) {
      throw new Error("Say or type something about the product first.");
    }

    const facts = Object.entries(data.facts ?? {})
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `- ${k}: ${v.trim()}`)
      .join("\n");

    const parts: { type: string; text?: string; image_url?: { url: string } }[] = [
      {
        type: "text",
        text: data.rawText?.trim()
          ? `The seller said (may be in an Indian language — understand it, then write in English):\n"""${data.rawText.trim()}"""`
          : "The seller gave no note — use the known details and the photo.",
      },
    ];
    if (facts) parts.push({ type: "text", text: `Known product details:\n${facts}` });
    if (data.imageDataUrl) {
      parts.push({ type: "text", text: "Product photo:" });
      parts.push({ type: "image_url", image_url: { url: data.imageDataUrl } });
    }

    const response = await callGateway(apiKey, {
      model: "google/gemini-3.8-flash",
      messages: [
        { role: "system", content: DESC_SYSTEM },
        { role: "user", content: parts },
      ],
      response_format: { type: "json_object" },
    });

    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI could not write the description. Please try again.");
    try {
      const parsed = descSchema.parse(JSON.parse(content));
      return {
        ...parsed,
        bullets: parsed.bullets.slice(0, 6),
        keywords: parsed.keywords.slice(0, 10),
        hashtags: parsed.hashtags.slice(0, 8),
      };
    } catch {
      throw new Error("AI returned an incomplete description. Please try again.");
    }
  });
