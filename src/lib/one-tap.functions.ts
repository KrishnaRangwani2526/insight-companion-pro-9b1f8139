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
  imageDataUrl: z.string().startsWith("data:image/").max(1_500_000).optional(),
  /** What the person said or typed, in their own language. */
  localText: z.string().max(4000).optional(),
  /** Answers already given to earlier follow-up questions. */
  answers: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .max(12)
    .optional(),
});

const fieldsSchema = z.object({
  name: z.string().default(""),
  category: z.enum(CATEGORIES).default("Other"),
  material: z.string().default(""),
  colour: z.string().default(""),
  size: z.string().default(""),
  weight: z.string().default(""),
  useCase: z.string().default(""),
  howMade: z.string().default(""),
  craftOrigin: z.string().default(""),
  care: z.string().default(""),
  quantity: z.string().default(""),
  priceIdea: z.string().default(""),
  description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
});

const resultSchema = z.object({
  englishText: z.string().default(""),
  detectedLanguage: z.string().default(""),
  fields: fieldsSchema,
  /** Only the details still missing, asked back in plain words. */
  questions: z
    .array(z.object({ field: z.string(), question: z.string() }))
    .default([]),
  confidenceNote: z.string().default(""),
});

export type OneTapFields = z.infer<typeof fieldsSchema>;
export type OneTapResult = z.infer<typeof resultSchema>;

function errorMessage(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
    const message = parsed.error?.message ?? parsed.message;
    if (message) return message;
  } catch {
    // Upstream body is not JSON.
  }
  if (status === 401) return "One Tap AI is not configured.";
  if (status === 402) return "AI credits are unavailable. Please add credits and try again.";
  if (status === 403) return "AI is disabled for this workspace.";
  if (status === 429) return "AI is busy right now. Please wait a moment and try again.";
  return `One Tap AI failed (${status}).`;
}

const SYSTEM = [
  "You help an Indian artisan register a product with one tap.",
  "Inputs may be a product photo and/or a spoken note in any Indian language (Hindi, Marathi, Tamil, Bengali, Gujarati, Telugu, Kannada, Punjabi, Odia, Malayalam, Assamese, Urdu or English).",
  "Steps: 1) read the note in its own language, 2) translate it to natural English, 3) look at the photo, 4) fill the registration fields by combining photo evidence and the note.",
  "Return one JSON object with exactly these keys: englishText, detectedLanguage, fields, questions, confidenceNote.",
  "fields is an object with keys: name, category, material, colour, size, weight, useCase, howMade, craftOrigin, care, quantity, priceIdea, description, keywords.",
  `category must be exactly one of: ${CATEGORIES.join(", ")}.`,
  "size means dimensions such as height x width in cm or inches — estimate from the photo only when an obvious reference exists, otherwise leave it empty and ask about it.",
  "Use an empty string for anything not visible and not said. Never invent provenance, certification, price, dimensions or manufacturing claims.",
  "keywords: 4 to 8 short search words in English.",
  "description: 2 to 4 sales-ready English sentences using only known facts.",
  "questions: one short, simple question per still-missing important field (field = the field key). Ask at most 5. Ask nothing that is already known.",
  "All field values must be in English, except englishText which is the English translation of the note.",
].join(" ");

export const oneTapUnderstand = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<OneTapResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("One Tap AI is not configured.");
    if (!data.imageDataUrl && !data.localText?.trim()) {
      throw new Error("Add a photo or say something first.");
    }

    const parts: { type: string; text?: string; image_url?: { url: string } }[] = [];
    parts.push({
      type: "text",
      text: data.localText?.trim()
        ? `Spoken/typed note from the seller (their own language):\n"""${data.localText.trim()}"""`
        : "The seller gave no note yet — work from the photo alone.",
    });
    if (data.answers?.length) {
      parts.push({
        type: "text",
        text:
          "Answers already given to follow-up questions:\n" +
          data.answers.map((a) => `- ${a.question} -> ${a.answer}`).join("\n"),
      });
    }
    if (data.imageDataUrl) {
      parts.push({ type: "text", text: "Product photo:" });
      parts.push({ type: "image_url", image_url: { url: data.imageDataUrl } });
    }

    const delays = [0, 1000, 2500];
    let last: Response | undefined;
    let response: Response | undefined;
    for (const delay of delays) {
      if (delay) await new Promise((r) => setTimeout(r, delay));
      const attempt = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "google/gemini-3.8-flash",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: parts },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (attempt.ok) {
        response = attempt;
        break;
      }
      last = attempt;
      if (attempt.status !== 429 && attempt.status < 500) break;
    }

    if (!response) {
      const body = last ? await last.text().catch(() => "") : "";
      throw new Error(errorMessage(last?.status ?? 500, body));
    }

    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI could not read this. Please try a clearer photo or say a bit more.");

    try {
      const parsed = resultSchema.parse(JSON.parse(content));
      return {
        ...parsed,
        fields: { ...parsed.fields, keywords: parsed.fields.keywords.slice(0, 8) },
        questions: parsed.questions.slice(0, 5),
      };
    } catch {
      throw new Error("AI returned incomplete details. Please try again.");
    }
  });
