import Image from "next/image";
import Link from "next/link";
import { archiveProductAction } from "@/app/admin/actions";
import { parseCatalog } from "@/domain/catalog/product";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

const statusLabel = { draft: "Rascunho", published: "Publicado", archived: "Arquivado" } as const;

export default async function AdminProductsPage() {
  const products = parseCatalog(await catalogRepository.read());
  return <><header className="admin-page-header"><div><p className="admin-kicker">CATÁLOGO</p><h1>Produtos</h1><p>Peças, fotos, variantes e estoque em um só lugar.</p></div><Link className="admin-primary" href="/admin/produtos/novo">Nova peça</Link></header>{products.length ? <div className="admin-product-list">{products.map((product) => <article className="admin-product-row" key={product.id}>{product.images[0] ? <div className="admin-product-thumb"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="72px" /></div> : <div className="admin-product-thumb admin-product-placeholder">S.</div>}<div className="admin-product-copy"><div><h2>{product.name}</h2><span className={`status-badge status-${product.status}`}>{statusLabel[product.status]}</span></div><p>{product.variants.length} variação(ões) · {product.variants.reduce((sum, variant) => sum + variant.stock, 0)} unidade(s)</p></div><div className="row-actions"><Link href={`/admin/produtos/${product.id}`}>Editar</Link>{product.status !== "archived" ? <form action={archiveProductAction}><input type="hidden" name="id" value={product.id} /><button>Arquivar</button></form> : null}</div></article>)}</div> : <section className="admin-card admin-empty"><span>S.</span><h2>Nenhuma peça cadastrada.</h2><p>Comece pelas fotos e informações da primeira camisa.</p><Link className="admin-primary" href="/admin/produtos/novo">Cadastrar primeira peça</Link></section>}</>;
}
