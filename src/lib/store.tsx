import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoState } from "./demo-data";
import type { AppState, Order, Product } from "./types";

const KEY = "kalaa-setu-state-v1";

interface Ctx {
  state: AppState;
  hydrated: boolean;
  update: (patch: Partial<AppState>) => void;
  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addOrder: (o: Order) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
  toggleLesson: (id: string) => void;
  reset: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(demoState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...demoState, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    const product: Product = { ...p, id: `p${Date.now()}` };
    setState((s) => ({ ...s, products: [product, ...s.products] }));
    return product;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
  }, []);

  const addOrder = useCallback((o: Order) => {
    setState((s) => ({ ...s, orders: [o, ...s.orders] }));
  }, []);

  const setOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  }, []);

  const toggleLesson = useCallback((id: string) => {
    setState((s) => ({ ...s, lessons: { ...s.lessons, [id]: !s.lessons[id] } }));
  }, []);

  const reset = useCallback(() => setState({ ...demoState }), []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      update,
      addProduct,
      updateProduct,
      removeProduct,
      addOrder,
      setOrderStatus,
      toggleLesson,
      reset,
    }),
    [state, hydrated, update, addProduct, updateProduct, removeProduct, addOrder, setOrderStatus, toggleLesson, reset],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  useEffect(() => {
    const on = () => {
      setOnline(true);
      setSyncing(true);
      setTimeout(() => setSyncing(false), 1800);
    };
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return { online, syncing };
}

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
