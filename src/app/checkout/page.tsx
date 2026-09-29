import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Compras em breve" };

export default function CheckoutPage() {
  return <EmptyState eyebrow="COMPRAS EM BREVE" title="Ainda estamos nos preparando." description="As compras ainda não estão disponíveis. Nenhum pagamento pode ser realizado neste momento." href="/produtos" action="Voltar à coleção" />;
}
