export interface LocalCartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

const STORAGE_KEY = "sole_cart_v1";

export function getStoredCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is LocalCartItem =>
          typeof item?.productId === "string" &&
          typeof item?.variantId === "string" &&
          typeof item?.quantity === "number" &&
          item.quantity > 0
      );
    }
  } catch {
    // fallback if corrupted
  }
  return [];
}

export function saveStoredCart(items: LocalCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("sole:cart-updated"));
  } catch {
    // storage limits
  }
}

export function addToCart(productId: string, variantId: string, quantity = 1): void {
  const items = getStoredCart();
  const existing = items.find((item) => item.variantId === variantId);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    items.push({ productId, variantId, quantity: Math.min(10, quantity) });
  }
  saveStoredCart(items);
}

export function updateCartQuantity(variantId: string, quantity: number): void {
  const items = getStoredCart();
  if (quantity <= 0) {
    removeFromCart(variantId);
    return;
  }
  const match = items.find((item) => item.variantId === variantId);
  if (match) {
    match.quantity = Math.min(10, Math.max(1, quantity));
    saveStoredCart(items);
  }
}

export function removeFromCart(variantId: string): void {
  const items = getStoredCart().filter((item) => item.variantId !== variantId);
  saveStoredCart(items);
}

export function subscribeCart(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sole:cart-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sole:cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function getServerSnapshot(): string {
  return "[]";
}
