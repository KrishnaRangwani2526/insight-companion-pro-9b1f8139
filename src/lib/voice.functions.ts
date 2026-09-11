import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  audioBase64: z.string().min(100, "Recording is empty"),
  lang: z.string().optional(),
  extract: z.boolean().optional(),
});

export interface BusinessFields {
  name?: string;
  owner?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pin?: string;
  category?: string;
  type?: string;
}

export interface VoiceResult {
  text: string;
  fields: BusinessFields;
}

function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.includes(",") ? b64.slice(b64.indexOf(",") + 1) : b64;
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * Transcribes a recorded WAV clip with Lovable AI (speech-to-text) and, when
 * asked, extracts business profile fields from what was said. The transcript
 * keeps the speaker's own language and script.
 */
export const transcribeBusinessVoice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<VoiceResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Voice service is not configured");

    const bytes = base64ToBytes(data.audioBase64);
    if (bytes.byteLength < 4096) throw new Error("That recording was too short — please try again.");

    const form = new FormData();
    form.append("model", "google/gemini-3.5-transcribe");
    form.append("file", new Blob([bytes as BlobPart], { type: "audio/wav" }), "recording.wav");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Too many requests just now — please try again in a moment.");
      if (res.status === 402 || res.status === 403) throw new Error("Voice credits are unavailable right now.");
      throw new Error(`Transcription failed (${res.status}) ${body.slice(0, 200)}`);
    }
    const json = (await res.json()) as { text?: string };
    const text = (json.text ?? "").trim();
    if (!text || !data.extract) return { text, fields: {} };

    const chat = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You read a spoken introduction from an Indian artisan or small business owner, in any Indian language. " +
              "Extract only what is actually said. Return JSON with keys: name (business name), owner (person name), " +
              "village (gaav), block (tehsil/taluka), district (zila), state, pin (6 digits), " +
              "category (exactly one of: Handloom & Textiles, Pottery & Terracotta, Bags & Accessories, Bamboo & Cane, Jewellery, Food & Spices, Wood Craft, Other), " +
              "type (one of: Artisan, Farmer, Manufacturer, Retailer, Service Provider, Other). " +
              "Write place names, business name and owner name in English (Latin) script. Omit any key that was not mentioned. Never invent values.",
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!chat.ok) return { text, fields: {} };
    const chatJson = (await chat.json()) as { choices?: { message?: { content?: string } }[] };
    let fields: BusinessFields = {};
    try {
      const parsed = JSON.parse(chatJson.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
      const pick = (k: keyof BusinessFields) => {
        const v = parsed[k];
        return typeof v === "string" && v.trim() ? v.trim() : undefined;
      };
      fields = {
        name: pick("name"),
        owner: pick("owner"),
        village: pick("village"),
        block: pick("block"),
        district: pick("district"),
        state: pick("state"),
        pin: pick("pin"),
        category: pick("category"),
        type: pick("type"),
      };
    } catch {
      fields = {};
    }
    return { text, fields };
  });
