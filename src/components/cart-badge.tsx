"use client";

import { useSyncExternalStore } from "react";
import { subscribeCart, getCartSnapshot, getServerSnapshot } from "./cart-storage";

export function CartBadge() {
  const raw = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  let count = 0;
  try {
    const parsed = JSON.parse(raw) as Array<{ quantity?: number }>;
    if (Array.isArray(parsed)) {
      count = parsed.reduce((acc, item) => acc + (Number(item?.quantity) || 0), 0);
    }
  } catch {
    count = 0;
  }

  return <span aria-label={`${count} itens na sacola`}>{count}</span>;
}
