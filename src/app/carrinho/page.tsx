import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Sacola de compras",
  description: "Revise suas camisas selecionadas na sacola de compras da SOLE.",
};

export default function CartPage() {
  return <CartView />;
}
