import type { Metadata } from "next";
import Image from "next/image";
import { listProducts } from "@/application/catalog/list-products";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "A coleção" };

export default async function ProductsPage() {
  const products = await listProducts(catalogRepository);
  if (!products.length) {
    return <EmptyState eyebrow="A COLEÇÃO SOLE" title="Estamos preparando o próximo capítulo." description="Nossa coleção de camisas ainda não está disponível. Volte em breve para conhecer as peças." href="/" action="Voltar ao início" />;
  }
  return (
    <section className="catalog-section">
      <p className="eyebrow">SOLE · CAMISARIA</p><h1>A coleção</h1>
      <p className="body-copy">As compras ainda não estão disponíveis.</p>
      <div className="product-grid">{products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
          <h2>{product.name}</h2><p>{product.description}</p>
        </article>
      ))}</div>
    </section>
  );
}
