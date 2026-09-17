export type LangCode =
  | "en"
  | "hi"
  | "pa"
  | "mr"
  | "gu"
  | "bn"
  | "ta"
  | "te"
  | "kn";

export interface Product {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  sold: number;
  image: string;
  /** AI-enhanced studio version of the photo (data URL), when the seller made one. */
  enhancedImage?: string;
  status: "active" | "draft";
  description?: string;
  material?: string;
  colour?: string;
  size?: string;
  keywords?: string[];
  aiLabelled?: boolean;
  bestSeller?: boolean;
  /* SEO / catalogue copy written by AI */
  seoTitle?: string;
  shortDescription?: string;
  seoDescription?: string;
  bullets?: string[];
  hashtags?: string[];
  metaDescription?: string;
  /* Extra product knowledge captured by One Tap AI */
  weight?: string;
  useCase?: string;
  howMade?: string;
  craftOrigin?: string;
  care?: string;
  listedOnESetu?: boolean;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  amount: number;
  address: string;
  payment: "Paid online" | "Cash on delivery";
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  place: string;
  orders: number;
  spent: number;
  lastPurchase: string;
  tag: "Regular" | "New" | "Bulk buyer" | "Inactive";
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: string;
  date: string;
}

export interface BusinessProfile {
  name: string;
  owner: string;
  type: string;
  category: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pin: string;
  about: string;
  goals: string[];
  verified: boolean;
  language: LangCode;
}

export interface StoreConfig {
  published: boolean;
  slug: string;
  theme: "artisan" | "minimal" | "traditional" | "modern" | "local";
  tagline: string;
  whatsapp: string;
  featured: string[];
}

export interface PromotionItem {
  id: string;
  title: string;
  kind: "Product" | "Reel" | "Story" | "Festival offer";
  status: "Pending" | "Approved" | "Published";
}

export interface LessonProgress {
  [lessonId: string]: boolean;
}

export interface AppState {
  onboarded: boolean;
  business: BusinessProfile;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  expenses: Expense[];
  store: StoreConfig;
  promotions: PromotionItem[];
  lessons: LessonProgress;
  notificationsRead: boolean;
  largeText: boolean;
  highContrast: boolean;
}
