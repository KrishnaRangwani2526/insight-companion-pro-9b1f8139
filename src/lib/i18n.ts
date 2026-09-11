import type { LangCode } from "./types";

export const LANGUAGES: { code: LangCode; label: string; native: string; short: string }[] = [
  { code: "en", label: "English", native: "English", short: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", short: "हिं" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", short: "ਪੰ" },
  { code: "mr", label: "Marathi", native: "मराठी", short: "मरा" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", short: "ગુ" },
  { code: "bn", label: "Bengali", native: "বাংলা", short: "বাং" },
  { code: "ta", label: "Tamil", native: "தமிழ்", short: "தமி" },
  { code: "te", label: "Telugu", native: "తెలుగు", short: "తె" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", short: "ಕ" },
];

type Dict = Record<string, string>;

const en: Dict = {
  greeting: "Good morning",
  health: "Business Health",
  fullView: "full view",
  quickActions: "QUICK ACTIONS",
  snapshot: "TODAY'S SNAPSHOT",
  catalogue: "YOUR CATALOGUE",
  addProduct: "Add Product",
  createAd: "Create Ad",
  checkPrice: "Check Price",
  recordSale: "Record Sale",
  askAi: "Ask your AI helper",
  speakPlaceholder: "Boliye — speak in your language…",
  home: "Home",
  products: "Products",
  aiStudio: "AI Studio",
  orders: "Orders",
  more: "More",
  viewHealth: "View Business Health",
};

const sub: Partial<Record<LangCode, Dict>> = {
  hi: {
    greeting: "नमस्ते",
    health: "व्यापार की सेहत",
    fullView: "पूरा दृश्य",
    quickActions: "तुरंत काम",
    snapshot: "आज का हाल",
    catalogue: "आपके प्रोडक्ट",
    addProduct: "प्रोडक्ट जोड़ें",
    createAd: "विज्ञापन बनाएं",
    checkPrice: "कीमत देखें",
    recordSale: "बिक्री दर्ज करें",
    askAi: "एआई से पूछें",
    speakPlaceholder: "बोलिए — अपनी भाषा में…",
    home: "होम",
    products: "प्रोडक्ट",
    aiStudio: "एआई स्टूडियो",
    orders: "ऑर्डर",
    more: "और",
    viewHealth: "पूरी रिपोर्ट देखें",
  },
  pa: {
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    health: "ਕਾਰੋਬਾਰ ਦੀ ਸਿਹਤ",
    addProduct: "ਉਤਪਾਦ ਜੋੜੋ",
    createAd: "ਇਸ਼ਤਿਹਾਰ ਬਣਾਓ",
    checkPrice: "ਕੀਮਤ ਵੇਖੋ",
    recordSale: "ਵਿਕਰੀ ਦਰਜ ਕਰੋ",
    home: "ਘਰ",
    products: "ਉਤਪਾਦ",
    orders: "ਆਰਡਰ",
    more: "ਹੋਰ",
  },
  bn: {
    greeting: "নমস্কার",
    health: "ব্যবসার স্বাস্থ্য",
    addProduct: "পণ্য যোগ করুন",
    createAd: "বিজ্ঞাপন বানান",
    checkPrice: "দাম দেখুন",
    recordSale: "বিক্রি লিখুন",
    home: "হোম",
    products: "পণ্য",
    orders: "অর্ডার",
    more: "আরও",
  },
  ta: {
    greeting: "வணக்கம்",
    health: "வணிக ஆரோக்கியம்",
    addProduct: "பொருள் சேர்",
    createAd: "விளம்பரம் உருவாக்கு",
    checkPrice: "விலை பார்",
    recordSale: "விற்பனை பதிவு",
    home: "முகப்பு",
    products: "பொருட்கள்",
    orders: "ஆர்டர்",
    more: "மேலும்",
  },
};

export function t(lang: LangCode, key: keyof typeof en): string {
  return sub[lang]?.[key] ?? en[key] ?? String(key);
}

/** Second line shown under English labels for low-literacy support. */
export function localLine(lang: LangCode, key: keyof typeof en): string | null {
  if (lang === "en") return null;
  const v = sub[lang]?.[key];
  return v && v !== en[key] ? v : null;
}
