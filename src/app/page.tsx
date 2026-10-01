import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/application/catalog/list-products";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

function formatHomePrice(priceInCents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceInCents / 100);
}

export default async function HomePage() {
  const products = (await listProducts(catalogRepository)).slice(0, 3);
  const hasProducts = products.length > 0;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> SOLE · CAMISARIA</p>
          <h1>{hasProducts ? <>A coleção.<br /><em>Está aqui.</em></> : <>Um novo<br />capítulo.<br /><em>Em breve.</em></>}</h1>
          <p className="body-copy">
            {hasProducts
              ? "Conheça as peças disponíveis da primeira coleção SOLE."
              : <>Estamos preparando nossa coleção de camisas.<br className="desktop-break" /> Este é só o começo.</>}
          </p>
          <Link className="button" href="/produtos">Conheça a coleção<span aria-hidden="true">↗</span></Link>
          {!hasProducts && <span className="hero-note">As compras ainda não estão disponíveis.</span>}
        </div>
        <div className="brand-composition" aria-hidden="true">
          <div className="composition-top"><span>SOLE</span><span>CAMISARIA</span></div>
          <div className="composition-frame"><span className="composition-letter">S</span><span className="composition-period">.</span></div>
          <div className="composition-bottom"><span>UM NOVO CAPÍTULO</span><span>{hasProducts ? "COLEÇÃO DISPONÍVEL" : "EM BREVE"} ↗</span></div>
        </div>
      </section>

      {hasProducts && (
        <section className="catalog-section home-catalog" aria-labelledby="published-collection-title">
          <div className="catalog-header">
            <p className="eyebrow">COLEÇÃO DISPONÍVEL</p>
            <h2 id="published-collection-title">Peças para vestir o presente.</h2>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <Link href={"/produtos/" + product.slug} className="product-card-link">
                  <div className="product-image">
                    {product.images[0]
                      ? <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 700px) 100vw, 33vw" />
                      : <div className="admin-product-placeholder">S</div>}
                  </div>
                  <div className="product-card-details">
                    <h2>{product.name}</h2>
                    <p className="product-card-price">{formatHomePrice(product.variants[0]?.priceInCents ?? 0)}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="collection-intro" aria-labelledby="collection-title">
        <p className="eyebrow">A COLEÇÃO</p>
        <h2 id="collection-title">{hasProducts ? <>O próximo capítulo<br />começa agora.</> : <>O próximo capítulo<br />começa aqui.</>}</h2>
        <div>
          <p>{hasProducts ? "Explore as camisas SOLE e escolha a sua combinação de tamanho e cor." : "Em breve, este espaço recebe as camisas SOLE. Por enquanto, nossa coleção está em preparação."}</p>
          <Link className="text-link" href="/produtos">Acompanhe a coleção <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
