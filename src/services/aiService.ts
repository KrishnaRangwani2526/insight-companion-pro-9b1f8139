/**
 * Mock AI service layer. Every AI feature in the app calls these functions so a
 * real model API can replace the bodies later without touching the UI.
 */

const wait = (ms = 1400) => new Promise<void>((r) => setTimeout(r, ms));

export interface CatalogueCopy {
  title: string;
  short: string;
  full: string;
  keywords: string[];
  hindi: string;
  english: string;
}

export const aiService = {
  async transcribeVoice(lang: string): Promise<string> {
    await wait(2200);
    if (lang === "hi")
      return "यह शॉल हाथ से बुना गया है, शुद्ध सूती धागे से। नीला रंग प्राकृतिक नील से किया है। बनाने में चार दिन लगते हैं।";
    return "This shawl is handwoven with pure cotton yarn. The blue colour comes from natural indigo. It takes four days to make one piece.";
  },

  async generateProductDescription(name: string, material?: string): Promise<CatalogueCopy> {
    await wait();
    const m = material || "handmade natural materials";
    return {
      title: `${name} — Handcrafted in Bhilwara`,
      short: `Authentic ${name.toLowerCase()} made by village artisans using ${m}.`,
      full: `Each ${name.toLowerCase()} is made by hand in a small workshop in Bhilwara, Rajasthan, using ${m}. No two pieces are identical — small variations are the mark of genuine handwork. Made to last for years with simple care: gentle wash, dry in shade.`,
      keywords: [
        name.toLowerCase().split(" ").slice(-2).join(" "),
        "handmade",
        "rajasthan craft",
        "artisan made",
        "natural dye",
        "gift",
      ],
      hindi: `यह ${name} बिलवाड़ा के कारीगरों द्वारा हाथ से बनाया गया है। हर टुकड़ा अलग होता है — यही असली हस्तकला की पहचान है।`,
      english: `Handcrafted ${name.toLowerCase()} from Bhilwara, Rajasthan. Made slowly, by hand, to last.`,
    };
  },

  async enhanceImage(tool: string): Promise<{ tool: string; note: string }> {
    await wait(2000);
    const notes: Record<string, string> = {
      "Remove Background": "Background removed and replaced with clean white.",
      "Improve Lighting": "Shadows lifted, colours balanced for daylight.",
      Sharpen: "Weave detail sharpened without adding noise.",
      "Remove Clutter": "Stray objects around the product cleaned up.",
      "White Background": "Studio white background applied.",
      "Marketplace Format": "Cropped to 1:1, 1000×1000 px — ready for marketplaces.",
      "Social Media Format": "Cropped to 4:5 for Instagram and Facebook.",
      "Generate Product Banner": "Banner created with your product on a soft gradient.",
    };
    return { tool, note: notes[tool] ?? "Image enhanced." };
  },

  async generateAdvertisement(product: string, offer: string, audience: string) {
    await wait();
    return {
      headline: `${product} — straight from the weaver's loom`,
      primary: `Made by hand in Bhilwara. ${offer ? offer + " " : ""}Every purchase supports a village artisan family. Limited pieces available this week.`,
      cta: "Order on WhatsApp",
      caption: `Handmade. Honest. Yours. ✨ ${product} #handmadeinindia #rajasthancrafts #supportartisans`,
      poster: `${product.toUpperCase()}\n${offer || "Handmade with care"}\nOrder today · Free delivery over ₹999`,
      whatsapp: `Namaste 🙏 New ${product} is ready! ${offer || ""} Reply "YES" and I will send photos and price. — Mitti & Dhaga Crafts`,
      audience,
    };
  },

  async generateReelScript(product: string) {
    await wait();
    return {
      concept: `A 20-second "made by hand" reel showing ${product} from raw material to finished piece.`,
      hook: "Guess how many days this takes to make…",
      scenes: [
        "Close-up of hands working the loom, natural morning light.",
        "Time-lapse of the pattern taking shape.",
        "Finished product held up against a mud wall, slow spin.",
      ],
      voiceover: `Four days. One pair of hands. One ${product.toLowerCase()}. Made in a village in Bhilwara.`,
      subtitles: "Hindi and English burned-in subtitles",
      music: "Soft folk rhythm, low volume — trending audio: 'Desi Roots'",
      caption: `4 days of work in 20 seconds. ${product} available now 🧵`,
      hashtags: ["#handmade", "#rajasthan", "#artisan", "#slowmade", "#vocalforlocal"],
    };
  },

  async transformContent(inputSummary: string, outputs: string[], params: Record<string, string>) {
    await wait(1800);
    return outputs.map((o) => ({
      type: o,
      body: buildOutput(o, inputSummary, params),
    }));
  },

  async generateSWOT() {
    await wait();
    return {
      strengths: [
        "Genuine handmade product with a story buyers value",
        "Low raw-material cost — cotton sourced within 20 km",
        "Four generations of weaving skill in the family",
      ],
      weaknesses: [
        "Small production capacity — 6–8 pieces a week",
        "No online presence yet, all sales are local",
        "Prices set by middlemen, not by you",
      ],
      opportunities: [
        "City buyers pay 2–3× local prices for authentic handloom",
        "Festival season demand rises sharply Oct–Dec",
        "Bulk orders from craft emporiums and hotels",
      ],
      threats: [
        "Machine-made lookalikes sold at half the price",
        "Monsoon delays in raw material supply",
        "Dependence on a single wholesale buyer",
      ],
    };
  },

  async generateFeasibility(category: string, capital: number) {
    await wait(1600);
    const score = Math.min(92, 58 + Math.round(capital / 8000) + category.length % 7);
    return {
      score,
      verdict: score >= 75 ? "Good" : score >= 60 ? "Moderate" : "High Risk",
      reach: "48,000 people within 10 km · 11,200 households",
      demand: score - 6,
      opportunity: "Handloom gifting and festival hampers are underserved locally",
      competitorDensity: "12 similar businesses, 3 direct competitors",
      priceRange: "₹450 – ₹1,800 for comparable local products",
      risks: [
        "Raw material price rises in monsoon months",
        "Sales concentrated in Oct–Dec festival season",
        "One wholesale buyer accounts for most bulk sales",
      ],
      explanation:
        "Demand in your block is steady and direct competition is limited, but your sales depend heavily on the festival season and on one bulk buyer. Spreading sales online reduces both risks.",
    };
  },

  async askAssistant(question: string): Promise<string> {
    await wait(1200);
    const q = question.toLowerCase();
    if (q.includes("price") || q.includes("charge") || q.includes("कीमत"))
      return "Based on your cost of ₹780 and the current estimated market range in Bhilwara, a selling price around ₹1,150–₹1,250 may give you a reasonable margin of about 35%. Buyers in Jaipur have been paying closer to ₹1,400 for the same quality.";
    if (q.includes("promote") || q.includes("ad"))
      return "Promote the Handwoven Cotton Shawl first. It sells 2.4× faster than your other products and has your healthiest margin. I can write the advertisement in Hindi and English — open Create Advertisement.";
    if (q.includes("loan") || q.includes("emi") || q.includes("afford"))
      return "With ₹1,00,000 of your own margin money, a 10% margin scheme could support a project of about ₹10,00,000 with a loan of ₹9,00,000. At 8% for 7 years the EMI works out near ₹14,000 per month. Open the Scheme Calculator to check the exact figures.";
    if (q.includes("sales") || q.includes("falling"))
      return "Your sales dipped because two products went out of stock in the last 10 days — the Traditional Dupatta and the Embroidered Bag. Restocking those two should recover about ₹6,000 a month.";
    if (q.includes("online") || q.includes("sell"))
      return "The quickest route is your own store: tap My Store, then Create My Store. It uses your existing products, photos and prices, and gives you a link you can share on WhatsApp.";
    return "Here is what I would do first: restock the 2 products that ran out, then create one advertisement for your best seller and share it on WhatsApp. That combination usually lifts weekly sales the fastest.";
  },
};

function buildOutput(type: string, input: string, params: Record<string, string>) {
  const tone = params['tone'] || "warm";
  switch (type) {
    case "LinkedIn Post":
      return `Four generations. One loom. \n\n${input}\n\nWe are a small artisan workshop in Bhilwara, Rajasthan, now selling directly to buyers for the first time. If your business gifts to clients, handmade tells a better story than anything off a shelf.\n\n#handmade #artisan #ruralenterprise`;
    case "X/Twitter Post":
      return `A handwoven shawl takes 4 days.\nA machine takes 4 minutes.\nOne of them keeps a village employed.\n\n${input.slice(0, 90)}…`;
    case "Instagram Post":
      return `${input}\n\n🧵 Handmade in Bhilwara\n📦 Ships across India\n💬 DM to order\n\n#handmadeinindia #rajasthan #slowfashion`;
    case "Blog":
      return `# The four-day shawl\n\n${input}\n\n## How it is made\nThe yarn is spun locally, dyed with natural indigo, and woven on a pit loom...\n\n## Why it costs what it costs\nA fair price pays for four days of skilled work, not just cloth.`;
    case "Executive Summary":
      return `Mitti & Dhaga Crafts — ${tone} summary\n\n• 5 products, ₹52,900 revenue last month, 46% gross margin\n• Best seller: Handwoven Cotton Shawl (46 units)\n• Key risk: single bulk buyer, seasonal concentration\n• Next step: launch own online store and list on 2 marketplaces`;
    case "Advisory":
      return `Advisory note\n\n1. Restock the two out-of-stock items before the festival window.\n2. Raise the shawl price to ₹1,249 — currently under market.\n3. Move 20% of sales online to reduce buyer concentration.`;
    case "Presentation":
      return `Slide 1 — Mitti & Dhaga Crafts\nSlide 2 — Our craft and our village\nSlide 3 — Products and prices\nSlide 4 — Last 6 months of sales\nSlide 5 — What we need to grow\nSlide 6 — Contact`;
    case "Infographic":
      return `Infographic layout\nTop: "4 days to make one shawl"\nMiddle: 3 icons — spin, dye, weave\nBottom: price breakdown ₹780 cost / ₹469 artisan margin`;
    case "Product Description":
      return input;
    case "Catalogue":
      return `Catalogue page\n1. Handwoven Cotton Shawl — ₹1,249\n2. Terracotta Vase — ₹640\n3. Embroidered Bag — ₹389\n4. Handmade Cane Basket — ₹480\n5. Traditional Dupatta — ₹899`;
    case "Reel":
    case "Video":
      return `Hook (0–2s): "Guess how long this takes."\nScene 1 (2–8s): hands on the loom\nScene 2 (8–15s): pattern forming, time-lapse\nScene 3 (15–20s): finished piece, price card\nVoiceover in ${params['language'] || "Hindi"}`;
    case "WhatsApp Promotion":
      return `Namaste 🙏\n${input.slice(0, 100)}\nReply "YES" for photos and price. Free delivery above ₹999.`;
    default:
      return `${type}\n\n${input}`;
  }
}
