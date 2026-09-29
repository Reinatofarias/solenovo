import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Sacola" };

export default function CartPage() {
  return <EmptyState eyebrow="SUA SACOLA" title="Ainda não há peças por aqui." description="Nossa coleção está em preparação. Quando as compras estiverem disponíveis, você poderá escolher suas camisas aqui." href="/produtos" action="Ver a coleção" />;
}
