import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return <EmptyState eyebrow="404 · PÁGINA NÃO ENCONTRADA" title="Vamos voltar ao começo?" description="Não encontramos a página que você procurou." href="/" action="Voltar ao início" />;
}
