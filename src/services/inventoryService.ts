import type { Product } from "@/lib/types";

export const inventoryService = {
  summary(products: Product[]) {
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const value = products.reduce((s, p) => s + p.stock * p.cost, 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= p.reorderLevel);
    const out = products.filter((p) => p.stock === 0);
    return { count: products.length, totalStock, value, low, out };
  },

  async forecast(products: Product[]) {
    await new Promise((r) => setTimeout(r, 900));
    return products
      .map((p) => ({
        product: p,
        weeksLeft: p.sold > 0 ? Math.max(0, Math.round((p.stock / Math.max(1, p.sold / 12)) * 10) / 10) : 12,
        change: Math.round(((p.sold % 7) + 8) * 2.6),
      }))
      .sort((a, b) => a.weeksLeft - b.weeksLeft);
  },
};
