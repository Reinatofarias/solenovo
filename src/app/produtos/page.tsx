import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/application/catalog/list-products";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";
import { EmptyState } from "@/components/empty-state";
import { formatPrice } from "@/components/product-detail-view";

export const metadata: Metadata = { title: "A coleção" };

export default async function ProductsPage() {
  const products = await listProducts(catalogRepository);
  if (!products.length) {
    return (
      <EmptyState
        eyebrow="A COLEÇÃO SOLE"
        title="Estamos preparando o próximo capítulo."
        description="Nossa coleção de camisas ainda não está disponível. Volte em breve para conhecer as peças."
        href="/"
        action="Voltar ao início"
      />
    );
  }

  return (
    <section className="catalog-section">
      <div className="catalog-header">
        <p className="eyebrow"><span className="status-dot" /> SOLE · CAMISARIA</p>
        <h1>A coleção</h1>
        <p className="body-copy">
          Peças autorais com corte impecável e tecidos nobres. Explore as criações e detalhes de cada camisa.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const prices = product.variants.map((v) => v.priceInCents);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const priceDisplay =
            minPrice === maxPrice
              ? formatPrice(minPrice)
              : `A partir de ${formatPrice(minPrice)}`;
          const sizes = Array.from(new Set(product.variants.map((v) => v.size))).join(" · ");

          return (
            <article className="product-card" key={product.id}>
              <Link href={`/produtos/${product.slug}`} className="product-card-link">
                <div className="product-image">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="admin-product-placeholder">S</div>
                  )}
                </div>
                <div className="product-card-details">
                  {product.collection && (
                    <span className="small-label product-card-collection">{product.collection}</span>
                  )}
                  <h2>{product.name}</h2>
                  <p className="product-card-price">{priceDisplay}</p>
                  {sizes && <p className="product-card-sizes">Tamanhos: {sizes}</p>}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
