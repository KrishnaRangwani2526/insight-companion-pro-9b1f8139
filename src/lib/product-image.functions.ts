import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CATEGORIES = [
  "Handloom & Textiles",
  "Pottery & Terracotta",
  "Bags & Accessories",
  "Bamboo & Cane",
  "Jewellery",
  "Food & Spices",
  "Wood Craft",
  "Other",
] as const;

const inputSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/").max(1_500_000),
});

const resultSchema = z.object({
  name: z.string(),
  category: z.enum(CATEGORIES),
  material: z.string(),
  colour: z.string(),
  size: z.string(),
  short: z.string(),
  full: z.string(),
  hindi: z.string(),
  english: z.string(),
  keywords: z.array(z.string()),
});

export type ProductImageAnalysis = z.infer<typeof resultSchema>;

function errorMessage(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
    const message = parsed.error?.message ?? parsed.message;
    if (message) return message;
  } catch {
    // The upstream body is not JSON.
  }
  if (status === 401) return "Product analysis is not configured.";
  if (status === 402) return "AI credits are unavailable. Please add credits and try again.";
  if (status === 403) return "AI product analysis is disabled for this workspace.";
  if (status === 429) return "Product analysis is busy. Please wait a moment and try again.";
  return `Product analysis failed (${status}).`;
}

async function callGateway(apiKey: string, imageDataUrl: string) {
  const delays = [0, 1000, 2500];
  let lastResponse: Response | undefined;

  for (const delay of delays) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You label products for an Indian artisan catalogue. Inspect only visible evidence. " +
              "Return one JSON object with exactly these keys: name, category, material, colour, size, short, full, hindi, english, keywords. " +
              `category must be exactly one of: ${CATEGORIES.join(", ")}. ` +
              "Use an empty string when size or material cannot be inferred. Keep the name concise, descriptions factual and sales-ready, and keywords as 4 to 8 short strings. Do not invent provenance, dimensions, certification, price, or manufacturing claims.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this product photo and return the labelled product data as JSON." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (response.ok) return response;
    lastResponse = response;
    if (response.status !== 429 && response.status < 500) break;
  }

  const body = lastResponse ? await lastResponse.text().catch(() => "") : "";
  throw new Error(errorMessage(lastResponse?.status ?? 500, body));
}

export const analyzeProductImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<ProductImageAnalysis> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Product analysis is not configured.");

    const response = await callGateway(apiKey, data.imageDataUrl);
    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI could not identify this product. Please try a clearer photo.");

    try {
      const parsed = resultSchema.parse(JSON.parse(content));
      return { ...parsed, keywords: parsed.keywords.slice(0, 8) };
    } catch {
      throw new Error("AI returned incomplete product details. Please try the photo again.");
    }
  });